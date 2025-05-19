import { MinusIcon, PlusIcon } from "lucide-react";
import clsx from "clsx";
import type { CartItem } from "@/lib/shopify/types";
import { useFetcher } from "@remix-run/react";
import { Button } from "@/components/ui/button";

function SubmitButton({ type }: { type: "plus" | "minus" }) {
  return (
    <Button
      type="submit"
      variant="ghost"
      className={clsx(
        "ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full p-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80",
        {
          "ml-auto": type === "minus",
        }
      )}
    >
      {type === "plus" ? (
        <PlusIcon className="h-4 w-4 dark:text-neutral-500" />
      ) : (
        <MinusIcon className="h-4 w-4 dark:text-neutral-500" />
      )}
    </Button>
  );
}

export function EditQuantityButton({
  item,
  type,
}: {
  item: CartItem;
  type: "plus" | "minus";
}) {
  const fetcher = useFetcher();
  const payload = {
    merchandiseId: item.merchandise.id,
    quantity: type === "plus" ? item.quantity + 1 : item.quantity - 1,
  };

  return (
    <fetcher.Form method="post" action="/api/cart/edit">
      <input type="hidden" name="merchandiseId" value={payload.merchandiseId} />
      <input type="hidden" name="quantity" value={payload.quantity} />
      <SubmitButton type={type} />
    </fetcher.Form>
  );
}
