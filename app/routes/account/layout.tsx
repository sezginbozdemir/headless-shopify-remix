import { Button } from "@/components/ui/button";
import { commitSession, getSession } from "@/lib/session.server";
import { getCustomerInfo } from "@/lib/shopify";
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { Form, Link, Outlet } from "@remix-run/react";
export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  session.unset("customerToken");
  return redirect("/account/auth?mode=login", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const isAuthPage = url.pathname.includes("/account/auth");
  const res = await getCustomerInfo(request);

  if (!res.success && !isAuthPage) {
    return redirect("/account/auth?mode=login");
  }
  if (res.success && isAuthPage) {
    return redirect("/account");
  }
  return null;
};

export default function AccountLayout() {
  return (
    <div className="flex flex-col md:flex-row gap-6 p-4">
      {/* Sidebar */}
      <div className="flex flex-col gap-4 w-full md:w-[250px] shrink-0">
        <Link to="/account">
          <Button className="w-full h-16">Account</Button>
        </Link>
        <Link to="/account/orders">
          <Button className="w-full h-16">Order History</Button>
        </Link>
        <Link to="/account/addresses">
          <Button className="w-full h-16">Addresses</Button>
        </Link>
        <Form method="post">
          <Button type="submit" variant="link" className="pl-0">
            Logout
          </Button>
        </Form>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
