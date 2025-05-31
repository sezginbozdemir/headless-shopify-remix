import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Product } from "@/lib/shopify/types";
import { getProduct, getRelatedProducts } from "@/lib/shopify";

import ProductDetail from "@/components/product/product-detail";
import { Spacing } from "@/components/spacing";
import { ProductCarousel } from "@/components/product/product-carousel";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data || data.error) {
    return [
      { title: "Product Not Found" },
      { name: "description", content: "No product found." },
    ];
  }

  return [
    { title: data.product.title },
    {
      name: "description",
      content: data.product.title || "Product details",
    },
  ];
};
export const loader: LoaderFunction = async ({ params }) => {
  const handle = params.product;

  if (!handle) {
    throw new Response("Provide handle", {
      status: 400,
      statusText: "No handle thats not even possible",
    });
  }

  const req = await getProduct(handle);

  if (!req.success) {
    throw new Response(req.error, {
      status: 404,
      statusText: "Product not found",
    });
  }

  const product = req.result;
  if (!product) {
    throw new Response("Product not found", {
      status: 404,
      statusText: "Product not found",
    });
  }
  const relatedReq = await getRelatedProducts(handle);
  if (!relatedReq.success) {
    throw new Response(relatedReq.error, {
      status: 404,
      statusText: "Related products not found",
    });
  }

  const products = relatedReq.result;

  return { product, products };
};

export default function ProductDetailPage() {
  const { product, products } = useLoaderData<{
    product: Product;
    products: Product[];
  }>();

  return (
    <>
      <ProductDetail product={product} />
      <Spacing size={5} />
      <ProductCarousel text="Related Products" products={products} />
    </>
  );
}
