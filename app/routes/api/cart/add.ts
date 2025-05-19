import { addToCart } from "@/lib/shopify";
import { ActionFunction, data } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const merchandiseId = formData.get("variantId");
  const quantity = Number(formData.get("quantity"));

  if (typeof merchandiseId !== "string" || isNaN(quantity)) {
    return data({ success: false, error: "Invalid input" }, { status: 400 });
  }

  const res = await addToCart(request, [{ merchandiseId, quantity: quantity }]);

  if (!res.success) {
    return data({ success: false, error: res.error }, { status: 500 });
  }

  return data(
    { success: true, result: res.result.cart },
    { headers: res.result.headers }
  );
};
