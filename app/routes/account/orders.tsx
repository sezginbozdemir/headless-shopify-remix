import {
  PackageSearch,
  Receipt,
  Calendar,
  CreditCard,
  Truck,
  DollarSign,
} from "lucide-react";
import { getCustomerInfo } from "@/lib/shopify";
import { data, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Order } from "@/lib/shopify/types";

export const loader: LoaderFunction = async ({ request }) => {
  const req = await getCustomerInfo(request);

  if (!req.success) {
    return data({ error: req.error }, { status: 500 });
  }

  const orders = req.result.orders || [];
  return { orders };
};

export default function OrdersPage() {
  const { orders } = useLoaderData<typeof loader>();

  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center text-gray-600 mt-10 gap-4">
        <PackageSearch className="w-16 h-16 text-gray-400" />
        <p className="text-lg font-medium">You don’t have any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="px-8">
      <h2 className="text-2xl font-semibold mb-6">Your Orders</h2>

      <div className="space-y-6 flex flex-col">
        {orders.map((order: Order) => (
          <Link
            key={order.orderNumber}
            to={`/account/orders/${order.orderNumber}`}
          >
            <div className="border rounded-xl p-6 shadow-sm bg-white space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-lg font-medium">
                  <Receipt className="w-5 h-5 text-gray-500" />
                  <span>Order #{order.orderNumber}</span>
                </div>
                <span className="text-sm text-gray-500 capitalize">
                  {order.financialStatus}
                </span>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>
                    Placed on{" "}
                    {new Date(order.processedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span>
                    Subtotal: {order.currentSubtotalPrice.amount}{" "}
                    {order.currentSubtotalPrice.currencyCode}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gray-400" />
                  <span>
                    Shipping: {order.currentTotalShippingPrice.amount}{" "}
                    {order.currentTotalShippingPrice.currencyCode}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  <span>
                    Total: {order.currentTotalPrice.amount}{" "}
                    {order.currentTotalPrice.currencyCode}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
