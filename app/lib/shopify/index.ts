import { getProductsQuery } from "./queries/products";
import { getClient } from "./client";
import {
  Product,
  Collection,
  Menu,
  Page,
  ProductsResult,
  ProductFilter,
  CustomerCreateResponse,
  CustomerFormData,
  Customer,
  AccessTokenFormData,
  AccessTokenResponse,
  ShopifyCustomer,
  ApiResult,
  Cart,
  ShopInfo,
  ShopifyFilter,
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
import { getCartQuery } from "./queries/cart";
import { getPageQuery, getPagesQuery } from "./queries/page";
import { searchProductsQuery } from "./queries/search";
import {
  createAccessTokenMutation,
  createCustomerMutation,
  customerRecoverMutation,
} from "./mutations/customer";
import { ClientResponse } from "@shopify/storefront-api-client";
import { getCustomerQuery } from "./queries/customer";
import { commitSession, getSession } from "../session.server";
import {
  cleanCollections,
  removeEdgesAndNodes,
  reshapeCart,
  reshapeCustomer,
  reshapeProducts,
} from "./utils";
import { getShopQuery } from "./queries/shop";
import { getTypesQuery } from "./queries/types";
import { getFiltersQuery } from "./queries/filters";
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

export async function getSearchProducts({
  sortKey,
  after,
  before,
  filters,
  query,
  reverse,
}: ProductsProps = {}): Promise<ApiResult<ProductsResult>> {
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
    if (!response.data) {
      console.log(response.errors);
      return {
        success: false,
        error: "getSearchProducts: Server error, please try again later.",
      };
    }
    const products: Product[] = reshapeProducts(
      removeEdgesAndNodes(response.data.search)
    );
    const next = response.data.search.pageInfo.hasNextPage;
    const prev = response.data.search.pageInfo.hasPreviousPage;
    const end = response.data.search.pageInfo.endCursor;
    const start = response.data.search.pageInfo.startCursor;
    const availableFilters = response.data.search.productFilters;
    const count = response.data.search.totalCount;

    return {
      success: true,
      result: {
        next,
        prev,
        end,
        products,
        start,
        filters: availableFilters,
        count,
      },
    };
  } catch (err) {
    console.log("Error fetching search products:", err);
    return { success: false, error: "getSearchProducts: unknown error" };
  }
}
export async function getProducts({
  query,
  sortKey,
  after,
  before,
  reverse,
}: ProductsProps = {}): Promise<ApiResult<ProductsResult>> {
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
    if (!response.data) {
      console.log(response.errors);
      return {
        success: false,
        error: "getProducts: Server error, please try again later.",
      };
    }

    const products: Product[] = reshapeProducts(
      removeEdgesAndNodes(response.data.products)
    );

    const next = response.data.products.pageInfo.hasNextPage;
    const prev = response.data.products.pageInfo.hasPreviousPage;
    const end = response.data.products.pageInfo.endCursor;
    const start = response.data.products.pageInfo.startCursor;
    return { success: true, result: { next, prev, end, products, start } };
  } catch (err) {
    console.log("Error fetching products:", err);
    return { success: false, error: "getProducts: unknown error" };
  }
}

export async function getCollections(): Promise<ApiResult<Collection[]>> {
  try {
    const response = await client.request(getCollectionsQuery);
    if (!response.data) {
      console.log(response.errors);
      return {
        success: false,
        error: "getCollections: Server error, please try again later.",
      };
    }
    const collections: Collection[] = cleanCollections(
      response.data.collections
    );

    return { success: true, result: collections };
  } catch (err) {
    console.error("Error fetching collections:", err);
    return { success: false, error: "getCollections: unknown error" };
  }
}

export async function getFilters({
  collection,
}: CollectionProductsProps): Promise<ApiResult<ShopifyFilter[]>> {
  try {
    const variables: ProductVariables = { handle: collection };

    const response = await client.request(getFiltersQuery, {
      variables,
    });
    if (!response.data) {
      console.log(response.errors);
      return {
        success: false,
        error: "getFilters: Server error, please try again later.",
      };
    }

    const collectionRes = response.data?.collection;

    if (!collectionRes || !collectionRes.products) {
      console.log(
        "Missing collection or products in response:",
        response.errors?.graphQLErrors
      );
      return {
        success: false,
        error: "getFilters: Collection not found or no products available.",
      };
    }
    const availableFilters = response.data.collection.products.filters;
    return {
      success: true,
      result: availableFilters,
    };
  } catch (err) {
    console.error("Error fetching filters:", err);
    return { success: false, error: "getFilters: unknown error" };
  }
}

