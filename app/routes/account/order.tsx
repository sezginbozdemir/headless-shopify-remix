import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { getCustomerInfo } from "@/lib/shopify";
import { Order } from "@/lib/shopify/types";
import { ArrowLeft } from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const orderNumber = params.order;

  if (!orderNumber) {
    throw new Response("No order for this number", {
      status: 400,
      statusText: "No order for this number",
    });
  }

  const req = await getCustomerInfo(request);

  if (!req.success) {
    throw new Response(req.error, {
      status: 500,
      statusText: "failed to fetch customer info, please try again later",
    });
  }

  const order = req.result.orders.find(
    (o: Order) => String(o.orderNumber) === orderNumber,
  );

  if (!order) {
    throw new Response("Order not found", {
      status: 404,
      statusText: "Order not found",
    });
  }

  return { order };
};

export default function OrderDetailPage() {
  const { order } = useLoaderData<{ order: Order }>();
  const navigate = useNavigate();
  return (
    <div className="px-8">
      <button
        type="button"
        onClick={() => navigate("/account/orders")}
        className="flex items-center gap-2 text-black hover:text-gray-700 mb-6"
      >
        <ArrowLeft size={20} />
        Back to Orders
      </button>
      <h1 className="text-3xl font-bold mb-6">Order #{order.orderNumber}</h1>

      <h2 className="text-2xl font-semibold mb-4">Items</h2>
      <ul className="space-y-4">
        {order.lineItems.map((item) => (
          <li
            key={item.variant.id}
            className="flex gap-4 p-4 border rounded-lg shadow-sm"
          >
            {item.variant.image?.url && (
              <img
                src={item.variant.image.url}
                alt={item.variant.image.altText || item.title}
                className="w-24 h-24 object-cover rounded"
              />
            )}
            <div>
              <h3 className="font-semibold">{item.title}</h3>
              <p>
                {item.discountedTotalPrice.amount}{" "}
                {item.discountedTotalPrice.currencyCode}
              </p>
              {item.variant.compareAtPrice && (
                <p className="line-through text-sm text-gray-500">
                  {item.variant.compareAtPrice.amount}{" "}
                  {item.variant.compareAtPrice.currencyCode}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {item.variant.selectedOptions.map((option) => (
                  <span
                    key={option.name}
                    className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs"
                  >
                    {option.name}: {option.value}
                  </span>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Order Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-600">Status</h4>
            <p className="text-base text-gray-900 capitalize">
              {order.financialStatus}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-600">Placed on</h4>
            <p className="text-base text-gray-900">
              {new Date(order.processedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-600">Subtotal</h4>
            <p className="text-base text-gray-900">
              {order.currentSubtotalPrice.amount}{" "}
              {order.currentSubtotalPrice.currencyCode}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-600">Shipping</h4>
            <p className="text-base text-gray-900">
              {order.currentTotalShippingPrice.amount}{" "}
              {order.currentTotalShippingPrice.currencyCode}
            </p>
          </div>

          <div className="sm:col-span-2">
            <h4 className="text-sm font-medium text-gray-600">Total</h4>
            <p className="text-base font-semibold text-gray-900">
              {order.currentTotalPrice.amount}{" "}
              {order.currentTotalPrice.currencyCode}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 text-xs text-gray-400">
        Shopify Customer URL:{" "}
        <a
          href={order.customerUrl}
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-blue-500"
        >
          View in Shopify
        </a>
      </div>
    </div>
  );
}
