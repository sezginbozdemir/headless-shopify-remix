import { Spacing } from "@/components/spacing";
import { Slider } from "@/components/ui/slider";
import { ShopifyFilter } from "@/lib/shopify/types";
import { useSearchParams } from "@remix-run/react";
import { useState, useMemo } from "react";

interface Props {
  filter: ShopifyFilter;
}

export function PriceFilter({ filter }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const values = filter?.values?.[0];

  const inputObj = values?.input ? JSON.parse(values.input) : null;
  const defaultMin = inputObj?.price?.min ?? 0;
  const defaultMax = inputObj?.price?.max ?? 1000;

  const initialRange = useMemo(() => {
    const param = searchParams.get("price");
    if (!param) return [defaultMin, defaultMax];
    const [minStr, maxStr] = param.split(",");
    const min = parseInt(minStr, 10);
    const max = parseInt(maxStr, 10);
    return [min, max];
  }, [searchParams, defaultMax, defaultMin]);

  const [priceRange, setPriceRange] = useState<number[]>(initialRange);

  const handleValueCommit = (val: [number, number]) => {
    const params = new URLSearchParams(searchParams);
    params.set("price", `${val[0]},${val[1]}`);
    setSearchParams(params);
  };

  return (
    <div>
      <Spacing size={1} />
      <Slider
        min={defaultMin}
        max={defaultMax}
        step={1}
        value={priceRange}
        onValueChange={setPriceRange}
        onValueCommit={handleValueCommit}
        className="mb-2"
      />
      <h3 className="text-lg text-gray-700">
        RON{priceRange[0]} – RON{priceRange[1]}
      </h3>
    </div>
  );
}
