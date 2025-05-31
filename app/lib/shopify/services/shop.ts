import { getClient } from "../client";
import {
  Menu,
  Page,
  ApiResult,
  ShopInfo,
  ShopifyFilter,
  Metaobject,
} from "../types";
import { getMenuQuery } from "../queries/menu";
import { getPageQuery, getPagesQuery } from "../queries/page";
import { ClientResponse } from "@shopify/storefront-api-client";
import { removeEdgesAndNodes } from "../utils";
import { getShopQuery } from "../queries/shop";
import { getTypesQuery } from "../queries/types";
import { getFiltersQuery } from "../queries/filters";
import { CollectionProductsProps, ProductVariables } from "./products";
import { createLogger } from "@/lib/logger";
import { getMetaObjectsQuery } from "../queries/metaobjects";

// Initialize the Shopify client to send GraphQL requests
const client = getClient();

// Create a logger instance scoped to this module for structured logging
const logger = createLogger("SHOPIFY SHOP INFO MODULE");

/**
 * Fetches available filters for products within a specific collection.
 * @param collection - Handle string identifying the collection
 * @returns ApiResult wrapping an array of ShopifyFilter objects
 */
export async function getFilters({
  collection,
}: CollectionProductsProps): Promise<ApiResult<ShopifyFilter[]>> {
  const timerLabel = `getFilters-${collection}`;
  logger.info(`Starting getFilters for collection: ${collection}`);
  try {
    // Prepare variables for the GraphQL query
    const variables: ProductVariables = { handle: collection };

    logger.startTimer(timerLabel);

    // Send request to fetch filters for the specified collection
    const response = await client.request(getFiltersQuery, { variables });

    // If no data is returned, log errors and return failure result
    if (!response.data) {
      logger.error("getFilters: No data in response", response.errors);
      logger.endTimer(timerLabel);
      return {
        success: false,
        error: "getFilters: Server error, please try again later.",
      };
    }

    // Extract the collection and products from the response
    const collectionRes = response.data?.collection;

    // If collection or products are missing, log and return failure result
    if (!collectionRes || !collectionRes.products) {
      logger.warn(
        "getFilters: Missing collection or products in response",
        response.errors?.graphQLErrors
      );
      logger.endTimer(timerLabel);
      return {
        success: false,
        error: "getFilters: Collection not found or no products available.",
      };
    }

    // Extract available filters from products
    const availableFilters = response.data.collection.products.filters;

    logger.info(
      `getFilters: Successfully fetched filters for collection ${collection}`
    );
    logger.endTimer(timerLabel);

    // Return successful response with filters
    return {
      success: true,
      result: availableFilters,
    };
  } catch (err) {
    // Log unexpected errors with error stack for debugging
    logger.error("getFilters: Unexpected error", err!);
    logger.endTimer(timerLabel);
    return { success: false, error: "getFilters: unknown error" };
  }
}

/**
 * Retrieves menu items for a menu identified by a handle.
 * @param handle - Menu handle string
 * @returns ApiResult wrapping an array of Menu items
 */
export async function getMenu(handle: string): Promise<ApiResult<Menu[]>> {
  const timerLabel = `getMenu-${handle}`;
  logger.info(`Starting getMenu for handle: ${handle}`);
  try {
    const variables = { handle };

    logger.startTimer(timerLabel);

    // Request menu data by handle
    const res = await client.request(getMenuQuery, { variables });

    // Check for response data existence
    if (!res.data) {
      logger.error("getMenu: No data in response", res.errors);
      logger.endTimer(timerLabel);
      return {
        success: false,
        error: "getMenu: Server error, please try again later.",
      };
    }

    // Verify menu and items exist in the response
    if (!res.data.menu || !res.data.menu.items) {
      logger.warn("getMenu: Menu or items missing in response", res.errors);
      logger.endTimer(timerLabel);
      return {
        success: false,
        error: "getMenu: Menu items not found.",
      };
    }

    // Extract menu items
    const menuItems: Menu[] = res.data.menu.items;

    logger.info(`getMenu: Successfully fetched menu for handle ${handle}`);
    logger.endTimer(timerLabel);
    // Return success with menu items
    return { success: true, result: menuItems };
  } catch (err) {
    logger.error("getMenu: Failed to fetch menu", err!);
    logger.endTimer(timerLabel);
    return { success: false, error: "getMenu: unknown error" };
  }
}

/**
 * Fetches a single page by its handle.
 * @param handle - Page handle string
 * @returns ApiResult wrapping a Page object
 */
