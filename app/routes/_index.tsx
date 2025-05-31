import { FeaturedCollections } from "@/components/home/featured-collections";
import { FeaturedProducts } from "@/components/home/featured-products";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { ServiceHighlights } from "@/components/home/service-highlights";
import { Slogan } from "@/components/home/slogan";
import { ProductCarousel } from "@/components/product/product-carousel";
import { Spacing } from "@/components/spacing";
import {
  getCollectionProducts,
  getCollections,
  getMetaobjects,
  getProducts,
  getShopInfo,
} from "@/lib/shopify";
import { type LoaderFunction, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};
export const loader: LoaderFunction = async () => {
  const collectionsReq = await getCollections();
  if (!collectionsReq.success) {
    throw new Response(collectionsReq.error, {
      status: 500,
      statusText: " failed to fetch collections please try again later",
    });
  }

  const collections = collectionsReq.result;

  const featuredReq = await getCollectionProducts({
    collection: "featured",
  });
  if (!featuredReq.success) {
    throw new Response(featuredReq.error, {
      status: 500,
      statusText: "Failed to fetch featured products, please try again later.",
    });
  }
  const featuredProducts = featuredReq.result.products.slice(0, 5);

  const recommendationsReq = await getProducts({ sortKey: "BEST_SELLING" });
  if (!recommendationsReq.success) {
    throw new Response(recommendationsReq.error, {
      status: 500,
      statusText: "failed to fetch shop info, please try again later",
    });
  }
  const recommendedProducts = recommendationsReq.result.products;

  const shopReq = await getShopInfo();
  if (!shopReq.success) {
    throw new Response(shopReq.error, {
      status: 500,
      statusText: "failed to fetch shop info, please try again later",
    });
  }
  const shop = shopReq.result;

  const req = await getMetaobjects("hero_banners");
  if (!req.success) {
    throw new Response(req.error, {
      status: 500,
      statusText: "Failed to fetch meta objects , please try again later.",
    });
  }

  const metaobjects = req.result;
  const highlightsReq = await getMetaobjects("service_highlights");
  if (!highlightsReq.success) {
    throw new Response(highlightsReq.error, {
      status: 500,
      statusText: "Failed to fetch meta objects , please try again later.",
    });
  }

  const serviceHighlights = highlightsReq.result;

  return {
    metaobjects,
    shop,
    recommendedProducts,
    featuredProducts,
    collections,
    serviceHighlights,
  };
};

export default function Index() {
  const {
    metaobjects,
    shop,
    recommendedProducts,
    featuredProducts,
    collections,
    serviceHighlights,
  } = useLoaderData<typeof loader>();
  return (
    <>
      <HeroCarousel metaobjects={metaobjects} />
      <Spacing size={2} />
      <ServiceHighlights services={serviceHighlights} />
      <Spacing size={2} />
      <FeaturedCollections collections={collections} />
      <Spacing size={2} />
      <FeaturedProducts products={featuredProducts} />
      <Spacing size={2} />
      <Slogan slogan={shop.brand.slogan} />
      <Spacing size={2} />
      <ProductCarousel
        text="Best Selling Products"
        products={recommendedProducts}
      />
    </>
  );
}
