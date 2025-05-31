import { getCollections } from "@/lib/shopify";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { ArrowRight } from "lucide-react";
import { Collection } from "@/lib/shopify/types";

export const meta: MetaFunction = () => {
  return [
    { title: "Shop Collections" },
    { name: "description", content: "Browse all available collections" },
  ];
};

export const loader: LoaderFunction = async () => {
  const collectionsReq = await getCollections();
  if (!collectionsReq.success) {
    throw new Response(collectionsReq.error, {
      status: 500,
      statusText: "Failed to fetch collections, please try again later",
    });
  }

  return {
    collections: collectionsReq.result,
  };
};

export default function CollectionsPage() {
  const { collections } = useLoaderData<{ collections: Collection[] }>();

  return (
    <section>
      <h1 className="text-3xl font-medium mb-8 text-center">
        Shop Collections
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {collections.map((col) => (
          <Link
            to={`/products?collection=${col.handle}`}
            key={col.id}
            className="group relative h-64 cursor-pointer overflow-hidden rounded-xl hover:rounded-3xl transition-all duration-300"
          >
            <img
              src={col.image?.url}
              alt={col.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute left-0 bottom-0 w-full px-4 py-3 flex items-center justify-between backdrop-blur-lg bg-black/10">
              <h2 className="text-white text-xl font-medium group-hover:underline">
                {col.title}
              </h2>
              <ArrowRight className="text-white w-6 h-6" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
