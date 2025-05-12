import { Checkbox } from "@/components/ui/checkbox";
import { useSearchParams } from "@remix-run/react";
import { useUpdateParams } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Props = {
  options: { [key: string]: string[] };
};

export function OptionsFilter({ options }: Props) {
  const [searchParams] = useSearchParams();
  const updateParams = useUpdateParams();

  return (
    <Accordion type="single" collapsible className="w-full">
      {Object.entries(options).map(([optionName, optionValues]) => (
        <AccordionItem value={optionName} key={optionName}>
          <AccordionTrigger>{optionName}</AccordionTrigger>
          <AccordionContent>
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
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
