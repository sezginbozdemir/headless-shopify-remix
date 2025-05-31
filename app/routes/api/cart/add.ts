import { addToCart } from "@/lib/shopify";
import { ActionFunction, data } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const merchandiseId = formData.get("variantId");
  const quantity = Number(formData.get("quantity"));

  if (typeof merchandiseId !== "string" || isNaN(quantity)) {
    throw data({ success: false, error: "Invalid input" }, { status: 400 });
  }

  const res = await addToCart(request, [{ merchandiseId, quantity: quantity }]);

  if (!res.success) {
    throw new Response(res.error, {
      status: 500,
      statusText: "Error adding to cart",
    });
  }

  return data(
    { success: true, result: res.result.cart },
    { headers: res.result.headers }
  );
};
