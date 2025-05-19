import { User, Mail, Key } from "lucide-react"; // lucide icons
import { getCustomerInfo } from "@/lib/shopify";
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {
  const req = await getCustomerInfo(request);

  if (!req.success) {
    throw new Response("Failed to load customer info", { status: 500 });
  }
  const customer = req.result;

  return { customer };
};

export default function AccountPage() {
  const { customer } = useLoaderData<typeof loader>();
  console.log(customer);

  const shortId = customer.id.split("/").pop();

  return (
    <div className="px-8 flex flex-col gap-8">
      <div className="flex items-center space-x-4">
        <User size={70} />
        <h1 className="text-3xl font-semibold">
          Welcome back, {customer.firstName}!
        </h1>
      </div>

      <div className="space-y-3 text-gray-700">
        <div className="flex items-center gap-3">
          <Mail className="w-6 h-6 text-gray-400" />
          <span>{customer.email}</span>
        </div>

        <div className="flex items-center gap-3">
          <Key className="w-6 h-6 text-gray-400" />
          <span>
            Customer ID:{" "}
            <code className="bg-gray-100 px-2 py-0.5 rounded">{shortId}</code>
          </span>
        </div>
      </div>

      <p className="text-gray-600">
        Here you can manage your profile, view your orders, and update your
        settings.
      </p>
    </div>
  );
}
