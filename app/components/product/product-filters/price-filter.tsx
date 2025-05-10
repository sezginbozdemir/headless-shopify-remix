import { Slider } from "@/components/ui/slider";
import { useSearchParams } from "@remix-run/react";
import { useState, useMemo } from "react";

export function PriceFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const defaultMin = 0;
  const defaultMax = 500;

  const initialRange = useMemo(() => {
    const param = searchParams.get("price");
    if (!param) return [defaultMin, defaultMax];
    const [minStr, maxStr] = param.split(",");
    const min = parseInt(minStr, 10);
    const max = parseInt(maxStr, 10);
    return [min, max];
  }, [searchParams]);

  const [priceRange, setPriceRange] = useState<number[]>(initialRange);

  const handleValueCommit = (val: [number, number]) => {
    const params = new URLSearchParams(searchParams);
    params.set("price", `${val[0]},${val[1]}`);
    setSearchParams(params);
  };

  return (
    <div>
      <h3>Price Range</h3>
      <Slider
        min={defaultMin}
        max={defaultMax}
        step={1}
        value={priceRange}
        onValueChange={setPriceRange}
        onValueCommit={handleValueCommit}
        className="mb-2"
      />
      <div className="text-sm text-gray-700">
        RON{priceRange[0]} – RON{priceRange[1]}
      </div>
    </div>
  );
}
