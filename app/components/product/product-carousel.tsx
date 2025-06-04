import { Product } from "@/lib/shopify/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { ProductCard } from "./product-card";
import { Spacing } from "../spacing";

export const ProductCarousel = ({
  products,
  text,
}: {
  products: Product[];
  text: string;
}) => {
  return (
    <>
      <h1 className="text-3xl">{text}</h1>
      <Spacing size={2} />
      <Carousel>
        <CarouselContent className="gap-4">
          {products.map((product: Product) => (
            <CarouselItem
              key={product.id}
              className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 "
            >
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </>
  );
};
