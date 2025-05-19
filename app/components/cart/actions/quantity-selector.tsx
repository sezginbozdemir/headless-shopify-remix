import { CartItem } from "@/lib/shopify/types";
import { EditQuantityButton } from "./edit-quantity";

interface QuantitySelectorProps {
  item: CartItem;
}

export function QuantitySelector({ item }: QuantitySelectorProps) {
  return (
    <div className="flex items-center border rounded-full overflow-hidden justify-between w-[180px] h-[70px]">
      <EditQuantityButton type="minus" item={item} />
      <div className="px-4 py-2 text-lg font-medium min-w-[40px] text-center">
        {item.quantity}
      </div>
      <EditQuantityButton type="plus" item={item} />
    </div>
  );
}
