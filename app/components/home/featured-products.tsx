import { Product } from "@/lib/shopify/types";
import { ProductCard } from "../product/product-card";
import { Card } from "../ui/card";
import { useNavigate } from "@remix-run/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Button } from "../ui/button";
import { Spacing } from "../spacing";

interface Props {
  products: Product[];
}

export function FeaturedProducts({ products }: Props) {
  const navigate = useNavigate();

  if (!products || products.length < 5) return null;

  const [mainProduct, ...gridProducts] = products;

  return (
    <>
      <div className="w-full flex justify-between items-center">
        <h1 className="text-3xl">Featured Products</h1>
        <Button
          onClick={() => navigate("/products?collection=featured")}
          variant="link"
        >
          View all
        </Button>
      </div>
      <Spacing size={1} />
      <div className="flex flex-col md:flex-row gap-4">
        {/* Left Column - Manual Product Card */}
        <Card className="w-full md:w-1/2 cursor-pointer group relative rounded-[15px] hover:rounded-[25px] flex flex-col justify-between transition-all hover:shadow-lg overflow-hidden p-8">
          <Carousel>
            <CarouselContent>
              {mainProduct.images.map((img, idx) => (
                <CarouselItem
                  onClick={() => navigate(`/products/${mainProduct.handle}`)}
                  key={idx}
                  className="basis-full"
                >
                  <img
                    src={img.url}
                    alt={img.altText}
                    className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-300 ease-in-out"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <div></div>
          <div>
            <div className="flex justify-between items-center mb-2 text-xl">
              <h3 className="font-semibold">{mainProduct.title}</h3>
              <h2 className="font-medium">
                {mainProduct.variants[0]?.price.amount}
                {mainProduct.variants[0]?.price.currencyCode}
              </h2>
            </div>
            <p className="text-gray-600 text-sm line-clamp-2">
              {mainProduct.description}
            </p>
          </div>
        </Card>

        {/* Right Column - Grid of 4 ProductCards */}
        <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
          {gridProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}
