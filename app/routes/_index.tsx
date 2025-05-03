import { data, type LoaderFunction, type MetaFunction } from "@remix-run/node";
import { getMenu, getCollectionProducts } from "@/lib/shopify";
import { useLoaderData } from "@remix-run/react";
import { Product, Menu } from "@/lib/shopify/types";

type LoaderData = {
  products: Product[];
  menu: Menu[];
};
export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};
export const loader: LoaderFunction = async () => {
  const products = await getCollectionProducts({
    collection: "automated-collection",
  });
  const menu = await getMenu("main-menu");

  return data<LoaderData>({ products, menu });
};

export default function Index() {
  const { menu } = useLoaderData<LoaderData>();
  console.log(menu);
  return (
    <div>
      <div></div>
    </div>
  );
}
