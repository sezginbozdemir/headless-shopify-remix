import { getCart, removeFromCart, updateCart } from "@/lib/shopify";
import { ActionFunction, data } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const merchandiseId = formData.get("merchandiseId");
  const quantity = Number(formData.get("quantity"));

  if (typeof merchandiseId !== "string" || isNaN(quantity)) {
    return data({ success: false, error: "Invalid input" }, { status: 400 });
  }

  try {
    const cartReq = await getCart(request);

    if (!cartReq.success) {
      return { success: false, error: "editCartItem: error fetching cart " };
    }
    const cart = cartReq.result;

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId
    );

    if (lineItem && lineItem.id) {
      if (quantity === 0) {
        const req = await removeFromCart(request, [lineItem.id]);

        return req.success
          ? { success: true, result: req.result }
          : { success: false, error: "editCartItem: error removing item" };
      } else {
        const req = await updateCart(request, [
          {
            id: lineItem.id,
            merchandiseId,
            quantity,
          },
        ]);
        return req.success
          ? { success: true, result: req.result }
          : { success: false, error: "editCartItem: error removing item" };
      }
    }
  } catch (e) {
    console.error(e);
    return { success: false, error: e };
  }
};
