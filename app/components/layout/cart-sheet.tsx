import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Spacing } from "../spacing";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { CartList } from "../cart/cart-list";
import { CartSummary } from "../cart/cart-summary";
import { Cart } from "@/lib/shopify/types";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: Cart | null;
  emptyCart: boolean;
}

export function CartSheet({
  open,
  onOpenChange,
  cart,
  emptyCart,
}: CartSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full flex flex-col sm:w-[650px]">
        <SheetHeader>
          <SheetTitle className="text-5xl font-[450] self-start">
            Your Cart
          </SheetTitle>
        </SheetHeader>

        <Spacing size={2} />
        <Separator />
        <Spacing size={2} />

        <ScrollArea>
          <CartList sheet cart={cart} />
        </ScrollArea>

        {!emptyCart && cart !== null && (
          <CartSummary
            closeSheet={() => onOpenChange(false)}
            sheet
            cart={cart}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
