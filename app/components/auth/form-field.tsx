import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function FormField({
  field,
}: {
  field: {
    name: string;
    type: string;
    placeholder: string;
    required?: boolean;
  };
}) {
  if (field.type === "checkbox") {
    return (
      <label className="block mb-2">
        <Checkbox name={field.name} className="mr-2" />
        {field.placeholder}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
    );
  }

  return (
    <div className="w-full flex flex-col gap-1.5">
      <Label className="font-heading text-lg" htmlFor="email">
        {field.placeholder}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        name={field.name}
        type={field.type}
        placeholder={field.placeholder}
        required={field.name !== "acceptsMarketing"}
        className="block w-full mb-2 border p-2"
      />
    </div>
  );
}
