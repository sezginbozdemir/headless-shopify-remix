import { Metaobject } from "@/lib/shopify/types";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../ui/carousel";
import { Button } from "../ui/button";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";
import { Link } from "@remix-run/react";

interface Props {
  metaobjects: Metaobject[];
}

export function HeroCarousel({ metaobjects }: Props) {
  const [api, setApi] = useState<CarouselApi>();
  const [slideCount, setSlideCount] = useState<number>(0);
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setSlideCount(api.scrollSnapList().length);
    setCurrentSlide(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrentSlide(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="relative">
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        plugins={[Autoplay({ delay: 4000 })]}
      >
        <CarouselContent className="h-[600px] md:h-[500px] ">
          {metaobjects.map((metaobject) => {
            const imageField = metaobject.fields.find((f) => f.key === "image");
            const titleField = metaobject.fields.find((f) => f.key === "title");

            const imageUrl = imageField?.reference?.image?.url;
            const title = titleField?.value;

            return (
              <CarouselItem
                key={metaobject.handle}
                className="basis-full w-full h-full"
              >
                <div className="relative w-full h-full overflow-hidden rounded-xl flex">
                  <img
                    src={imageUrl}
                    alt={title || "Banner Image"}
                    className="absolute inset-0 w-full h-full object-cover object-center z-0"
                  />

                  {/* Text content in normal flow */}
                  <div className="z-10 w-full md:w-1/2 h-full flex flex-col items-start justify-center p-20 gap-8">
                    <h1 className="text-6xl bg-black/1 backdrop-blur-xs rounded-xl">
                      {title}
                    </h1>
                    <div className="flex gap-5 justify-between">
                      <Link to="products">
                        <Button className="text-white h-11">Shop now</Button>
                      </Link>
                      <Link to="/collections">
                        <Button className="text-white h-11">
                          View Collections
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3 bg-white rounded-2xl p-2">
          {Array.from({ length: slideCount }).map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`h-4 rounded-full transition-all ${
                index === currentSlide ? "bg-black w-6" : "w-4 bg-gray-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
}
