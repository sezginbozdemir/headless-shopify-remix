import { useSearchParams } from "@remix-run/react";
import { Checkbox } from "@/components/ui/checkbox";
import { useUpdateParams } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PriceFilter } from "./price-filter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Spacing } from "@/components/spacing";
import { ShopifyFilter } from "@/lib/shopify/types";

type Props = {
  filters: ShopifyFilter[];
};

export function ProductFilters({ filters }: Props) {
  const [searchParams] = useSearchParams();
  const updateParams = useUpdateParams();

  return (
    <div className="flex gap-2 h-[100vh]  sticky top-0">
      <div className="py-[1rem] w-full h-full">
        <Accordion type="single" collapsible className="w-full">
          {filters.map((filter, index) => (
            <AccordionItem key={index} value={filter.label}>
              <AccordionTrigger>{filter.label}</AccordionTrigger>
              <AccordionContent>
                <ScrollArea className="h-[200px]">
                  {filter.label === "Price" ? (
                    <PriceFilter filter={filter} />
                  ) : (
                    filter.values.map((value, idx) => (
                      <div className="flex gap-2 items-center" key={idx}>
                        <Checkbox
                          checked={searchParams
                            .getAll(filter.label)
                            .includes(value.label)}
                          onClick={() =>
                            updateParams(filter.label, value.label)
                          }
                          id={`${value.label}`}
                        />
                        <label
                          className="font-heading text-lg"
                          htmlFor={`${value.label}`}
                        >
                          {value.label}
                        </label>
                      </div>
                    ))
                  )}
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <Spacing size={1} />
      </div>
      <Separator orientation="vertical" />
    </div>
  );
}
