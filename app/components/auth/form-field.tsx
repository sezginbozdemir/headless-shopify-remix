import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";

export function FormField({
  field,
}: {
  field: { name: string; type: string; placeholder: string };
}) {
  if (field.type === "checkbox") {
    return (
      <label className="block mb-2">
        <Checkbox name={field.name} className="mr-2" />
        {field.placeholder}
      </label>
    );
  }

  return (
    <Input
      name={field.name}
      type={field.type}
      placeholder={field.placeholder}
      required={field.name !== "acceptsMarketing"}
      className="block w-full mb-2 border p-2"
    />
  );
}
