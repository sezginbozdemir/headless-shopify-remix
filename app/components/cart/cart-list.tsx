import type { Cart } from "@/lib/shopify/types";
import { CartLine } from "./cart-line";
import { Spacing } from "../spacing";
import { Separator } from "../ui/separator";
import { CartLineSheet } from "./cart-line-sheet";

interface Props {
  cart: Cart | "NO_CART";
  sheet?: boolean;
}

export function CartList({ cart, sheet }: Props) {
  const emptyCart = cart === "NO_CART" || cart.lines.length === 0;

  return (
    <>
      {emptyCart ? (
        <p className="text-center text-gray-600 text-lg py-12">
          Your cart is empty.
        </p>
      ) : (
        <>
          {cart.lines.map((line) => (
            <>
              {sheet ? (
                <CartLineSheet key={line.id} line={line} />
              ) : (
                <CartLine key={line.id} line={line} />
              )}
              <Spacing size={2} />
              <Separator />
              <Spacing size={2} />
            </>
          ))}
        </>
      )}
    </>
  );
}
