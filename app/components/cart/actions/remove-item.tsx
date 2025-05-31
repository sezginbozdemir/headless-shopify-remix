import { Trash2 } from "lucide-react";
import type { CartItem } from "@/lib/shopify/types";
import { useFetcher } from "@remix-run/react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";

export function RemoveItemButton({ item }: { item: CartItem }) {
  const fetcher = useFetcher();
  const merchandiseId = item.merchandise.id;
  const lineId = item.id;
  const { removeLine } = useCartStore();
  const handleSubmit = () => {
    removeLine(lineId!); // optimistic local update
  };

  return (
    <fetcher.Form onSubmit={handleSubmit} method="post" action="/api/cart/edit">
      <input type="hidden" name="merchandiseId" value={merchandiseId} />
      <input type="hidden" name="quantity" value={0} />
      <Button
        type="submit"
        variant="ghost"
        className="w-[60px] h-[60px] flex items-center justify-center rounded-xl border"
      >
        <Trash2 />
      </Button>
    </fetcher.Form>
  );
}
