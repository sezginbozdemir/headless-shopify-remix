import { Card } from "@/components/ui/card";
import { useSearchParams } from "@remix-run/react";
import { Checkbox } from "@/components/ui/checkbox";
import { OptionsFilter } from "./options-filter";
import { useUpdateParams } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PriceFilter } from "./price-filter";

type Props = {
  brands: string[];
  options: { [key: string]: string[] };
  types: string[];
};

export function ProductFilters({ types, brands, options }: Props) {
  const [searchParams] = useSearchParams();
  const updateParams = useUpdateParams();

  return (
    <Card className="w-[500px] p-[3rem]">
      <div>
        <Checkbox
          checked={searchParams.get("stock") === "true"}
          onClick={() => updateParams("stock", "true")}
          id="stock"
        />
        <label htmlFor="stock">In stock</label>
      </div>
      <div>
        <h3>Brands</h3>
        <ScrollArea className="h-[200px]">
          {brands.map((brand) => (
            <div key={brand}>
              <Checkbox
                checked={searchParams.getAll("brand").includes(brand)}
                onClick={() => updateParams("brand", brand)}
                id={`brand-${brand}`}
              />
              <label htmlFor={`brand-${brand}`}>{brand}</label>
            </div>
          ))}
        </ScrollArea>
      </div>
      <div>
        <h3>Types</h3>
        <ScrollArea className="h-[200px]">
          {types.map((type) => (
            <div key={type}>
              <Checkbox
                checked={searchParams.getAll("type").includes(type)}
                onClick={() => updateParams("type", type)}
                id={`type-${type}`}
              />
              <label htmlFor={`brand-${type}`}>{type}</label>
            </div>
          ))}
        </ScrollArea>
      </div>

      <OptionsFilter options={options} />
      <PriceFilter />
    </Card>
  );
}
