import { ProductToolbar } from "@/components/product/product-toolbar";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductGrid } from "@/components/product/product-grid";
import { PaginationBar } from "@/components/pagination-bar";
import { Spacing } from "@/components/spacing";
import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "@remix-run/react";
import { ProductsResult, ShopifyFilter } from "@/lib/shopify/types";
import clsx from "clsx";

type ProductLayoutProps = {
  productsData: ProductsResult;
  search?: boolean;
  filters: ShopifyFilter[];
};

export function ProductLayout({
  productsData,
  search,
  filters,
}: ProductLayoutProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [searchParams] = useSearchParams();
  const sort = searchParams.get("sort") ?? undefined;
  const products = productsData.products;
  const filterRef = useRef(null);

  useEffect(() => {
    if (!filtersOpen && isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [filtersOpen, isAnimating]);

  const handleToggleFilters = () => {
    if (filtersOpen) {
      setIsAnimating(true);
      setFiltersOpen(false);
    } else {
      setIsAnimating(true);
      setFiltersOpen(true);
    }
  };

  return (
    <div className="w-full">
      <ProductToolbar
        onToggleFilters={handleToggleFilters}
        sortValue={sort}
        search={search}
      />
      <Spacing size={1} />
      <div className="relative flex flex-col md:flex-row w-full justify-between gap-[10px]">
        {(filtersOpen || isAnimating) && (
          <div
            ref={filterRef}
            className={clsx(
              "w-full md:min-w-[300px] md:max-w-[350px]",
              "animate-duration-300",
              "animate-ease-in-out",
              "bg-white z-10",
              filtersOpen
                ? "animate-in slide-in-from-left"
                : "animate-out slide-out-to-left",
            )}
          >
            <ProductFilters filters={filters} />
          </div>
        )}
        <ProductGrid filtersOpen={isAnimating} products={products} />
      </div>

      <Spacing size={2} />
      <PaginationBar
        next={productsData.next}
        prev={productsData.prev}
        end={productsData.end}
        start={productsData.start}
      />
    </div>
  );
}
