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
  ProductsResult,
  ProductFilter,
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
import { searchProductsQuery } from "./queries/search";
import { extractUniqueOptions } from "../utils";
import { getProductMetaQuery } from "./queries/metadata";
const client = getClient();

type ProductVariables = {
  reverse?: boolean;
  first?: number;
  last?: number;
  query?: string;
  filters?: ProductFilter[];
  after?: string;
  before?: string;
  sortKey?: string;
  handle?: string;
};

interface ProductsProps {
  query?: string;
  sortKey?: string;
  after?: string;
  before?: string;
  filters?: ProductFilter[];
  reverse?: boolean;
}
interface CollectionProductsProps {
  after?: string;
  before?: string;
  sortKey?: string;
  collection: string;
  filters?: ProductFilter[];
  reverse?: boolean;
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

export async function getSearchProducts({
  sortKey,
  after,
  before,
  filters,
  query,
  reverse,
}: ProductsProps = {}): Promise<ProductsResult> {
  try {
    let variables: ProductVariables = { reverse, sortKey, filters, query };
    if (after) {
      variables = { ...variables, first: 16, after };
    } else if (before) {
      variables = { ...variables, last: 16, before };
    } else {
      variables = { ...variables, first: 16 };
    }
    const response = await client.request(searchProductsQuery, {
      variables,
    });
    const products: Product[] = reshapeProducts(
      removeEdgesAndNodes(response.data.search)
    );

    const next = response.data.search.pageInfo.hasNextPage;
    const prev = response.data.search.pageInfo.hasPreviousPage;
    const end = response.data.search.pageInfo.endCursor;
    const start = response.data.search.pageInfo.startCursor;
    return { next, prev, end, products, start };
  } catch (err) {
    console.error("Error fetching products:", err);
    throw new Error("Unable to fetch products.");
  }
}
export async function getProductMeta(): Promise<{
  brands: string[];
  types: string[];
  options: Record<string, string[]>;
}> {
  try {
    const allProducts: Product[] = [];
    let hasNextPage = true;
    let after: string | undefined = undefined;

    while (hasNextPage) {
      const variables: ProductVariables = {
        after,
      };

      const response = await client.request(getProductMetaQuery, { variables });
      const productsBatch: Product[] = removeEdgesAndNodes(
        response.data.products
      );
      allProducts.push(...productsBatch);

      const pageInfo = response.data.products.pageInfo;
      hasNextPage = pageInfo.hasNextPage;
      after = pageInfo.endCursor;
    }
    const brandsSet = new Set<string>();
    const typesSet = new Set<string>();

    for (const product of allProducts) {
      if (product.vendor) brandsSet.add(product.vendor);
      if (product.productType) typesSet.add(product.productType);
    }

    return {
      brands: Array.from(brandsSet).sort(),
      types: Array.from(typesSet).sort(),
      options: extractUniqueOptions(allProducts),
    };
  } catch (err) {
    console.error("Error fetching options:", err);
    throw new Error("Unable to fetch all options.");
  }
}
export async function getProducts({
  query,
  sortKey,
  after,
  before,
  reverse,
}: ProductsProps = {}): Promise<ProductsResult> {
  try {
    let variables: ProductVariables = { reverse, query, sortKey };
    if (after) {
      variables = { ...variables, first: 16, after };
    } else if (before) {
      variables = { ...variables, last: 16, before };
    } else {
      variables = { ...variables, first: 16 };
    }
    const response = await client.request(getProductsQuery, {
      variables,
    });
    const products: Product[] = reshapeProducts(
      removeEdgesAndNodes(response.data.products)
    );

    const next = response.data.products.pageInfo.hasNextPage;
    const prev = response.data.products.pageInfo.hasPreviousPage;
    const end = response.data.products.pageInfo.endCursor;
    const start = response.data.products.pageInfo.startCursor;
    return { next, prev, end, products, start };
  } catch (err) {
    console.error("Error fetching products:", err);
    throw new Error("Unable to fetch products.");
  }
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
  filters,
  after,
  before,
  reverse,
}: CollectionProductsProps): Promise<ProductsResult> {
  try {
    let variables: ProductVariables = {
      sortKey,
      handle: collection,
      filters: filters,
      reverse,
    };
    if (after) {
      variables = { ...variables, first: 16, after };
    } else if (before) {
      variables = { ...variables, last: 16, before };
    } else {
      variables = { ...variables, first: 16 };
    }

    const response = await client.request(getCollectionProductsQuery, {
      variables,
    });
    const products: Product[] = reshapeProducts(
      removeEdgesAndNodes(response.data.collection.products)
    );
    const next = response.data.collection.products.pageInfo.hasNextPage;
    const prev = response.data.collection.products.pageInfo.hasPreviousPage;
    const end = response.data.collection.products.pageInfo.endCursor;
    const start = response.data.collection.products.pageInfo.startCursor;
    return { next, prev, end, products, start };
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
