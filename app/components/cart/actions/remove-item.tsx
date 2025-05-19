import { Trash2 } from "lucide-react";
import type { CartItem } from "@/lib/shopify/types";
import { useFetcher } from "@remix-run/react";
import { Button } from "@/components/ui/button";

export function RemoveItemButton({ item }: { item: CartItem }) {
  const fetcher = useFetcher();
  const merchandiseId = item.merchandise.id;

  return (
    <fetcher.Form method="post" action="/api/cart/edit">
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
