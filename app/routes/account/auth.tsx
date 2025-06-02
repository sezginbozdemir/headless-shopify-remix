import { AuthForm } from "@/components/auth/auth-form";
import { Spacing } from "@/components/spacing";
import { Separator } from "@/components/ui/separator";
import {
  createAccessToken,
  createCustomer,
  getShopInfo,
  recoverCustomer,
} from "@/lib/shopify";
import { AccessTokenFormData, CustomerFormData } from "@/lib/shopify/types";
import { ActionFunction, redirect } from "@remix-run/node";
import { LoaderFunction, type MetaFunction } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const action: ActionFunction = async ({ request }) => {
  const url = new URL(request.url);
  const mode = url.searchParams.get("mode") ?? "login";
  const formData = await request.formData();

  if (mode === "recover") {
    const email = formData.get("email") as string;

    const result = await recoverCustomer(email);

    if (result.success) {
      return redirect("/account/auth?mode=login");
    }
    if (result.error.startsWith("userErrors:")) {
      return { userError: result.error.replace("userErrors:", "").trim() };
    }

    throw new Response(result.error, {
      status: 400,
      statusText: "Failed to recover customer, please try again later.",
    });
  }

  if (mode === "signup") {
    const customerData: CustomerFormData = {
      email: formData.get("email") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      password: formData.get("password") as string,
      phone: formData.get("phone") as string,
      acceptsMarketing: formData.get("acceptsMarketing") === "on",
    };

    const result = await createCustomer(customerData);

    if (result.success) {
      return redirect("/account/auth?mode=login");
    }
    if (result.error.startsWith("userErrors:")) {
      return { userError: result.error.replace("userErrors:", "").trim() };
    }

    throw new Response(result.error, {
      status: 400,
      statusText: "Failed to create customer please try again later",
    });
  }

  const authData: AccessTokenFormData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const res = await createAccessToken(authData);

  if (res.success) {
    return redirect("/account", { headers: res.result });
  }
  if (res.error.startsWith("userErrors:")) {
    return { userError: res.error.replace("userErrors:", "").trim() };
  }

  throw new Response(res.error, {
    status: 400,
    statusText: "Failed to log in, please try again later.",
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const mode = url.searchParams.get("mode") ?? "login";
  const shopReq = await getShopInfo();
  if (!shopReq.success) {
    throw new Response(shopReq.error, {
      status: 500,
      statusText: " failed to fetch shop info, please try again later",
    });
  }
  const shop = shopReq.result;

  const img = shop.brand.coverImage.image;

  return { mode, img };
};

export default function AccountAuthPage() {
  const { mode, img } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const title =
    mode === "recover"
      ? "Reset password"
      : mode === "login"
      ? "Login to your account"
      : "Register account";
  return (
    <>
      <h1 className="text-4xl md:text-6xl font-[500]">{title}</h1>
      <Spacing size={2} />
      <Separator />
      <Spacing size={2} />
      <AuthForm userError={actionData?.userError} img={img} mode={mode} />
    </>
  );
}
