import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Form } from "@remix-run/react";
import { Search, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Collection } from "@/lib/shopify/types";

interface Props {
  collections: Collection[];
}

export function SearchInput({ collections }: Props) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [hovered, setHovered] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isActive = hovered || dropdownOpen;
  return (
    <Form method="post" action="/search">
      <div className="relative h-[45px]">
        <div
          className={`absolute left-[1px] top-1/2 -translate-y-1/2 cursor-pointer w-[160px] h-[95%] hover:bg-white rounded-full flex items-center justify-center ${
            isActive ? `bg-white` : ``
          }`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger className="flex justify-between gap-2 w-full items-center focus:outline-none focus:ring-0 focus:ring-transparent">
              <h2 className="font-[500] pl-6  ">
                {!selectedCategory ? "Categories" : `${selectedCategory}`}
              </h2>
              {isActive ? (
                <div className="pr-6">
                  <ChevronDown size={16} />
                </div>
              ) : (
                <Separator
                  className="h-[20px] w-[1.5px] mr-6 bg-gray-400"
                  orientation="vertical"
                />
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mt-4">
              {collections.map((item, index) => (
                <DropdownMenuItem
                  key={index}
                  className="text-md font-heading font-[450]"
                  onSelect={() => {
                    setSelectedCategory(item.title);
                    setHovered(false);
                  }}
                >
                  {item.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <input type="hidden" name="category" value={selectedCategory} />
        <Input
          name="query"
          className="w-full h-full  pl-[165px] pr-12 rounded-full bg-gray-100 border-none shadow-none"
          placeholder="Search products"
        />

        <button
          type="submit"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          <Search size={20} />
        </button>
      </div>
    </Form>
  );
}
