import { PlusIcon } from "lucide-react";
import clsx from "clsx";
import { ProductVariant } from "@/lib/shopify/types";
import { Button } from "@/components/ui/button";

import { useFetcher } from "@remix-run/react";
import { useCartStore } from "@/store/cart";
import { useEffect } from "react";

function SubmitButton({
  selectedVariant,
}: {
  selectedVariant: ProductVariant | undefined;
}) {
  const buttonClasses =
    "relative flex w-full h-[70px] items-center justify-center p-4 tracking-wide";
  const disabledClasses = "cursor-not-allowed opacity-60 hover:opacity-60";
  const fetcher = useFetcher({ key: "add-to-cart" });
  if (!selectedVariant) {
    return (
      <Button disabled className={clsx(buttonClasses, disabledClasses)}>
        Select Variant
      </Button>
    );
  }

  if (selectedVariant.quantityAvailable <= 0) {
    return (
      <Button disabled className={clsx(buttonClasses, disabledClasses)}>
        Out Of Stock
      </Button>
    );
  }

  return (
    <Button
      disabled={fetcher.state !== "idle"}
      onClick={(e) => e.stopPropagation()}
      className={clsx(buttonClasses, {
        "hover:opacity-90": true,
      })}
    >
      <div className="absolute left-0 ml-4">
        <PlusIcon className="h-5" />
      </div>
      {fetcher.state === "idle" ? "Add To Cart" : "Adding..."}
    </Button>
  );
}

export function AddToCart({
  selectedVariant,
  quantity,
}: {
  selectedVariant: ProductVariant | undefined;
  quantity: number;
}) {
  const fetcher = useFetcher({ key: "add-to-cart" });
  const { setIsCartOpen } = useCartStore();

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      // Open cart when product has been added
      setIsCartOpen(true);
    }
  }, [fetcher.state, fetcher.data, setIsCartOpen]);

  return (
    <fetcher.Form method="post" action="/api/cart/add">
      <input type="hidden" name="variantId" value={selectedVariant?.id} />
      <input type="hidden" name="quantity" value={quantity} />
      <SubmitButton selectedVariant={selectedVariant} />
    </fetcher.Form>
  );
}
