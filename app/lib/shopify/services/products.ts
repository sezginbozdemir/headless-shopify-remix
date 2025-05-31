import { getProductsQuery } from "../queries/products";
import { getClient } from "../client";
import {
  Product,
  Collection,
  ProductsResult,
  ProductFilter,
  ApiResult,
} from "../types";
import {
  getCollectionProductsQuery,
  getCollectionsQuery,
} from "../queries/collections";
import { searchProductsQuery } from "../queries/search";
import {
  cleanCollections,
  removeEdgesAndNodes,
  reshapeProduct,
  reshapeProducts,
} from "../utils";
import { getProductQuery } from "../queries/product";
import { getRelatedProductsQuery } from "../queries/related-products";
import { createLogger } from "@/lib/logger"; // Assuming same logger creation method

const client = getClient();
const logger = createLogger("SHOPIFY PRODUCTS MODULE");

/**
 * Variables used for querying products with pagination, filtering, and sorting.
 */
export type ProductVariables = {
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
export interface CollectionProductsProps {
  after?: string;
  before?: string;
  sortKey?: string;
  collection: string;
  filters?: ProductFilter[];
  reverse?: boolean;
}

/**
 * Fetches products matching a search query, with support for pagination, filters, and sorting.
 * @param props - Search parameters including query, pagination cursors, filters, and sorting.
 * @returns ApiResult wrapping ProductsResult with products and page info.
 */
export async function getSearchProducts({
  sortKey,
  after,
  before,
  filters,
  query,
  reverse,
}: ProductsProps = {}): Promise<ApiResult<ProductsResult>> {
  try {
    logger.startTimer("getSearchProducts");
    logger.info("getSearchProducts: Starting function");
    logger.debug("getSearchProducts: Input params", {
      sortKey,
      after,
      before,
      filters,
      query,
      reverse,
    });

    let variables: ProductVariables = { reverse, sortKey, filters, query };
    if (after) {
      variables = { ...variables, first: 16, after };
    } else if (before) {
      variables = { ...variables, last: 16, before };
    } else {
      variables = { ...variables, first: 16 };
    }
    logger.debug("getSearchProducts: Query variables set", variables);

    const response = await client.request(searchProductsQuery, {
      variables,
    });

    if (!response.data) {
      logger.error("getSearchProducts: No data in response", response.errors);
      logger.endTimer("getSearchProducts");
      return {
        success: false,
        error: "getSearchProducts: Server error, please try again later.",
      };
    }

    const products: Product[] = reshapeProducts(
      removeEdgesAndNodes(response.data.search)
    );

    logger.debug(
      `getSearchProducts: Reshaped products count: ${products.length}`
    );

    const next = response.data.search.pageInfo.hasNextPage;
    const prev = response.data.search.pageInfo.hasPreviousPage;
    const end = response.data.search.pageInfo.endCursor;
    const start = response.data.search.pageInfo.startCursor;
    const availableFilters = response.data.search.productFilters;
    const count = response.data.search.totalCount;

    logger.info(
      `getSearchProducts: Returning ${products.length} products, next: ${next}, prev: ${prev}`
    );
    logger.endTimer("getSearchProducts");

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
    logger.error("getSearchProducts: Unexpected error", err!);
    logger.endTimer("getSearchProducts");
    return { success: false, error: "getSearchProducts: unknown error" };
  }
}

/**
 * Fetches a list of products with optional filtering, sorting, and pagination.
 * @param props - Query parameters including pagination and sorting.
 * @returns ApiResult wrapping ProductsResult.
 */
export async function getProducts({
  query,
  sortKey,
  after,
  before,
  reverse,
}: ProductsProps = {}): Promise<ApiResult<ProductsResult>> {
  try {
    logger.startTimer("getProducts");
    logger.info("getProducts: Starting function");
    logger.debug("getProducts: Input params", {
      query,
      sortKey,
      after,
      before,
      reverse,
    });

    let variables: ProductVariables = { reverse, query, sortKey };
    if (after) {
      variables = { ...variables, first: 16, after };
    } else if (before) {
      variables = { ...variables, last: 16, before };
    } else {
      variables = { ...variables, first: 16 };
    }
    logger.debug("getProducts: Query variables set", variables);

    const response = await client.request(getProductsQuery, {
      variables,
    });

    if (!response.data) {
      logger.error("getProducts: No data in response", response.errors);
      logger.endTimer("getProducts");
      return {
        success: false,
        error: "getProducts: Server error, please try again later.",
      };
    }

    const products: Product[] = reshapeProducts(
      removeEdgesAndNodes(response.data.products)
    );

    logger.debug(`getProducts: Reshaped products count: ${products.length}`);

    const next = response.data.products.pageInfo.hasNextPage;
    const prev = response.data.products.pageInfo.hasPreviousPage;
    const end = response.data.products.pageInfo.endCursor;
    const start = response.data.products.pageInfo.startCursor;

    logger.info(
      `getProducts: Returning ${products.length} products, next: ${next}, prev: ${prev}`
    );
    logger.endTimer("getProducts");

    return { success: true, result: { next, prev, end, products, start } };
  } catch (err) {
    logger.error("getProducts: Unexpected error", err!);
    logger.endTimer("getProducts");
    return { success: false, error: "getProducts: unknown error" };
  }
}

/**
 * Fetches detailed information for a single product by handle.
 * @param handle - Unique product handle string.
 * @returns ApiResult wrapping a Product.
 */
export async function getProduct(handle: string): Promise<ApiResult<Product>> {
  try {
    logger.startTimer("getProduct");
    logger.info(`getProduct: Starting function for handle=${handle}`);

    const variables = { handle };
    logger.debug("getProduct: Query variables set", variables);

    const response = await client.request(getProductQuery, {
      variables,
    });

    if (!response.data || !response.data.product) {
      logger.error(
        "getProduct: No data or product in response",
        response.errors
      );
      logger.endTimer("getProduct");
      return {
        success: false,
        error: "getProduct: Server error, please try again later.",
      };
    }

    const product = reshapeProduct(response.data.product);

    logger.info(`getProduct: Returning product with handle=${handle}`);
    logger.endTimer("getProduct");

    return { success: true, result: product };
  } catch (err) {
    logger.error("getProduct: Unexpected error", err!);
    logger.endTimer("getProduct");
    return { success: false, error: "getProduct: unknown error" };
  }
}

/**
 * Fetches all collections available in the store.
 * @returns ApiResult wrapping an array of Collection objects.
 */
export async function getCollections(): Promise<ApiResult<Collection[]>> {
  logger.info("getCollections: Starting function");
  const timerId = `getCollections-${Math.random().toString(36).slice(2, 5)}`;
  try {
    logger.startTimer(timerId);

    const response = await client.request(getCollectionsQuery);

    if (!response.data) {
      logger.error("getCollections: No data in response", response.errors);
      logger.endTimer(timerId);
      return {
        success: false,
        error: "getCollections: Server error, please try again later.",
      };
    }

    const collections: Collection[] = cleanCollections(
      response.data.collections
    );

    logger.info(`getCollections: Returning ${collections.length} collections`);
    logger.endTimer(timerId);

    return { success: true, result: collections };
  } catch (err) {
    logger.error("getCollections: Unexpected error", err!);
    logger.endTimer(timerId);
    return { success: false, error: "getCollections: unknown error" };
  }
}

/**
 * Fetches products within a specific collection, with optional pagination, filters, and sorting.
 * @param props - Parameters including collection handle, filters, pagination, and sorting.
 * @returns ApiResult wrapping ProductsResult.
 */
export async function getCollectionProducts({
  collection,
  sortKey,
  filters,
  after,
  before,
  reverse,
}: CollectionProductsProps): Promise<ApiResult<ProductsResult>> {
  try {
    logger.startTimer("getCollectionProducts");
    logger.info(
      `getCollectionProducts: Starting function for collection=${collection}`
    );
    logger.debug("getCollectionProducts: Input params", {
      collection,
      sortKey,
      filters,
      after,
      before,
      reverse,
    });

    let variables: ProductVariables = {
      sortKey,
      handle: collection,
      filters,
      reverse,
    };
    if (after) {
      variables = { ...variables, first: 16, after };
    } else if (before) {
      variables = { ...variables, last: 16, before };
    } else {
      variables = { ...variables, first: 16 };
    }

    logger.debug("getCollectionProducts: Query variables set", variables);

    const response = await client.request(getCollectionProductsQuery, {
      variables,
    });

    if (!response.data) {
      logger.error(
        "getCollectionProducts: No data in response",
        response.errors
      );
      logger.endTimer("getCollectionProducts");
      return {
        success: false,
        error: "getCollectionProducts: Server error, please try again later.",
      };
    }

    const products: Product[] = reshapeProducts(
      removeEdgesAndNodes(response.data.collection.products)
    );

    logger.debug(
      `getCollectionProducts: Reshaped products count: ${products.length}`
    );

    const next = response.data.collection.products.pageInfo.hasNextPage;
    const prev = response.data.collection.products.pageInfo.hasPreviousPage;
    const end = response.data.collection.products.pageInfo.endCursor;
    const start = response.data.collection.products.pageInfo.startCursor;
    const availableFilters = response.data.collection.products.filters;

    logger.info(
      `getCollectionProducts: Returning ${products.length} products for collection=${collection}`
    );
    logger.endTimer("getCollectionProducts");

    return {
      success: true,
      result: { next, prev, end, products, start, filters: availableFilters },
    };
  } catch (err) {
    logger.error("getCollectionProducts: Unexpected error", err!);
    logger.endTimer("getCollectionProducts");
    return { success: false, error: "getCollectionProducts: unknown error" };
  }
}

/**
 * Fetches products related to a specified product by handle.
 * @param handle - Product handle to find related product recommendations.
 * @returns ApiResult wrapping an array of related Products.
 */
export async function getRelatedProducts(
  handle: string
): Promise<ApiResult<Product[]>> {
  try {
    logger.startTimer("getRelatedProducts");
    logger.info(`getRelatedProducts: Starting function for handle=${handle}`);

    const response = await client.request(getRelatedProductsQuery, {
      variables: { handle },
    });

    if (!response.data) {
      logger.error("getRelatedProducts: No data in response", response.errors);
      logger.endTimer("getRelatedProducts");
      return { success: false, error: "Server error please try again later." };
    }

    if (!response.data.productRecommendations) {
      logger.error("getRelatedProducts: Missing productRecommendations");
      logger.endTimer("getRelatedProducts");
      return {
        success: false,
        error: "An unknown error occurred",
      };
    }

    const products = reshapeProducts(response.data.productRecommendations);

    logger.info(
      `getRelatedProducts: Returning ${products.length} related products`
    );
    logger.endTimer("getRelatedProducts");

    return { success: true, result: products };
  } catch (err) {
    logger.error("getRelatedProducts: Unexpected error", err!);
    logger.endTimer("getRelatedProducts");
    return { success: false, error: "Unknown error" };
  }
}
