import {
  data,
  LoaderFunctionArgs,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/node";
import { getProductMeta, getCollectionProducts } from "@/lib/shopify";
import { useLoaderData } from "@remix-run/react";
import { ProductsResult } from "@/lib/shopify/types";
import { ProductGrid } from "@/components/product/product-grid";
import { PaginationBar } from "@/components/pagination-bar";
import { Spacing } from "@/components/spacing";
import { ProductFilters } from "@/components/product/product-filters";
import { parseFilters } from "@/lib/utils";
import { ProductToolbar } from "@/components/product/product-toolbar";
import { useState } from "react";
type LoaderData = {
  brands: string[];
  options: Record<string, string[]>;
  types: string[];
  collectionProducts: ProductsResult;
};
export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};
export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const { brands, types, options } = await getProductMeta();
  const filters = parseFilters(url, options);
  const after = url.searchParams.get("after") ?? undefined;
  const before = url.searchParams.get("before") ?? undefined;
  const collectionProducts = await getCollectionProducts({
    collection: "all-products",
    filters: filters,
    sortKey: "TITLE",
    after: after,
    before: before,
    reverse: true,
  });

  return data<LoaderData>({
    collectionProducts,
    brands,
    options,
    types,
  });
};

export default function ProductsPage() {
  const { types, collectionProducts, brands, options } =
    useLoaderData<LoaderData>();
  const products = collectionProducts.products;
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortKey, setSortKey] = useState("TITLE");

  return (
    <>
      <ProductToolbar
        filtersOpen={filtersOpen}
        onToggleFilters={() => setFiltersOpen(!filtersOpen)}
        sortValue={sortKey}
        onSortChange={(value) => setSortKey(value)}
      />
      <div className="flex">
        {filtersOpen && (
          <>
            <Spacing direction="horizontal" size={1} />
            <ProductFilters types={types} options={options} brands={brands} />
          </>
        )}
        <Spacing direction="horizontal" size={3} />
        <ProductGrid products={products} />
        <Spacing direction="horizontal" size={1} />
      </div>
      <Spacing size={2} />
      <PaginationBar
        next={collectionProducts.next}
        prev={collectionProducts.prev}
        end={collectionProducts.end}
        start={collectionProducts.start}
      />
    </>
  );
}
