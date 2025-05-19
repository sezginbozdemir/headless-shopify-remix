import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
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
          route("account", "routes/account/layout.tsx", () => {
            route("", "routes/account/route.tsx", { index: true });
            route("orders", "routes/account/orders.tsx");
            route("addresses", "routes/account/addresses.tsx");
            route("orders/:order", "routes/account/order.tsx");
          });
          route("account/auth", "routes/account/auth.tsx");
          route("api/cart/add", "routes/api/cart/add.ts");
          route("api/cart/edit", "routes/api/cart/edit.ts");
        });
      },
    }),
    tsconfigPaths(),
  ],
});
