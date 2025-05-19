import { AuthForm } from "@/components/auth/auth-form";
import { Spacing } from "@/components/spacing";
import { Separator } from "@/components/ui/separator";
import {
  createAccessToken,
  createCustomer,
  recoverCustomer,
} from "@/lib/shopify";
import { AccessTokenFormData, CustomerFormData } from "@/lib/shopify/types";
import { ActionFunction, data, redirect } from "@remix-run/node";
import { LoaderFunction, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

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
    console.log(result);

    if (result.success) {
      return redirect("/account/auth?mode=login");
    }

    return data({ error: result.error }, { status: 400 });
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

    return data({ error: result.error }, { status: 400 });
  }

  const authData: AccessTokenFormData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const res = await createAccessToken(authData);

  if (res.success) {
    return redirect("/account", { headers: res.result });
  }

  return data({ error: res.error }, { status: 400 });
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const mode = url.searchParams.get("mode") ?? "login";

  return { mode };
};

export default function AccountAuthPage() {
  const { mode } = useLoaderData<typeof loader>();
  const title =
    mode === "recover"
      ? "Reset password"
      : mode === "login"
      ? "Login to your account"
      : "Register account";
  return (
    <>
      <h1 className="text-6xl font-[500]">{title}</h1>
      <Spacing size={2} />
      <Separator />
      <Spacing size={2} />
      <AuthForm mode={mode} />
    </>
  );
}