export async function getCollectionProducts({
  collection,
  sortKey,
  filters,
  after,
  before,
  reverse,
}: CollectionProductsProps): Promise<ApiResult<ProductsResult>> {
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
    if (!response.data) {
      console.log(response.errors);
      return {
        success: false,
        error: "getCollectionProducts: Server error, please try again later.",
      };
    }

    const products: Product[] = reshapeProducts(
      removeEdgesAndNodes(response.data.collection.products)
    );
    const next = response.data.collection.products.pageInfo.hasNextPage;
    const prev = response.data.collection.products.pageInfo.hasPreviousPage;
    const end = response.data.collection.products.pageInfo.endCursor;
    const start = response.data.collection.products.pageInfo.startCursor;
    const availableFilters = response.data.collection.products.filters;
    return {
      success: true,
      result: { next, prev, end, products, start, filters: availableFilters },
    };
  } catch (err) {
    console.error("Error fetching collection products:", err);
    return { success: false, error: "getCollectionProducts: unknown error" };
  }
}

export async function getMenu(handle: string): Promise<ApiResult<Menu[]>> {
  try {
    const variables = { handle };

    const res = await client.request(getMenuQuery, {
      variables,
    });
    if (!res.data) {
      console.log(res.errors);
      return {
        success: false,
        error: "getMenu: Server error, please try again later.",
      };
    }

    const menuItems: Menu[] = res.data.menu.items;
    return { success: true, result: menuItems };
  } catch (err) {
    console.error("Failed to fetch menu", err);
    return { success: false, error: "getMenu: unknown error" };
  }
}

export async function createCart(
  request: Request,
  lines: { merchandiseId: string; quantity: number }[],
  buyerIdentity?: { customerAccessToken: string }
): Promise<ApiResult<{ headers: Headers; cart: Cart }>> {
  const session = await getSession(request.headers.get("Cookie"));
  try {
    const variables = {
      lines,
      buyerIdentity,
    };

    const res = await client.request(createCartMutation, { variables });
    if (!res.data) {
      console.log(res.errors);
      return {
        success: false,
        error: "createCart:Server error please try again later.",
      };
    }
    if (!res.data.cartCreate.cart) {
      const errors = res.data.cartCreate.userErrors;
      console.log(errors);
      return {
        success: false,
        error: errors[0]?.message || "createCart:An unknown error occurred",
      };
    }

    const cartId = res.data.cartCreate.cart.id;
    const cart = reshapeCart(res.data.cartCreate.cart);

    session.set("cartId", cartId);
    const headers = new Headers();

    headers.append("Set-Cookie", await commitSession(session));

    return { success: true, result: { headers, cart } };
  } catch (err) {
    console.log("Error creating cart:", err);
    return { success: false, error: "createcart: Unknown error" };
  }
}

