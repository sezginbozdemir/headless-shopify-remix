import { Pen, Trash, PackageSearch, Plus } from "lucide-react";
import { getCustomerInfo } from "@/lib/shopify";
import { data, LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { Address } from "@/lib/shopify/types";
import { Spacing } from "@/components/spacing";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const loader: LoaderFunction = async ({ request }) => {
  const req = await getCustomerInfo(request);

  if (!req.success) {
    return data({ error: req.error }, { status: 500 });
  }

  const customer = req.result;
  return { customer };
};

export default function AddressesPage() {
  const { customer } = useLoaderData<typeof loader>();

  const [open, setOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  if (!customer.addresses || customer.addresses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-gray-600 mt-10 gap-4">
        <PackageSearch className="w-16 h-16 text-gray-400" />
        <p className="text-lg font-medium">You don’t have any addresses yet.</p>
      </div>
    );
  }

  const moreThanOneAddress = customer.addresses.length > 1;

  function onEditClick(address: Address) {
    setEditingAddress(address);
    setOpen(true);
  }

  function onAddClick() {
    setEditingAddress(null); // no address data => empty form
    setOpen(true);
  }

  function onClose() {
    setOpen(false);
    setEditingAddress(null);
  }

  return (
    <div className="px-8">
      {/* Edit/Add Address Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? "Edit Address" : "Add Address"}
            </DialogTitle>
          </DialogHeader>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              // Submit does nothing for now
              onClose();
            }}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="address1"
                className="block text-sm font-medium text-gray-700"
              >
                Address 1
              </label>
              <Input
                id="address1"
                name="address1"
                defaultValue={editingAddress?.address1 ?? ""}
                required
              />
            </div>
            <div>
              <label
                htmlFor="address2"
                className="block text-sm font-medium text-gray-700"
              >
                Address 2
              </label>
              <Input
                id="address2"
                name="address2"
                defaultValue={editingAddress?.address2 ?? ""}
              />
            </div>
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                City
              </label>
              <Input
                id="city"
                name="city"
                defaultValue={editingAddress?.city ?? ""}
                required
              />
            </div>
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700"
              >
                Country
              </label>
              <Input
                id="country"
                name="country"
                defaultValue={editingAddress?.country ?? ""}
                required
              />
            </div>

            <DialogFooter>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Default Address Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Your Default Address</h2>
        <Button
          variant="link"
          className="flex items-center gap-2"
          onClick={onAddClick} // <-- add click handler here
        >
          <Plus />
          Add Address
        </Button>
      </div>
      <Spacing size={2} />

      <div
        key={customer.defaultAddress.id}
        className="border border-gray-200 rounded-2xl p-4 shadow-sm bg-white relative"
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-lg font-medium">
              {customer.defaultAddress.address1}
              {customer.defaultAddress.address2
                ? `, ${customer.defaultAddress.address2}`
                : ""}
            </p>
            <p className="text-gray-600">
              {customer.defaultAddress.city}, {customer.defaultAddress.country}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="text-gray-500 hover:text-black"
              onClick={() => onEditClick(customer.defaultAddress)}
              aria-label="Edit default address"
            >
              <Pen size={18} />
            </button>
            <button
              className="text-gray-500 hover:text-red-600"
              aria-label="Remove default address"
            >
              <Trash size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Other Addresses Section */}
      {moreThanOneAddress && (
        <div className="space-y-4 mt-8">
          <h2 className="text-2xl font-semibold">Your Addresses</h2>
          {customer.addresses
            .filter((a: Address) => a.id !== customer.defaultAddress.id)
            .map((address: Address, index: number) => (
              <div
                key={address.id ?? index}
                className="border border-gray-200 rounded-2xl p-4 shadow-sm bg-white relative"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-lg font-medium">
                      {address.address1}
                      {address.address2 ? `, ${address.address2}` : ""}
                    </p>
                    <p className="text-gray-600">
                      {address.city}, {address.country}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="text-gray-500 hover:text-black"
                      onClick={() => onEditClick(address)}
                      aria-label={`Edit address ${address.address1}`}
                    >
                      <Pen size={18} />
                    </button>
                    <button
                      className="text-gray-500 hover:text-red-600"
                      aria-label={`Remove address ${address.address1}`}
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
