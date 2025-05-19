import type { CartItem, CartProduct } from "@/lib/shopify/types";
import { RemoveItemButton } from "./actions/remove-item";
import { Separator } from "../ui/separator";
import { Spacing } from "../spacing";
import { QuantitySelector } from "./actions/quantity-selector";

interface Props {
  line: CartItem;
}

export function CartLineSheet({ line }: Props) {
  const product: CartProduct = line.merchandise.product;
  const unitPrice = Number(line.cost.totalAmount.amount) / line.quantity;

  return (
    <div className="flex items-start gap-4">
      <div className="w-[100px] h-[100px] mt-4 border rounded-xl overflow-hidden">
        <img
          src={product.featuredImage.url}
          alt={product.title}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex justify-between flex-1">
        <div className="flex flex-col gap-12 justify-between">
          <div className="flex flex-col justify-between gap-4">
            <h2 className="text-2xl font-medium">{product.title}</h2>
            <h3 className="text-md text-gray-600 font-[450] ">
              {unitPrice.toFixed(2)} {line.cost.totalAmount.currencyCode}
            </h3>
            <div className="text-md text-gray-600 font-[450]">
              {line.merchandise.selectedOptions.map((option) => (
                <h3 key={option.name}>
                  {option.name}: {option.value}
                </h3>
              ))}
            </div>
          </div>
          <QuantitySelector item={line} />
        </div>
        <div className="flex flex-col items-end justify-between">
          <h2 className="text-gray-500 font-medium text-xl">
            {line.cost.totalAmount.amount}
            {line.cost.totalAmount.currencyCode}
          </h2>
          <RemoveItemButton item={line} />
        </div>
      </div>
    </div>
  );
}
