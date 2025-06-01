import type { CartItem, CartProduct } from "@/lib/shopify/types";
import { RemoveItemButton } from "./actions/remove-item";
import { QuantitySelector } from "./actions/quantity-selector";
import { Link } from "@remix-run/react";

interface Props {
  line: CartItem;
}

export function CartLineSheet({ line }: Props) {
  const product: CartProduct = line.merchandise.product;

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
      <Link
        to={`/products/${product.handle}`}
        className="w-[100px] h-[100px] mt-4 border rounded-xl overflow-hidden"
      >
        <img
          src={product.featuredImage.url}
          alt={product.title}
          className="w-full h-full object-contain"
        />
      </Link>
      <div className="flex justify-between flex-1 flex-wrap">
        <div className="flex flex-col gap-12 justify-between">
          <div className="flex flex-col justify-between gap-4">
            <h2 className="text-2xl font-medium">{product.title}</h2>
            <h3 className="text-md text-gray-600 font-[450] ">
              {line.cost.amountPerQuantity.amount}
              {line.cost.amountPerQuantity.currencyCode}
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
