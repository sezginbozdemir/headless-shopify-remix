import { Form } from "@remix-run/react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "../ui/dialog";
import { Address } from "@/lib/shopify/types";
import { Input } from "../ui/input";
interface Props {
  editingAddress: Address | null;
  onClose: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const addressFields: { [key: string]: string } = {
  address1: "Address Line 1",
  address2: "Address Line 2",
  city: "City",
  country: "Country",
};

export function AddressDialog({
  open,
  setOpen,
  editingAddress,
  onClose,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingAddress ? "Edit Address" : "Add Address"}
          </DialogTitle>
        </DialogHeader>
        <Form
          onSubmit={() => {
            onClose();
          }}
          className="space-y-4"
          method="post"
        >
          {Object.entries(addressFields).map(([key, label]) => (
            <div key={key}>
              <label
                htmlFor={key}
                className="block text-sm font-medium text-gray-700"
              >
                {label}
              </label>
              <Input
                id={key}
                name={key}
                defaultValue={editingAddress?.[key as keyof Address] ?? ""}
              />
            </div>
          ))}
          <input type="hidden" name="id" value={editingAddress?.id} />

          <DialogFooter>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
