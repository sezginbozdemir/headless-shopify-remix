import { AuthForm } from "@/components/auth/auth-form";
import { createAccessToken, createCustomer } from "@/lib/shopify";
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

    if (result) {
      return redirect("/account/auth?mode=login");
    }

    return data(
      { error: "Failed to create customer. Please try again later." },
      { status: 400 }
    );
  }

  const authData: AccessTokenFormData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data: access, headers } = await createAccessToken(authData);

  if (access) {
    return redirect("/account", { headers });
  }

  return data({ error: "an error ocured" }, { status: 400 });
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const mode = url.searchParams.get("mode") ?? "login";

  return { mode };
};

export default function AccountAuthPage() {
  const { mode } = useLoaderData<typeof loader>();

  return <AuthForm mode={mode} />;
}
