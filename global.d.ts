declare global {
  interface Window {
    ENV: {
      STORE_PRODUCTION_URL: string;
      SHOPIFY_ACCESS_TOKEN: string;
      SHOPIFY_STORE_DOMAIN: string;
      API_VERSION: string;
    };
  }
}

export {};
