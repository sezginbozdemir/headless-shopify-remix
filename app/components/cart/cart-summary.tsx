import type { Cart } from "@/lib/shopify/types";
import { Button } from "../ui/button";
import { Link, useNavigate } from "@remix-run/react";
import clsx from "clsx";

interface Props {
  cart: Cart;
  sheet?: boolean;
  closeSheet?: () => void;
}

export function CartSummary({ cart, sheet, closeSheet }: Props) {
  const { subtotalAmount, totalAmount, totalTaxAmount } = cart.cost;
  const navigate = useNavigate();
  const viewCart = () => {
    closeSheet?.();
    navigate("/cart");
  };
  return (
    <div className="flex justify-end space-y-1">
      <div
        className={clsx("flex flex-col gap-6", sheet ? "w-full" : "w-[500px]")}
      >
        {subtotalAmount && (
          <h2 className="text-xl text-gray-500 font-medium flex justify-between">
            <span>Sub-total:</span>
            <span>
              {subtotalAmount.amount}
              {subtotalAmount.currencyCode}
            </span>
          </h2>
        )}

        {totalTaxAmount && (
          <p className="text-sm flex justify-between">
            <span>Taxes:</span>{" "}
            <span>
              {totalTaxAmount.amount} {totalTaxAmount.currencyCode}
            </span>
          </p>
        )}

        {totalAmount && (
          <h1 className="font-medium text-3xl flex justify-between">
            <span> Total:</span>
            <span>
              {totalAmount.amount} {totalAmount.currencyCode}
            </span>
          </h1>
        )}
        <h3 className="text-gray-500 text-xl">
          Shipping calculated at check out.
        </h3>

        {cart.checkoutUrl && (
          <div className={clsx("flex gap-9", sheet && "justify-between")}>
            {sheet ? (
              <Button
                variant="outline"
                className={clsx("h-[50px]", sheet && "w-full")}
                onClick={viewCart}
              >
                View Cart
              </Button>
            ) : (
              <Button variant="link" className="h-[50px]">
                <Link to={"/"}>Continue Shopping</Link>
              </Button>
            )}
            <Link to={cart.checkoutUrl}>
              <Button
                rel="noopener noreferrer"
                className={clsx("h-[50px]", sheet && "w-full")}
              >
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
