import { Outlet, redirect, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import {
  getCart,
  getCollections,
  getMenu,
  getMetaobjects,
  getPages,
  getShopInfo,
} from "@/lib/shopify";
import { commitSession, getSession } from "@/lib/session.server";
import RootLayout from "@/components/layout";
import { Container } from "@/components/ui/container";

export const loader: LoaderFunction = async ({ request }) => {
  const metaobjectsReq = await getMetaobjects("announcements");
  if (!metaobjectsReq.success) {
    throw new Response(metaobjectsReq.error, {
      status: 500,
      statusText: "Failed to fetch meta objects , please try again later.",
    });
  }

  const metaobjects = metaobjectsReq.result;

  const shopReq = await getShopInfo();
  if (!shopReq.success) {
    throw new Response(shopReq.error, {
      status: 500,
      statusText: " failed to fetch shop info, please try again later",
    });
  }
  const shop = shopReq.result;
  const collectionsReq = await getCollections();
  if (!collectionsReq.success) {
    throw new Response(collectionsReq.error, {
      status: 500,
      statusText: " failed to fetch collections please try again later",
    });
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
      throw new Response(cartReq.error, {
        status: 500,
        statusText: "Failed to fetch cart please try again later.",
      });
    }
  }
  const loaderCart = cartReq.success ? cartReq.result : cartReq.error;

  const token = session.get("customerToken");
  const isCustomer = token ? true : false;
  const menuReq = await getMenu("footer");
  if (!menuReq.success) {
    throw new Response(menuReq.error, {
      status: 500,
      statusText: " failed to fetch footer links please try again later",
    });
  }

  const footer = menuReq.result;

  const pagesReq = await getPages();
  if (!pagesReq.success) {
    throw new Response(pagesReq.error, {
      status: 500,
      statusText: " failed to fetch pages please try again later",
    });
  }
  const pages = pagesReq.result;

  return {
    shop,
    collections,
    loaderCart,
    isCustomer,
    footer,
    pages,
    metaobjects,
  };
};

export default function LayoutRoute() {
  const data = useLoaderData<typeof loader>();
  const collections = data?.collections;
  const loaderCart = data.loaderCart;
  const shop = data.shop;
  return (
    <RootLayout
      announcements={data.metaobjects}
      footer={data.footer}
      loaderCart={loaderCart}
      shop={shop}
      collections={collections}
      isCustomer={data.isCustomer}
      pages={data.pages}
    >
      <Container>
        <Outlet />
      </Container>
    </RootLayout>
  );
}
