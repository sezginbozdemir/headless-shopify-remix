import type { Cart } from "@/lib/shopify/types";
import { CartLine } from "./cart-line";
import { Spacing } from "../spacing";
import { Separator } from "../ui/separator";
import { CartLineSheet } from "./cart-line-sheet";

interface Props {
  cart: Cart | null;
  sheet?: boolean;
}

export function CartList({ cart, sheet }: Props) {
  const emptyCart = !cart || cart.lines.length === 0;

  if (emptyCart) {
    return (
      <p className="text-center text-gray-600 text-lg py-12">
        Your cart is empty.
      </p>
    );
  }

  return (
    <>
      {cart.lines.map((line) => (
        <div key={line.id}>
          {sheet ? <CartLineSheet line={line} /> : <CartLine line={line} />}
          <Spacing size={2} />
          <Separator />
          <Spacing size={2} />
        </div>
      ))}
    </>
  );
}
