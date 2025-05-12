import { Card } from "@/components/ui/card";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { Checkbox } from "@/components/ui/checkbox";
import { OptionsFilter } from "./options-filter";
import { useUpdateParams } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PriceFilter } from "./price-filter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Props = {
  brands: string[];
  options: Record<string, string[]>;
  types: string[];
};

export function ProductFilters({ types, brands, options }: Props) {
  const [searchParams] = useSearchParams();
  const updateParams = useUpdateParams();

  return (
    <Card className="px-[2rem] py-[1rem] w-full h-[100vh] sticky top-0">
      <div>
        <Checkbox
          checked={searchParams.get("stock") === "true"}
          onClick={() => updateParams("stock", "true")}
          id="stock"
        />
        <label htmlFor="stock">In stock</label>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {[types, brands].map((items, index) => {
          const paramKey = index === 0 ? "type" : "brand";
          const title = index === 0 ? "Types" : "Brands";

          return (
            <AccordionItem key={paramKey} value={paramKey}>
              <AccordionTrigger>{title}</AccordionTrigger>
              <AccordionContent>
                <ScrollArea className="h-[200px]">
                  {items.map((item) => (
                    <div key={item}>
                      <Checkbox
                        checked={searchParams.getAll(paramKey).includes(item)}
                        onClick={() => updateParams(paramKey, item)}
                        id={`${paramKey}-${item}`}
                      />
                      <label htmlFor={`${paramKey}-${item}`}>{item}</label>
                    </div>
                  ))}
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
      <OptionsFilter options={options} />
      <PriceFilter />
    </Card>
  );
}
