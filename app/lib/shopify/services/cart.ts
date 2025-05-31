import { getClient } from "../client";
import { ApiResult, Cart } from "../types";
import {
  addToCartMutation,
  createCartMutation,
  editCartItemsMutation,
  removeFromCartMutation,
} from "../mutations/cart";
import { getCartQuery } from "../queries/cart";
import { commitSession, getSession } from "../../session.server";
import { reshapeCart } from "../utils";
import { createLogger } from "@/lib/logger";

// Initiate shopify client

const client = getClient();

// Initiate logger instance

const logger = createLogger("SHOPIFY CART MODULE");

/**
 * Creates a new cart, optionally associating it with a customer via buyerIdentity.
 * If a guest user creates a cart and later signs in, another function should associate the cart to the customer.
 */
export async function createCart(
  request: Request,
  lines: { merchandiseId: string; quantity: number }[],
  buyerIdentity?: { customerAccessToken: string }
): Promise<ApiResult<{ headers: Headers; cart: Cart }>> {
  // Retrieve session to store the cart ID for future requests (via cookie).

  const session = await getSession(request.headers.get("Cookie"));

  try {
    const variables = {
      lines,
      buyerIdentity,
    };

    logger.info("Creating cart with lines:", lines);
    logger.debug("Buyer identity (if any):", buyerIdentity);
    logger.startTimer("createCart");
    const res = await client.request(createCartMutation, { variables });
    logger.endTimer("createCart");
    if (!res.data) {
      logger.error("No data recieved from createCart function", res.errors);
      return {
        success: false,
        error: "createCart:Server error please try again later.",
      };
    }
    if (!res.data.cartCreate.cart) {
      const errors = res.data.cartCreate.userErrors;
      logger.error("createCart function resulted in userErrors", errors);
      return {
        success: false,
        error: errors[0]?.message || "createCart:An unknown error occurred",
      };
    }

    const cartId = res.data.cartCreate.cart.id;
    logger.debug("Cart id:", cartId);

    const cart = reshapeCart(res.data.cartCreate.cart);

    session.set("cartId", cartId);
    const headers = new Headers();

    headers.append("Set-Cookie", await commitSession(session));

    return { success: true, result: { headers, cart } };
  } catch (err) {
    logger.error("Error creating cart:", err!);
    return { success: false, error: "createcart: Unknown error" };
  }
}

/**
 * Adds one or more items to an existing cart.
 * If no cart exists (guest user or expired session), creates a new one.
 */
