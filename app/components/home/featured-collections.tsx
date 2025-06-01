import { Link } from "@remix-run/react";
import { ArrowRight } from "lucide-react";
import { Collection } from "@/lib/shopify/types";

interface Props {
  collections: Collection[];
}

export function FeaturedCollections({ collections }: Props) {
  const featured = collections.filter((col) => col.type).slice(0, 5);
  if (featured.length < 5) return null;

  return (
    <div className="flex flex-col md:flex-row gap-4 h-[600px]">
      {/* Left big item */}
      <Link
        to={`/products?collection=${featured[0].handle}`}
        className="group relative flex-1 basis-1/3 cursor-pointer overflow-hidden rounded-xl hover:rounded-3xl transition-all duration-300"
      >
        <img
          src={featured[0].image?.url}
          alt={featured[0].title}
          className="w-full h-full object-cover"
        />
        <div className="absolute left-0 bottom-0 w-full px-7 py-5 flex items-center justify-between backdrop-blur-lg bg-black/10">
          <h2 className="text-white text-2xl font-medium group-hover:underline">
            {featured[0].title}
          </h2>
          <ArrowRight className="text-white w-8 h-8" />
        </div>
      </Link>

      {/* Right 4 items */}
      <div className="flex-1 basis-1/2 flex flex-wrap gap-4">
        {featured.slice(1).map((col) => (
          <Link
            to={`/products?collection=${col.handle}`}
            key={col.id}
            className="group relative basis-[calc(50%-8px)] h-[calc(50%-8px)] cursor-pointer overflow-hidden rounded-xl hover:rounded-3xl transition-all duration-300"
          >
            <img
              src={col.image?.url}
              alt={col.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute left-0 bottom-0 w-full px-4 py-3 flex items-center justify-between backdrop-blur-lg bg-black/10">
              <h2 className="text-white text-2xl font-medium group-hover:underline">
                {col.title}
              </h2>
              <ArrowRight className="text-white w-8 h-8" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