export async function addToCart(
  request: Request,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<ApiResult<{ headers: Headers; cart: Cart }>> {
  const session = await getSession(request.headers.get("Cookie"));
  const cartId = session.get("cartId");
  const customerToken = session.get("customerToken");
  const buyerIdentity = { customerAccessToken: customerToken };

  try {
    if (!cartId) {
      const createResult = await createCart(request, lines, buyerIdentity);
      if (!createResult.success) {
        return { success: false, error: createResult.error };
      }
      const headers = createResult.result.headers;
      const cart = createResult.result.cart;
      return { success: true, result: { headers, cart } };
    }
    const variables = {
      cartId,
      lines,
    };

    const res = await client.request(addToCartMutation, { variables });
    if (!res.data) {
      console.log(res.errors);
      return {
        success: false,
        error: "addtoCart:Server error please try again later.",
      };
    }
    if (!res.data.cartLinesAdd.cart) {
      const errors = res.data.cartLinesAdd.userErrors;
      console.log(errors);
      return {
        success: false,
        error: errors[0]?.message || "addtoCart:An unknown error occurred",
      };
    }
    const cart = reshapeCart(res.data.cartLinesAdd.cart);
    const headers = new Headers();

    return { success: true, result: { headers: headers, cart } };
  } catch (err) {
    console.log("Error adding to cart:", err);
    return { success: false, error: "addtoCart:Unknown error" };
  }
}

export async function removeFromCart(
  request: Request,
  lineIds: string[]
): Promise<ApiResult<Cart>> {
  const session = await getSession(request.headers.get("Cookie"));

  try {
    const cartId = session.get("cartId");

    const variables = {
      cartId,
      lineIds,
    };

    const res = await client.request(removeFromCartMutation, { variables });
    if (!res.data) {
      console.log(res.errors);
      return {
        success: false,
        error: "removeFromCart:Server error please try again later.",
      };
    }
    if (!res.data.cartLinesRemove.cart) {
      const errors = res.data.cartLinesRemove.userErrors;
      console.log(errors);
      return {
        success: false,
        error: errors[0]?.message || "removeFromCart:An unknown error occurred",
      };
    }
    const cart = reshapeCart(res.data.cartLinesRemove.cart);

    return { success: true, result: cart };
  } catch (err) {
    console.log("error removing from cart", err);
    return { success: false, error: "removeFromCart:Unknown error" };
  }
}

export async function updateCart(
  request: Request,
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<ApiResult<Cart>> {
  const session = await getSession(request.headers.get("Cookie"));

  try {
    const cartId = session.get("cartId");

    const variables = {
      cartId,
      lines,
    };

    const res = await client.request(editCartItemsMutation, { variables });

    if (!res.data) {
      console.log(res.errors);
      return {
        success: false,
        error: "updateCart:Server error please try again later.",
      };
    }
    if (!res.data.cartLinesUpdate.cart) {
      const errors = res.data.cartLinesUpdate.userErrors;
      console.log(errors);
      return {
        success: false,
        error: errors[0]?.message || "updateCart:An unknown error occurred",
      };
    }
    const cart = reshapeCart(res.data.cartLinesUpdate.cart);

    return { success: true, result: cart };
  } catch (err) {
    console.log("error updating cart", err);
    return { success: false, error: "updateCart:Unknown error" };
  }
}
export async function getCart(request: Request): Promise<ApiResult<Cart>> {
  try {
    const session = await getSession(request.headers.get("Cookie"));
    const cartId = session.get("cartId");
    if (!cartId) {
      console.log("No cart for customer yet");
      return { success: false, error: "NO_CART" };
    }

    const variables = { cartId };

    const res = await client.request(getCartQuery, { variables });
    if (!res.data) {
      console.log(res.errors);
      return {
        success: false,
        error: "getCart:Server error please try again later.",
      };
    }

    if (res.data.cart === null) {
      console.log(res.errors);
      return {
        success: false,
        error: "ORDERED_CART",
      };
    }

    return { success: true, result: reshapeCart(res.data.cart) };
  } catch (err) {
    console.log("error feetching cart", err);
    return { success: false, error: "getCart:Unknown error" };
  }
}

export async function getPage(handle: string): Promise<ApiResult<Page>> {
  try {
    const variables = { handle };

    const res = await client.request(getPageQuery, {
      variables,
    });
    if (!res.data) {
      console.log(res.errors);
      return {
        success: false,
        error: "getPage:Server error please try again later.",
      };
    }

    return { success: true, result: res.data.pageByHandle };
  } catch (err) {
    console.log("Failed to get page", err);
    return { success: false, error: "getPage:Unknown error" };
  }
}
export async function getPages(): Promise<ApiResult<Page[]>> {
  try {
    const res = await client.request(getPagesQuery, {});
    if (!res.data) {
      console.log(res.errors);
      return {
        success: false,
        error: "getPages:Server error please try again later.",
      };
    }

    return { success: true, result: removeEdgesAndNodes(res.data.pages) };
  } catch (err) {
    console.log("Failed to get pages", err);
    return { success: false, error: "getPages:Unknown error" };
  }
}

export async function recoverCustomer(email: string): Promise<ApiResult> {
  try {
    const response = await client.request(customerRecoverMutation, {
      variables: { email },
    });
    if (!response.data) {
      console.log(response.errors);
      return { success: false, error: "Server error please try again later." };
    }
    if (response.data.customerRecover.userErrors) {
      const errors = response.data.customerRecover.userErrors;
      console.log(errors);
      return {
        success: false,
        error: errors[0]?.message || "An unknown error occurred",
      };
    }
    return { success: true, result: undefined };
  } catch (err) {
    return { success: false, error: "Unknown error" };
  }
}

export async function createCustomer(
  customerData: CustomerFormData
): Promise<ApiResult> {
  try {
    const response: ClientResponse<CustomerCreateResponse> =
      await client.request(createCustomerMutation, {
        variables: {
          input: { ...customerData },
        },
      });
    if (!response.data) {
      console.log(response.errors);
      return { success: false, error: "Server error please try again later." };
    }
    if (!response.data.customerCreate.customer) {
      const errors = response.data.customerCreate.customerUserErrors;
      console.log(errors);
      return {
        success: false,
        error: errors[0]?.message || "An unknown error occurred",
      };
    }
    return { success: true, result: undefined };
  } catch (err) {
    return { success: false, error: "Unknown error" };
  }
}

export async function createAccessToken(
  tokenData: AccessTokenFormData
): Promise<ApiResult<Headers>> {
  const session = await getSession();

  try {
    const response: ClientResponse<AccessTokenResponse> = await client.request(
      createAccessTokenMutation,
      {
        variables: {
          input: {
            email: tokenData.email,
            password: tokenData.password,
          },
        },
      }
    );
    if (!response.data) {
      console.log(response.errors);
      return { success: false, error: "Server error please try again later." };
    }
    if (!response.data.customerAccessTokenCreate.customerAccessToken) {
      const errors = response.data.customerAccessTokenCreate.userErrors;
      console.log(errors);
      return {
        success: false,
        error: errors[0]?.message || "An unknown error occurred",
      };
    }

    const accessToken =
      response.data.customerAccessTokenCreate.customerAccessToken.accessToken;

    session.set("customerToken", accessToken);
    const headers = new Headers();

    headers.append("Set-Cookie", await commitSession(session));

    return { result: headers, success: true };
  } catch (err) {
    console.log(err);
    return { success: false, error: "Unknown error" };
  }
}

export async function getCustomerInfo(
  request: Request
): Promise<ApiResult<Customer>> {
  const session = await getSession(request.headers.get("Cookie"));
  const accessToken = session.get("customerToken");
  if (!accessToken) {
    return {
      success: false,
      error: "getCustomerInfo: User is not a signed customer",
    };
  }
  try {
    const response: ClientResponse<{ customer: ShopifyCustomer }> =
      await client.request(getCustomerQuery, {
        variables: { accessToken },
      });
    if (!response.data) {
      console.log(response.errors);
      return { success: false, error: "getCustomerInfo: Server error" };
    }
    return { success: true, result: reshapeCustomer(response.data.customer) };
  } catch (err) {
    console.log(err);
    return { success: false, error: "getCustomerInfo: Unknown Error" };
  }
}
export async function getShopInfo(): Promise<ApiResult<ShopInfo>> {
  try {
    const response: ClientResponse<{ shop: ShopInfo }> = await client.request(
      getShopQuery
    );
    if (!response.data) {
      console.log(response.errors);
      return { success: false, error: "getShopInfo: Server error" };
    }
    return { success: true, result: response.data.shop };
  } catch (err) {
    console.log(err);
    return { success: false, error: "getShopInfo: Unknown Error" };
  }
}
export async function getTypes(): Promise<ApiResult<string[]>> {
  try {
    const response: ClientResponse = await client.request(getTypesQuery);
    if (!response.data) {
      console.log(response.errors);
      return { success: false, error: "getTypes: Server error" };
    }
    return {
      success: true,
      result: removeEdgesAndNodes(response.data.productTypes),
    };
  } catch (err) {
    console.log(err);
    return { success: false, error: "getTypes: Unknown Error" };
  }
}
