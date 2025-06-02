import {
  data,
  LoaderFunctionArgs,
  redirect,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/node";
import { getFilters, getSearchProducts } from "@/lib/shopify";
import { useLoaderData } from "@remix-run/react";
import { parseFilters } from "@/lib/utils";
import { ProductLayout } from "@/components/product/product-layout";
import { Separator } from "@/components/ui/separator";
import { Spacing } from "@/components/spacing";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const query = formData.get("query");
  const type = formData.get("category");
  const url = type
    ? `/search?query=${query}&Tags=${type}`
    : `/search?query=${query}`;

  if (typeof query === "string" && query.trim() !== "") {
    return redirect(url);
  }

  return redirect("/products");
}

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const params = new URL(request.url).searchParams;
  const filtersReq = await getFilters({ collection: "all-products" });
  const availableFilters = filtersReq.success ? filtersReq.result : null;

  const filters = availableFilters
    ? parseFilters(params, availableFilters)
    : undefined;
  const after = params.get("after") ?? undefined;
  const before = params.get("before") ?? undefined;
  const query = params.get("query") ?? "";
  const sort = params.get("sort") ?? undefined;
  const [sortField, sortOrder] = sort?.split("-") ?? ["RELEVANCE", "ASC"];
  const reverse = sortOrder === "DESC";
  const req = await getSearchProducts({
    after: after,
    before: before,
    filters: filters,
    query: query,
    sortKey: sortField,
    reverse: reverse,
  });
  if (!req.success) {
    throw new Response(req.error, {
      status: 500,
      statusText: "Failed to get search products, please try again later",
    });
  }

  const search = req.result;

  return data({
    search,
    filters: search.filters,
    count: search.count,
    query,
  });
};

export default function SearchPage() {
  const { search, filters, count, query } = useLoaderData<typeof loader>();
  return (
    <>
      <div className="flex flex-col md:flex-row gap-5 items-start md:items-center mt-4">
        <h1 className="text-4xl md:text-6xl font-[500]">{`Results for "${query}"`}</h1>
        {count !== undefined && (
          <>
            <Separator
              className="hidden md:block h-[30px]"
              orientation="vertical"
            />
            <h5 className="text-xl text-gray-600">
              {count} item{count !== 1 && "s"} found
            </h5>
          </>
        )}
      </div>
      <Spacing size={2} />
      <ProductLayout filters={filters} productsData={search} search />
    </>
  );
}
