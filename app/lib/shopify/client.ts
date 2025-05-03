import {
  createStorefrontApiClient,
  StorefrontApiClient,
} from "@shopify/storefront-api-client";
import { getEnv } from "../utils";

const env = getEnv();
let client: StorefrontApiClient | undefined = undefined;

export const getClient = (): StorefrontApiClient => {
  if (client === undefined) {
    client = createStorefrontApiClient({
      storeDomain: env.SHOPIFY_STORE_DOMAIN!,
      apiVersion: env.API_VERSION!,
      publicAccessToken: env.SHOPIFY_ACCESS_TOKEN!,
    });
  }

  return client;
};
