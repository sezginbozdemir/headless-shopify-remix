import { getProductsQuery } from "./queries/products";
import { getClient } from "./client";
import {
  Product,
  Collection,
  Connection,
  Menu,
  ShopifyCart,
  Page,
  ShopifyProduct,
} from "./types";
import {
  getCollectionProductsQuery,
  getCollectionsQuery,
} from "./queries/collections";
import { getMenuQuery } from "./queries/menu";
import {
  addToCartMutation,
  createCartMutation,
  editCartItemsMutation,
  removeFromCartMutation,
} from "./mutations/cart";
import { cartIdCookie } from "../cookies";
import { getCartQuery } from "./queries/cart";
import { getPageQuery, getPagesQuery } from "./queries/page";
const client = getClient();

type ProductVariables = {
  first: number;
  filters?: string;
  after?: string;
  sortKey?: string;
};

interface ProductsProps {
  filters?: string;
  sortKey?: string;
}
interface CollectionProductsProps {
  filters?: string;
  sortKey?: string;
  collection: string;
}

const removeEdgesAndNodes = <T>(array: Connection<T>): T[] => {
  return array.edges.map((edge) => edge?.node);
};
const reshapeProduct = (product: ShopifyProduct) => {
  const { images, variants, collections, ...rest } = product;

  return {
    ...rest,
    images: removeEdgesAndNodes(images),
    variants: removeEdgesAndNodes(variants),
    collections: removeEdgesAndNodes(collections),
  };
};
const reshapeProducts = (products: ShopifyProduct[]) => {
  const reshapedProducts = [];

  for (const product of products) {
    if (product) {
      const reshapedProduct = reshapeProduct(product);

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }

  return reshapedProducts;
};

export async function getProducts({
  filters,
  sortKey,
}: ProductsProps = {}): Promise<Product[]> {
  const allProducts: Product[] = [];
  let hasNextPage = true;
  let endCursor: string | null = null;

  try {
    while (hasNextPage) {
      const variables: ProductVariables = { first: 250, filters, sortKey };
      if (endCursor) variables.after = endCursor;

      const response = await client.request(getProductsQuery, {
        variables,
      });

      const products: Product[] = reshapeProducts(
        removeEdgesAndNodes(response.data.products)
      );
      allProducts.push(...products);

      hasNextPage = response.data.products.pageInfo.hasNextPage;
      endCursor = response.data.products.pageInfo.endCursor;
    }
  } catch (err) {
    console.error("Error fetching products:", err);
    throw new Error("Unable to fetch products.");
  }

  return allProducts;
}

export async function getCollections(): Promise<Collection[]> {
  try {
    const response = await client.request(getCollectionsQuery);

    return removeEdgesAndNodes(response.data.collections);
  } catch (err) {
    console.error("Error fetching collections:", err);
    throw new Error("Unable to fetch collections.");
  }
}

export async function getCollectionProducts({
  collection,
  sortKey,
}: CollectionProductsProps): Promise<Product[]> {
  try {
    const variables = {
      sortKey,
      handle: collection,
    };

    const response = await client.request(getCollectionProductsQuery, {
      variables,
    });
    const products: Product[] = removeEdgesAndNodes(
      response.data.collection.products
    );
    return products;
  } catch (err) {
    console.error("Error fetching products:", err);
    throw new Error("Unable to fetch products.");
  }
}

export async function getMenu(handle: string): Promise<Menu[]> {
  try {
    const variables = { handle };

    const res = await client.request(getMenuQuery, {
      variables,
    });

    return res.data.menu.items;
  } catch (err) {
    console.error("Failed to fetch menu", err);
    throw new Error("Unable to fetch menu.");
  }
}

export async function createCart(
  lines: { merchandiseId: string; quantity: number }[],
  buyerIdentity?: string
): Promise<ShopifyCart> {
  try {
    const variables = {
      lines,
      buyerIdentity,
    };

    const res = await client.request(createCartMutation, { variables });

    return res.data.cartCreate.cart;
  } catch (err) {
    console.error("Failed to create cart", err);
    throw new Error("Unable to create cart.");
  }
}

export async function addToCart(
  request: Request,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<ShopifyCart> {
  try {
    const cookieHeader = request.headers.get("Cookie");
    const cartId = await cartIdCookie.parse(cookieHeader);

    const variables = {
      cartId,
      lines,
    };

    const res = await client.request(addToCartMutation, { variables });

    return res.data.cartLinesAdd.cart;
  } catch (err) {
    console.error("Failed to add to cart", err);
    throw new Error("Unable to add to cart.");
  }
}

export async function removeFromCart(
  request: Request,
  lineIds: string[]
): Promise<ShopifyCart> {
  try {
    const cookieHeader = request.headers.get("Cookie");
    const cartId = await cartIdCookie.parse(cookieHeader);

    const variables = {
      cartId,
      lineIds,
    };

    const res = await client.request(removeFromCartMutation, { variables });

    return res.data.cartLinesRemove.cart;
  } catch (err) {
    console.error("Failed to remove from cart", err);
    throw new Error("Unable to remove from cart.");
  }
}

export async function updateCart(
  request: Request,
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<ShopifyCart> {
  try {
    const cookieHeader = request.headers.get("Cookie");
    const cartId = await cartIdCookie.parse(cookieHeader);

    const variables = {
      cartId,
      lines,
    };

    const res = await client.request(editCartItemsMutation, { variables });

    return res.data.cartLinesUpdate.cart;
  } catch (err) {
    console.error("Failed to update cart", err);
    throw new Error("Unable to update cart.");
  }
}
export async function getCart(
  request: Request
): Promise<ShopifyCart | undefined> {
  try {
    const cookieHeader = request.headers.get("Cookie");
    const cartId = await cartIdCookie.parse(cookieHeader);
    if (!cartId) {
      console.error("No cart");
      return undefined;
    }

    const variables = { cartId };

    const res = await client.request(getCartQuery, { variables });

    return res.data.cart;
  } catch (err) {
    console.error("Failed to get cart", err);
    throw new Error("Unable to get cart.");
  }
}

export async function getPage(handle: string): Promise<Page> {
  try {
    const variables = { handle };

    const res = await client.request(getPageQuery, {
      variables,
    });

    return res.data.pageByHandle;
  } catch (err) {
    console.error("Failed to get page", err);
    throw new Error("Unable to get page.");
  }
}
export async function getPages(): Promise<Page[]> {
  try {
    const res = await client.request(getPagesQuery, {});

    return removeEdgesAndNodes(res.data.pages);
  } catch (err) {
    console.error("Failed to get pages", err);
    throw new Error("Unable to get pages.");
  }
}
