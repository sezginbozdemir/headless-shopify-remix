import { useNavigate, useSearchParams } from "@remix-run/react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ListFilterPlus, X } from "lucide-react";
import { Separator } from "../ui/separator";
import { Spacing } from "../spacing";
import { Badge } from "../ui/badge";

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
  const excludedParams = [
    "query",
    "sort",
    "page",
    "after",
    "before",
    "collection",
  ];
  const filters = Array.from(searchParams.entries()).reduce<
    Record<string, string[]>
  >((acc, [key, value]) => {
    if (excludedParams.includes(key)) return acc;
    if (!acc[key]) acc[key] = [];
    acc[key].push(value);
    return acc;
  }, {});
  function updateSortParam(value: string) {
    const params = new URLSearchParams(searchParams);

    params.set("sort", value);
    params.delete("after");
    params.delete("before");
    params.delete("page");
    navigate(`?${params.toString()}`);
  }
  function removeFilter(key: string, valueToRemove: string) {
    const params = new URLSearchParams(searchParams);

    const currentValues = params.getAll(key);

    const updatedValues = currentValues.filter((v) => v !== valueToRemove);

    params.delete(key);

    updatedValues.forEach((v) => params.append(key, v));

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
        <div className="flex flex-1 gap-4">
          {Object.entries(filters).map(([key, values]) => (
            <div
              key={key}
              className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full"
            >
              <span className="font-medium">{key}</span>
              <div className="flex gap-1">
                {values.map((value, idx) => (
                  <Badge
                    key={idx}
                    className="px-2 py-1 rounded-full bg-white text-foreground hover:bg-white hover:border-foreground"
                  >
                    {value}
                    <X
                      onClick={() => removeFilter(key, value)}
                      className="ml-2 cursor-pointer"
                      size={14}
                    />
                  </Badge>
                ))}
              </div>
              <span className="text-gray-500">({values.length})</span>
            </div>
          ))}
        </div>

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
