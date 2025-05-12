import { getSession } from "@/lib/session.server";
import { getCustomerInfo } from "@/lib/shopify";
import { LoaderFunction, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const isAuthPage = url.pathname.includes("/account/auth");
  const session = await getSession(request.headers.get("Cookie"));
  const customerToken = session.get("customerToken");
  const customer = await getCustomerInfo(customerToken);

  if (!customerToken && !isAuthPage) {
    return redirect("/account/auth?mode=login");
  }
  if (customerToken && isAuthPage) {
    return redirect("/account");
  }

  return { customer };
};

export default function AccountLayout() {
  const { customer } = useLoaderData<typeof loader>();
  console.log(customer);
  return (
    <div>
      <Outlet />
    </div>
  );
}
