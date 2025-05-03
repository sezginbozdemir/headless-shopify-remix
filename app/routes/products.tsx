import {
  data,
  LoaderFunctionArgs,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/node";
import { getProducts } from "@/lib/shopify";
import { useLoaderData } from "@remix-run/react";
import { Product } from "@/lib/shopify/types";
import { ProductGrid } from "@/components/product/product-grid";
import { PaginationBar } from "@/components/pagination-bar";
import { Spacing } from "@/components/spacing";
const PRODUCTS_PER_PAGE = 8;
type LoaderData = {
  products: Product[];
  totalPages: number;
  currentPage: number;
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
  const pageParam = url.searchParams.get("page");
  const page = Math.max(1, parseInt(pageParam || "1"));
  const products = await getProducts();
  const start = (page - 1) * PRODUCTS_PER_PAGE;
  const end = start + PRODUCTS_PER_PAGE;
  const paginatedProducts = products.slice(start, end);

  return data<LoaderData>({
    products: paginatedProducts,
    currentPage: page,
    totalPages: Math.ceil(products.length / PRODUCTS_PER_PAGE),
  });
};

export default function ProductsPage() {
  const { products, totalPages, currentPage } = useLoaderData<LoaderData>();
  console.log(products);

  return (
    <>
      <ProductGrid products={products} />
      <Spacing />
      <PaginationBar totalPages={totalPages} currentPage={currentPage} />
    </>
  );
}
