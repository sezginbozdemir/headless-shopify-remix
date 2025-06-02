import { PackageSearch, Plus } from "lucide-react";
import {
  createAddress,
  deleteAddress,
  getCustomerInfo,
  updateAddress,
  updateDefaultAddress,
} from "@/lib/shopify";
import {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Address } from "@/lib/shopify/types";
import { Spacing } from "@/components/spacing";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AddressDialog } from "@/components/account/address-dialog";
import { AddressCard } from "@/components/account/address-card";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const addressId = formData.get("id") as string | null;
  const deleteId = formData.get("deleteId") as string;
  const updateId = formData.get("updateId") as string;
  const address: Omit<Address, "id"> = {
    address1: formData.get("address1") as string,
    address2: formData.get("address2") as string,
    city: formData.get("city") as string,
    country: formData.get("country") as string,
  };

  const req = addressId
    ? await updateAddress(request, address, addressId)
    : deleteId
    ? await deleteAddress(request, deleteId)
    : updateId
    ? await updateDefaultAddress(request, updateId)
    : await createAddress(request, address);

  if (req.success) {
    return redirect("/account/addresses");
  }

  throw new Response(req.error, {
    status: 400,
    statusText: "Failed to initiate address operation, please try again later",
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  const req = await getCustomerInfo(request);

  if (!req.success) {
    throw new Response(req.error, {
      status: 500,
      statusText: "Failed to fetch customer info, please try again later.",
    });
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
        <AddressDialog
          onClose={onClose}
          open={open}
          setOpen={setOpen}
          editingAddress={editingAddress}
        />
        <PackageSearch className="w-16 h-16 text-gray-400" />
        <p className="text-lg font-medium">You don’t have any addresses yet.</p>
        <Button variant="link" onClick={onAddClick}>
          <Plus />
          Add Address
        </Button>
      </div>
    );
  }

  const moreThanOneAddress = customer.addresses.length > 1;

  function onEditClick(address: Address) {
    setEditingAddress(address);
    setOpen(true);
  }

  function onAddClick() {
    setEditingAddress(null);
    setOpen(true);
  }

  function onClose() {
    setOpen(false);
    setEditingAddress(null);
  }

  return (
    <div className="md:px-8">
      <AddressDialog
        onClose={onClose}
        open={open}
        setOpen={setOpen}
        editingAddress={editingAddress}
      />

      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-semibold">
          Your Default Address
        </h2>
        <Button variant="link" onClick={onAddClick}>
          <Plus />
          Add Address
        </Button>
      </div>
      <Spacing size={2} />

      <AddressCard
        defaultAddress
        address={customer.defaultAddress}
        onClick={onEditClick}
      />

      {moreThanOneAddress && (
        <div className="space-y-4 mt-8">
          <h2 className="text-xl md:text-2xl font-semibold">Your Addresses</h2>
          {customer.addresses
            .filter((a: Address) => a.id !== customer.defaultAddress.id)
            .map((address: Address, index: number) => (
              <AddressCard
                key={index}
                address={address}
                onClick={onEditClick}
              />
            ))}
        </div>
      )}
    </div>
  );
}
