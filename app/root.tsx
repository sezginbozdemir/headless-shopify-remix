import {
  data,
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";

import "./tailwind.css";
import { Container } from "./components/ui/container";
import RootLayout from "./components/layout";
import { getCart, getCollections, getMenu, getShopInfo } from "./lib/shopify";
import { commitSession, getSession } from "./lib/session.server";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&display=swap",
  },
];
export const loader: LoaderFunction = async ({ request }) => {
  const ENV = {
    STORE_PRODUCTION_URL: process.env.STORE_PRODUCTION_URL ?? "",
    SHOPIFY_ACCESS_TOKEN: process.env.SHOPIFY_ACCESS_TOKEN ?? "",
    SHOPIFY_STORE_DOMAIN: process.env.SHOPIFY_STORE_DOMAIN ?? "",
    API_VERSION: process.env.API_VERSION ?? "",
  };

  const req = await getMenu("main-menu");
  const menu = req.success ? req.result : null;
  const shopReq = await getShopInfo();
  if (!shopReq.success) {
    throw data({ error: shopReq.error }, { status: 500 });
  }
  const shop = shopReq.result;
  const collectionsReq = await getCollections();
  if (!collectionsReq.success) {
    return data({ error: collectionsReq.error }, { status: 500 });
  }

  const collections = collectionsReq.result;
  const cartReq = await getCart(request);
  const session = await getSession(request.headers.get("Cookie"));
  if (!cartReq.success) {
    if (cartReq.error === "ORDERED_CART") {
      session.unset("cartId");
      return redirect("/products", {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }
    if (cartReq.error !== "NO_CART") {
      return data({ error: cartReq.error }, { status: 500 });
    }
  }
  const cart = cartReq.success ? cartReq.result : cartReq.error;

  return { ENV, shop, menu, collections, cart };
};

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>();
  const ENV = data?.ENV ?? {};
  const collections = data?.collections;
  const cart = data?.cart;
  const shop = data?.shop;
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <RootLayout cart={cart} shop={shop} collections={collections}>
          <Container>{children} </Container>
        </RootLayout>
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <html lang="en">
      <head>
        <title>Error!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <ScrollRestoration />

        <h1>Something went wrong</h1>

        {isRouteErrorResponse(error) ? (
          <p>
            {error.status} {error.statusText}
          </p>
        ) : error instanceof Error ? (
          <pre>{error.message}</pre>
        ) : (
          <p>Unknown error occurred.</p>
        )}

        <Scripts />
      </body>
    </html>
  );
}
export default function App() {
  return <Outlet />;
}
