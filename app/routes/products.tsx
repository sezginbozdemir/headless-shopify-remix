import { type LoaderFunction, type MetaFunction } from "@remix-run/node";
import { getProductMeta, getCollectionProducts } from "@/lib/shopify";
import { useLoaderData } from "@remix-run/react";
import { parseFilters } from "@/lib/utils";
import { ProductLayout } from "@/components/product/product-layout";
export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};
export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const { brands, types, options } = await getProductMeta();
  const filters = parseFilters(url, options);
  const after = url.searchParams.get("after") ?? undefined;
  const before = url.searchParams.get("before") ?? undefined;
  const sort = url.searchParams.get("sort") ?? undefined;
  const [sortField, sortOrder] = sort?.split("-") ?? ["CREATED", "ASC"];
  const reverse = sortOrder === "DESC";
  const collectionProducts = await getCollectionProducts({
    collection: "all-products",
    filters,
    sortKey: sortField,
    after,
    before,
    reverse,
  });

  return {
    collectionProducts,
    options,
    brands,
    types,
  };
};

export default function ProductsPage() {
  const { options, brands, types, collectionProducts } =
    useLoaderData<typeof loader>();

  return (
    <>
      <ProductLayout
        options={options}
        brands={brands}
        types={types}
        productsData={collectionProducts}
      />
    </>
  );
}
