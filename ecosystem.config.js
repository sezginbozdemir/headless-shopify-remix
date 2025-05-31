module.exports = {
  apps: [
    {
      name: "shopify",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "development",
        PORT: 3001,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        SHOPIFY_ACCESS_TOKEN: "98bdcec02c12e490638a4aec8753773c",
        SHOPIFY_STORE_DOMAIN: "http://sezdev.myshopify.com",
        STORE_PRODUCTION_URL: "",
        API_VERSION: "2025-01",
      },
    },
  ],
};
