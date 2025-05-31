import { type LoaderFunction, type MetaFunction } from "@remix-run/node";
import {
  getCollectionProducts,
  getCollections,
  getFilters,
} from "@/lib/shopify";
import { useLoaderData } from "@remix-run/react";
import { parseFilters } from "@/lib/utils";
import { ProductLayout } from "@/components/product/product-layout";
import { Spacing } from "@/components/spacing";
import { Separator } from "@/components/ui/separator";
import { Collection } from "@/lib/shopify/types";
export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};
export const loader: LoaderFunction = async ({ request }) => {
  const params = new URL(request.url).searchParams;
  const sort = params.get("sort") ?? undefined;
  const collectionKey = params.get("collection") ?? undefined;
  const [sortField, sortOrder] = sort?.split("-") ?? ["CREATED", "ASC"];
  const filtersReq = await getFilters({
    collection: collectionKey || "all-products",
  });
  const availableFilters = filtersReq.success ? filtersReq.result : undefined;
  const filters = availableFilters
    ? parseFilters(params, availableFilters)
    : undefined;
  const after = params.get("after") ?? undefined;
  const before = params.get("before") ?? undefined;
  const reverse = sortOrder === "DESC";
  const collectionsReq = await getCollections();
  const collections = collectionsReq.success ? collectionsReq.result : null;
  const productsReq = await getCollectionProducts({
    collection: collectionKey || "all-products",
    filters,
    sortKey: sortField,
    after,
    before,
    reverse,
  });
  if (!productsReq.success) {
    throw new Response(productsReq.error, {
      status: 500,
      statusText: "Failed to fetch products, please try again later.",
    });
  }
  const products = productsReq.result;

  return {
    products,
    collectionKey,
    collections,
  };
};

export default function ProductsPage() {
  const { collections, products, collectionKey } =
    useLoaderData<typeof loader>();
  const collection = collections.find(
    (item: Collection) => item.handle === collectionKey
  );
  const title = collection?.title || "Products";
  const desc = collection?.description || "";

  return (
    <>
      <div className="flex gap-5 items-center">
        <h1 className="text-6xl font-[500]">{title}</h1>
        {desc && <Separator className="h-[30px]" orientation="vertical" />}
        <h5 className="text-xl text-gray-600">{desc}</h5>
      </div>
      <Spacing size={2} />
      <ProductLayout filters={products.filters} productsData={products} />
    </>
  );
}
