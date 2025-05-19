import { useNavigate, useSearchParams } from "@remix-run/react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ListFilterPlus } from "lucide-react";
import { Separator } from "../ui/separator";
import { Spacing } from "../spacing";

type Props = {
  onToggleFilters: () => void;
  sortValue: string | undefined;
  search?: boolean;
};

const sortKeys = [
  { label: "Alphabetically A-Z", key: "TITLE-ASC" },
  { label: "Alphabetically Z-A", key: "TITLE-DESC" },
  { label: "Price High to Low", key: "PRICE-DESC" },
  { label: "Price Low to High", key: "PRICE-ASC" },
  { label: "Date Old to New", key: "CREATED-ASC" },
  { label: "Date New to Old", key: "CREATED-DESC" },
  { label: "Popularity", key: "BEST_SELLING-ASC" },
];
const searchSortKeys = [
  { label: "Price High to Low", key: "PRICE-DESC" },
  { label: "Price Low to High", key: "PRICE-ASC" },
  { label: "Relevance", key: "RELEVANCE-ASC" },
];

export function ProductToolbar({ onToggleFilters, sortValue, search }: Props) {
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

  const sort = search ? searchSortKeys : sortKeys;
  return (
    <>
      <Separator />
      <Spacing size={1} />
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onToggleFilters}
          className="text-2xl font-[500]"
        >
          Filters
          <ListFilterPlus size={30} />
        </Button>

        <div className="flex gap-2 items-center">
          <h2 className="text-2xl font-[500]">Sort by:</h2>
          <Select value={sortValue} onValueChange={(e) => updateSortParam(e)}>
            <SelectTrigger className="w-[200px] h-[40px] text-lg font-[400] font-heading">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sort.map((item, index) => (
                <SelectItem
                  className="text-lg font-[400] font-heading"
                  key={index}
                  value={item.key}
                >
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Spacing size={1} />
      <Separator />
    </>
  );
}
