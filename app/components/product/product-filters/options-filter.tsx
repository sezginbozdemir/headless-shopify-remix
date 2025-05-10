import { Checkbox } from "@/components/ui/checkbox";
import { useSearchParams } from "@remix-run/react";
import { useUpdateParams } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = {
  options: { [key: string]: string[] };
};

export function OptionsFilter({ options }: Props) {
  const [searchParams] = useSearchParams();
  const updateParams = useUpdateParams();

  return Object.entries(options).map(([optionName, optionValues]) => (
    <div key={optionName} className="option-filter">
      <h3>{optionName}</h3>
      <ScrollArea className="h-[200px]">
        {optionValues.map((value: string) => (
          <div key={value}>
            <Checkbox
              checked={searchParams.getAll(optionName).includes(value)}
              onClick={() => updateParams(optionName, value)}
              id={`${optionName}-${value}`}
            />
            <label htmlFor={`${optionName}-${value}`}>{value}</label>
          </div>
        ))}
      </ScrollArea>
    </div>
  ));
}
