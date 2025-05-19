import { PlusIcon } from "lucide-react";
import clsx from "clsx";
import { Product } from "@/lib/shopify/types";
import { Button } from "@/components/ui/button";

import { useFetcher } from "@remix-run/react";

function SubmitButton({
  availableForSale,
  selectedVariantId,
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
}) {
  const buttonClasses =
    "relative flex w-full h-[50px] items-center justify-center p-4 tracking-wide";
  const disabledClasses = "cursor-not-allowed opacity-60 hover:opacity-60";
  const fetcher = useFetcher({ key: "add-to-cart" });

  if (!availableForSale) {
    return (
      <Button disabled className={clsx(buttonClasses, disabledClasses)}>
        Out Of Stock
      </Button>
    );
  }

  if (!selectedVariantId) {
    return (
      <Button disabled className={clsx(buttonClasses, disabledClasses)}>
        <div className="absolute left-0 ml-4">
          <PlusIcon className="h-5" />
        </div>
        Select Variant
      </Button>
    );
  }

  return (
    <Button
      disabled={fetcher.state !== "idle"}
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

export function AddToCart({ product }: { product: Product }) {
  const { variants, availableForSale } = product;
  const selectedVariant = variants[0].id;
  const fetcher = useFetcher({ key: "add-to-cart" });

  return (
    <fetcher.Form method="post" action="/api/cart/add">
      <input type="hidden" name="variantId" value={selectedVariant} />
      <input type="hidden" name="quantity" value={1} />
      <SubmitButton
        availableForSale={availableForSale}
        selectedVariantId={selectedVariant}
      />
    </fetcher.Form>
  );
}
