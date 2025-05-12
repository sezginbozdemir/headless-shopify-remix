import { ProductToolbar } from "@/components/product/product-toolbar";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductGrid } from "@/components/product/product-grid";
import { PaginationBar } from "@/components/pagination-bar";
import { Spacing } from "@/components/spacing";
import { useState } from "react";
import { useSearchParams } from "@remix-run/react";
import { ProductsResult } from "@/lib/shopify/types";

type ProductLayoutProps = {
  types: string[];
  options: Record<string, string[]>;
  brands: string[];
  productsData: ProductsResult;
};

export function ProductLayout({
  types,
  options,
  brands,
  productsData,
}: ProductLayoutProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const sort = searchParams.get("sort") ?? undefined;
  const products = productsData.products;

  return (
    <>
      <ProductToolbar
        filtersOpen={filtersOpen}
        onToggleFilters={() => setFiltersOpen(!filtersOpen)}
        sortValue={sort}
      />
      <div className="flex relative justify-between gap-[20px]">
        {filtersOpen && (
          <div className="min-w-[300px]">
            <ProductFilters types={types} options={options} brands={brands} />
          </div>
        )}
        <ProductGrid products={products} />
      </div>
      <Spacing size={2} />
      <PaginationBar
        next={productsData.next}
        prev={productsData.prev}
        end={productsData.end}
        start={productsData.start}
      />
    </>
  );
}
