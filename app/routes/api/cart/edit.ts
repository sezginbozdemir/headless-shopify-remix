import { getCart, removeFromCart, updateCart } from "@/lib/shopify";
import { ActionFunction, data } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const merchandiseId = formData.get("merchandiseId");
  const quantity = Number(formData.get("quantity"));

  if (typeof merchandiseId !== "string" || isNaN(quantity)) {
    throw new Response("Invalid Input", {
      status: 400,
      statusText: "Invalid Input at editCart",
    });
  }

  try {
    const cartReq = await getCart(request);

    if (!cartReq.success) {
      throw new Response(cartReq.error, {
        status: 400,
        statusText: "editCartItem: error fetching cart ",
      });
    }
    const cart = cartReq.result;

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId
    );

    if (lineItem && lineItem.id) {
      if (quantity === 0) {
        const req = await removeFromCart(request, [lineItem.id]);

        if (req.success) {
          return { success: true, result: req.result };
        } else {
          throw new Response(req.error, {
            status: 400,
            statusText: "editCartItem: error removing item",
          });
        }
      } else {
        const req = await updateCart(request, [
          {
            id: lineItem.id,
            merchandiseId,
            quantity,
          },
        ]);
        if (req.success) {
          return { success: true, result: req.result };
        } else {
          throw new Response(req.error, {
            status: 400,
            statusText: "editCartItem: error updating item",
          });
        }
      }
    }
  } catch (error) {
    console.error(error);
    throw new Response("Unknown error, check console", {
      status: 400,
      statusText: "Unexpected error",
    });
  }
};