export async function addToCart(
  request: Request,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<ApiResult<{ headers: Headers; cart: Cart }>> {
  // Retrieve session to access or set cart-related information.
  const session = await getSession(request.headers.get("Cookie"));

  const cartId = session.get("cartId");
  const customerToken = session.get("customerToken");
  const buyerIdentity = { customerAccessToken: customerToken };

  try {
    // If no cart exists in the session, create a new one with these lines.
    if (!cartId) {
      logger.info("No cartId found in session. Creating new cart.");
      const createResult = await createCart(request, lines, buyerIdentity);

      if (!createResult.success) {
        logger.error("Failed to create cart during addToCart", createResult);
        return { success: false, error: createResult.error };
      }

      const headers = createResult.result.headers;
      const cart = createResult.result.cart;

      logger.info("New cart created and items added successfully.");
      return { success: true, result: { headers, cart } };
    }

    const variables = { cartId, lines };

    logger.info(`Adding items to existing cart: ${cartId}`);
    logger.debug("Cart lines to add:", lines);
    logger.startTimer("add to cart");

    const res = await client.request(addToCartMutation, { variables });

    logger.endTimer("add to cart");

    if (!res.data) {
      logger.error("No data returned from addToCartMutation", res.errors);
      return {
        success: false,
        error: "addtoCart:Server error please try again later.",
      };
    }

    if (!res.data.cartLinesAdd.cart) {
      const errors = res.data.cartLinesAdd.userErrors;
      logger.error("UserErrors in cartLinesAdd response", errors);
      return {
        success: false,
        error: errors[0]?.message || "addtoCart:An unknown error occurred",
      };
    }

    const cart = reshapeCart(res.data.cartLinesAdd.cart);
    const headers = new Headers();

    logger.info("Items added to cart successfully.");
    logger.debug("Updated cart ID:", { cartId: cart.id });

    return { success: true, result: { headers, cart } };
  } catch (err) {
    logger.error("Error occurred while adding to cart", err!);
    return { success: false, error: "addtoCart:Unknown error" };
  }
}

/**
 * Removes one or more line items from the cart.
 */
export async function removeFromCart(
  request: Request,
  lineIds: string[]
): Promise<ApiResult<Cart>> {
  // Retrieve the session to get the cart ID from cookies.
  const session = await getSession(request.headers.get("Cookie"));

  try {
    const cartId = session.get("cartId");

    const variables = {
      cartId,
      lineIds,
    };

    logger.info(`Removing items from cart: ${cartId}`);
    logger.debug("Line item IDs to remove:", lineIds);
    logger.startTimer("remove from cart");

    const res = await client.request(removeFromCartMutation, { variables });

    logger.endTimer("remove from cart");

    if (!res.data) {
      logger.error("No data returned from removeFromCartMutation", res.errors);
      return {
        success: false,
        error: "removeFromCart:Server error please try again later.",
      };
    }

    if (!res.data.cartLinesRemove.cart) {
      const errors = res.data.cartLinesRemove.userErrors;
      logger.error("UserErrors in cartLinesRemove response", errors);
      return {
        success: false,
        error: errors[0]?.message || "removeFromCart:An unknown error occurred",
      };
    }

    const cart = reshapeCart(res.data.cartLinesRemove.cart);

    logger.info("Items removed from cart successfully.");
    logger.debug("Updated cart ID:", { cartId: cart.id });

    return { success: true, result: cart };
  } catch (err) {
    logger.error("Error occurred while removing items from cart", err!);
    return { success: false, error: "removeFromCart:Unknown error" };
  }
}

/**
 * Updates line items in the cart (e.g. changing quantity or merchandise).
 */
export async function updateCart(
  request: Request,
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<ApiResult<Cart>> {
  // Retrieve session and cart ID
  const session = await getSession(request.headers.get("Cookie"));

  try {
    const cartId = session.get("cartId");
    const variables = { cartId, lines };

    logger.info(`Updating cart items for cart: ${cartId}`);
    logger.debug("Line updates:", lines);
    logger.startTimer("update cart");

    const res = await client.request(editCartItemsMutation, { variables });

    logger.endTimer("update cart");

    if (!res.data) {
      logger.error("No data returned from editCartItemsMutation", res.errors);
      return {
        success: false,
        error: "updateCart:Server error please try again later.",
      };
    }

    if (!res.data.cartLinesUpdate.cart) {
      const errors = res.data.cartLinesUpdate.userErrors;
      logger.error("UserErrors in cartLinesUpdate response", errors);
      return {
        success: false,
        error: errors[0]?.message || "updateCart:An unknown error occurred",
      };
    }

    const cart = reshapeCart(res.data.cartLinesUpdate.cart);

    logger.info("Cart items updated successfully.");
    logger.debug("Updated cart ID:", { cartId: cart.id });

    return { success: true, result: cart };
  } catch (err) {
    logger.error("Error updating cart", err!);
    return { success: false, error: "updateCart:Unknown error" };
  }
}
/**
 * Retrieves the current cart associated with the session.
 */
export async function getCart(request: Request): Promise<ApiResult<Cart>> {
  try {
    const session = await getSession(request.headers.get("Cookie"));
    const cartId = session.get("cartId");

    if (!cartId) {
      logger.info("No cart found in session.");
      return { success: false, error: "NO_CART" };
    }

    const variables = { cartId };

    logger.info("Fetching cart:", cartId);
    logger.startTimer("get cart");

    const res = await client.request(getCartQuery, { variables });

    logger.endTimer("get cart");

    if (!res.data) {
      logger.error("No data returned from getCartQuery", res.errors);
      return {
        success: false,
        error: "getCart:Server error please try again later.",
      };
    }

    if (res.data.cart === null) {
      logger.warn(
        "Cart has already been ordered or is no longer valid",
        res.errors
      );
      return { success: false, error: "ORDERED_CART" };
    }

    const cart = reshapeCart(res.data.cart);
    logger.info("Cart fetched successfully.");
    logger.debug("Cart ID:", { cartId: cart.id });

    return { success: true, result: cart };
  } catch (err) {
    logger.error("Error fetching cart", err!);
    return { success: false, error: "getCart:Unknown error" };
  }
}
