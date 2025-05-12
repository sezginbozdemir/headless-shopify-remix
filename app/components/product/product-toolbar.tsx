import { useNavigate, useSearchParams } from "@remix-run/react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Props = {
  filtersOpen: boolean;
  onToggleFilters: () => void;
  sortValue: string | undefined;
};

export function ProductToolbar({
  filtersOpen,
  onToggleFilters,
  sortValue,
}: Props) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  function updateSortParam(value: string) {
    const params = new URLSearchParams(searchParams);

    params.set("sort", value);
    params.delete("after");
    params.delete("before");
    params.delete("page");
    navigate(`?${params.toString()}`);
  }

  return (
    <div className="flex items-center justify-between mb-[0.5rem]">
      <Button onClick={onToggleFilters} className="w-[150px] px-4 py-2 rounded">
        {filtersOpen ? "Hide Filters" : "Show Filters"}
      </Button>

      <Select value={sortValue} onValueChange={(e) => updateSortParam(e)}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="TITLE-ASC">Alphabetically A-Z</SelectItem>
          <SelectItem value="TITLE-DESC">Alphabetically Z-A</SelectItem>
          <SelectItem value="PRICE-DESC">Price High to Low</SelectItem>
          <SelectItem value="PRICE-ASC">Price Low to High</SelectItem>
          <SelectItem value="CREATED-ASC">Date Old to New</SelectItem>
          <SelectItem value="CREATED-DESC">Date New to Old</SelectItem>
          <SelectItem value="BEST_SELLING-ASC">Popularity</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
