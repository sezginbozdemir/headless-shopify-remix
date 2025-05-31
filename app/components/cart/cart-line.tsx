import type { CartItem, CartProduct } from "@/lib/shopify/types";
import { RemoveItemButton } from "./actions/remove-item";
import { Separator } from "../ui/separator";
import { Spacing } from "../spacing";
import { QuantitySelector } from "./actions/quantity-selector";
import { Link } from "@remix-run/react";

interface Props {
  line: CartItem;
}

export function CartLine({ line }: Props) {
  const product: CartProduct = line.merchandise.product;

  return (
    <div className="flex items-start gap-4">
      <Link
        to={`/products/${product.handle}`}
        className="w-[400px] h-[300px] border rounded-xl overflow-hidden"
      >
        <img
          src={product.featuredImage.url}
          alt={product.title}
          className="w-full h-full object-contain"
        />
      </Link>

      <div className="flex justify-between flex-1">
        <div>
          <h2 className="text-3xl font-medium">{product.title}</h2>
          <Spacing size={1} />
          <h3 className="text-2xl font-[450] ">
            {line.cost.amountPerQuantity.amount}
            {line.cost.amountPerQuantity.currencyCode}
          </h3>
          <Spacing size={1} />
          <Separator />
          <Spacing size={1} />

          <div className="text-lg font-[450]">
            {line.merchandise.selectedOptions.map((option) => (
              <h3 key={option.name}>
                {option.name}: {option.value}
              </h3>
            ))}
          </div>
        </div>
        <QuantitySelector item={line} />
        <h2 className="text-gray-500 font-medium text-2xl">
          {line.cost.totalAmount.amount}
          {line.cost.totalAmount.currencyCode}
        </h2>
        <RemoveItemButton item={line} />
      </div>
    </div>
  );
}
