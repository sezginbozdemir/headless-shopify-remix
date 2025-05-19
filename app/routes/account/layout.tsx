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
    <div className="flex">
      <div className="flex flex-col gap-5 w-[300px] items-start">
        <Link className="w-full" to="/account">
          <Button className="h-[4rem] w-full">Account</Button>
        </Link>

        <Link className="w-full" to="/account/orders">
          <Button className="h-[4rem] w-full">Order History</Button>
        </Link>
        <Link className="w-full" to="/account/addresses">
          <Button className="h-[4rem] w-full">Addresses</Button>
        </Link>
        <Form method="post">
          <Button type="submit" variant="link">
            Logout
          </Button>
        </Form>
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
