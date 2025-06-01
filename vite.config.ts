import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  server: {
    host: "0.0.0.0",
  },
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
      routes(defineRoutes) {
        return defineRoutes((route) => {
          route("", "routes/layout.tsx", () => {
            route("", "routes/_index.tsx", { index: true });
            route("account", "routes/account/layout.tsx", () => {
              route("", "routes/account/route.tsx", { index: true });
              route("orders", "routes/account/orders.tsx");
              route("addresses", "routes/account/addresses.tsx");
              route("orders/:order", "routes/account/order.tsx");
            });
            route("products", "routes/products/route.tsx", { index: true });
            route("products/:product", "routes/products/product.tsx");

            route("account/auth", "routes/account/auth.tsx");
            route("cart", "routes/cart.tsx");
            route("collections", "routes/collections.tsx");
            route(":page", "routes/page.tsx");
            route("search", "routes/search.tsx");
            route("api/cart/add", "routes/api/cart/add.ts");
            route("api/cart/edit", "routes/api/cart/edit.ts");
          });
        });
      },
    }),
    tsconfigPaths(),
  ],
});