export async function getPage(handle: string): Promise<ApiResult<Page>> {
  const timerLabel = `getPage-${handle}`;
  logger.info(`Starting getPage for handle: ${handle}`);
  try {
    const variables = { handle };

    logger.startTimer(timerLabel);

    // Request page data by handle
    const res = await client.request(getPageQuery, { variables });

    if (!res.data) {
      logger.error("getPage: No data in response", res.errors);
      logger.endTimer(timerLabel);
      return {
        success: false,
        error: "getPage: Server error please try again later.",
      };
    }

    logger.info(`getPage: Successfully fetched page for handle ${handle}`);
    logger.endTimer(timerLabel);
    // Return page data from the response
    return { success: true, result: res.data.pageByHandle };
  } catch (err) {
    logger.error("getPage: Failed to get page", err!);
    logger.endTimer(timerLabel);
    return { success: false, error: "getPage: Unknown error" };
  }
}

/**
 * Fetches all available pages.
 * @returns ApiResult wrapping an array of Page objects
 */
export async function getPages(): Promise<ApiResult<Page[]>> {
  const timerLabel = "getPages";
  logger.info("Starting getPages");
  try {
    logger.startTimer(timerLabel);

    // Request all pages
    const res = await client.request(getPagesQuery, {});

    if (!res.data) {
      logger.error("getPages: No data in response", res.errors);
      logger.endTimer(timerLabel);
      return {
        success: false,
        error: "getPages: Server error please try again later.",
      };
    }

    logger.info("getPages: Successfully fetched all pages");
    logger.endTimer(timerLabel);
    // Use utility to extract nodes from Shopify edges
    return { success: true, result: removeEdgesAndNodes(res.data.pages) };
  } catch (err) {
    logger.error("getPages: Failed to get pages", err!);
    logger.endTimer(timerLabel);
    return { success: false, error: "getPages: Unknown error" };
  }
}

/**
 * Retrieves general shop information such as name, domain, and description.
 * @returns ApiResult wrapping ShopInfo object
 */
export async function getShopInfo(): Promise<ApiResult<ShopInfo>> {
  const timerLabel = "getShopInfo";
  logger.info("Starting getShopInfo");
  try {
    logger.startTimer(timerLabel);

    // Request shop info
    const response: ClientResponse<{ shop: ShopInfo }> = await client.request(
      getShopQuery
    );

    if (!response.data) {
      logger.error("getShopInfo: No data in response", response.errors);
      logger.endTimer(timerLabel);
      return { success: false, error: "getShopInfo: Server error" };
    }

    logger.info("getShopInfo: Successfully fetched shop info");
    logger.endTimer(timerLabel);
    // Return shop information
    return { success: true, result: response.data.shop };
  } catch (err) {
    logger.error("getShopInfo: Unexpected error", err!);
    logger.endTimer(timerLabel);
    return { success: false, error: "getShopInfo: Unknown Error" };
  }
}

/**
 * Fetches all product types available in the store.
 * @returns ApiResult wrapping an array of product type strings
 */
export async function getTypes(): Promise<ApiResult<string[]>> {
  const timerLabel = "getTypes";
  logger.info("Starting getTypes");
  try {
    logger.startTimer(timerLabel);

    // Request product types
    const response: ClientResponse = await client.request(getTypesQuery);

    if (!response.data) {
      logger.error("getTypes: No data in response", response.errors);
      logger.endTimer(timerLabel);
      return { success: false, error: "getTypes: Server error" };
    }

    logger.info("getTypes: Successfully fetched product types");
    logger.endTimer(timerLabel);
    // Extract product types from edges
    return {
      success: true,
      result: removeEdgesAndNodes(response.data.productTypes),
    };
  } catch (err) {
    logger.error("getTypes: Unexpected error", err!);
    logger.endTimer(timerLabel);
    return { success: false, error: "getTypes: Unknown Error" };
  }
}

export async function getMetaobjects(
  type: string
): Promise<ApiResult<Metaobject[]>> {
  const timerLabel = `getMetaobjects-${type}`;
  logger.info(`Starting getMetaobjects for type: ${type}`);
  try {
    const variables = { type };

    logger.startTimer(timerLabel);

    // Request page data by handle
    const res = await client.request(getMetaObjectsQuery, { variables });

    if (!res.data) {
      logger.error("getMetaobjects: No data in response", res.errors);
      logger.endTimer(timerLabel);
      return {
        success: false,
        error: "getMetaobjects: Server error please try again later.",
      };
    }

    logger.info(`getMetaobjects: Successfully fetched page for handle ${type}`);
    logger.endTimer(timerLabel);
    // Return page data from the response
    return { success: true, result: removeEdgesAndNodes(res.data.metaobjects) };
  } catch (err) {
    logger.error(
      "getMetaobjects: Failed to get metaobjects for type: ${type}",
      { error: err }
    );
    logger.endTimer(timerLabel);
    return { success: false, error: "getMetaobjects: Unknown error" };
  }
}
