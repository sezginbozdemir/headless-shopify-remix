import { MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

function SubmitButton({
  type,
  onClick,
}: {
  type: "plus" | "minus";
  onClick: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      type="button"
      variant="ghost"
      className="flex h-full min-w-[36px] max-w-[36px] items-center justify-center rounded-full p-2"
    >
      {type === "plus" ? (
        <PlusIcon className="h-4 w-4 dark:text-neutral-500" />
      ) : (
        <MinusIcon className="h-4 w-4 dark:text-neutral-500" />
      )}
    </Button>
  );
}

export function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
}: {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  return (
    <div className="flex items-center border rounded-full overflow-hidden justify-between w-[180px] h-[70px]">
      <SubmitButton type="minus" onClick={onDecrease} />
      <div className="px-4 py-2 text-lg font-medium min-w-[40px] text-center">
        {quantity}
      </div>
      <SubmitButton type="plus" onClick={onIncrease} />
    </div>
  );
}
