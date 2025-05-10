import {
  data,
  LoaderFunctionArgs,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/node";
import { getMenu, getProductMeta, getSearchProducts } from "@/lib/shopify";
import { useLoaderData } from "@remix-run/react";
import { Menu, ProductsResult } from "@/lib/shopify/types";
import { parseFilters } from "@/lib/utils";

type LoaderData = {
  search: ProductsResult;
  menu: Menu[];
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
  const { brands, types, options } = await getProductMeta();
  const url = new URL(request.url);
  const filters = parseFilters(url, options);
  const after = url.searchParams.get("after") ?? undefined;
  const before = url.searchParams.get("before") ?? undefined;

  const search = await getSearchProducts({
    after: after,
    before: before,
    filters: filters,
    query: "",
    sortKey: "PRICE",
  });
  const menu = await getMenu("main-menu");

  return data<LoaderData>({ search, menu });
};

export default function Index() {
  const { search } = useLoaderData<LoaderData>();
  return (
    <div>
      <div></div>
    </div>
  );
}
