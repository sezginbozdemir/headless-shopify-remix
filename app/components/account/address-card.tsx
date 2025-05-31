import { Form } from "@remix-run/react";
import { Button } from "../ui/button";
import { Address } from "@/lib/shopify/types";
import { Pen, Trash } from "lucide-react";
interface Props {
  address: Address;
  onClick: (address: Address) => void;
  defaultAddress?: boolean;
}

export function AddressCard({ address, onClick, defaultAddress }: Props) {
  return (
    <div className="border rounded-2xl p-4 shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-lg font-medium">
            {address.address1}
            {address.address2 ? `, ${address.address2}` : ""}
          </p>
          <p className="text-gray-600">
            {address.city}, {address.country}
          </p>
        </div>
        <div className="flex gap-5 items-center">
          {!defaultAddress && (
            <Form method="post">
              <input type="hidden" name="updateId" value={address.id} />
              <Button type="submit" variant="ghost">
                Make it default
              </Button>
            </Form>
          )}
          <button
            className="text-gray-500 hover:text-black"
            onClick={() => onClick(address)}
          >
            <Pen size={18} />
          </button>
          <Form method="post">
            <input type="hidden" name="deleteId" value={address.id} />
            <button type="submit" className="text-gray-500 hover:text-red-600">
              <Trash size={18} />
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}
