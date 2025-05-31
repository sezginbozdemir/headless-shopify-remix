import { Link } from "@remix-run/react";
import { Product } from "@/lib/shopify/types";
import { Separator } from "@/components/ui/separator";
import { Spacing } from "@/components/spacing";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { AddToCart } from "@/components/cart/actions/add-to-cart";
import { QuantitySelector } from "@/components/product/quantity-selector";

export default function ProductDetail({ product }: { product: Product }) {
  const variant = product.variants?.[0];
  const collectionInfo = product.collections
    .filter((c) => c.type !== undefined)
    .map((c) => ({
      title: c.title,
      handle: c.handle,
    }));

  const [selectedOptions, setSelectedOptions] = useState<
    { name: string; value: string }[]
  >(variant?.selectedOptions ?? []);

  const [quantity, setQuantity] = useState(1);

  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [displayImages, setDisplayImages] = useState(product.images);

  const increase = () => setQuantity((q) => q + 1);
  const decrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((prev) => {
      const existingIndex = prev.findIndex((opt) => opt.name === optionName);
      if (existingIndex >= 0) {
        const newOptions = [...prev];
        newOptions[existingIndex] = { name: optionName, value };
        return newOptions;
      } else {
        return [...prev, { name: optionName, value }];
      }
    });
  };

  const isOptionSelected = (optionName: string, value: string) =>
    selectedOptions.some(
      (opt) => opt.name === optionName && opt.value === value
    );
  const selectedVariant = product.variants.find((variant) => {
    return variant.selectedOptions.every((option) =>
      selectedOptions.some(
        (sel) => sel.name === option.name && sel.value === option.value
      )
    );
  });

  useEffect(() => {
    if (!selectedVariant?.image?.url) return;

    const updatedImages = [
      selectedVariant.image,
      ...product.images.filter((img) => img.url !== selectedVariant.image?.url),
    ];
    setDisplayImages(updatedImages);

    imageContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedVariant, product.images]);

  return (
    <div className="flex gap-8 relative">
      <div ref={imageContainerRef} className="flex flex-col gap-5 flex-1">
        {displayImages.map((img, idx) => (
          <img
            key={idx}
            src={img.url}
            alt={img.altText}
            className="w-full h-[600px] rounded-xl object-contain border shadow-sm"
          />
        ))}
      </div>

      <div className="w-[50%] sticky top-10 self-start">
        <div className="flex justify-between items-center">
          {collectionInfo.length > 0 && (
            <p className="text-gray-500 text-md uppercase hover:opacity-[0.8]">
              <Link to={`/products?collection=${collectionInfo[0].handle}`}>
                {collectionInfo[0].title}
              </Link>
            </p>
          )}

          {selectedVariant?.quantityAvailable !== undefined && (
            <p className="mt-2 text-sm text-green-600">
              {selectedVariant.quantityAvailable > 0
                ? `In stock: ${selectedVariant.quantityAvailable}`
                : "Out of stock"}
            </p>
          )}
        </div>
        <h1 className="text-5xl font-medium">{product.title}</h1>
        <p className="text-gray-500 mt-1">by {product.vendor}</p>

        <p className="text-3xl font-medium mt-4 font-heading">
          {selectedVariant?.price.amount} {selectedVariant?.price.currencyCode}
        </p>
        <Spacing size={2} />
        <Separator />

        <div className="mt-6 space-y-6">
          {product.options.map((option) => (
            <fieldset key={option.name}>
              <legend className="text-lg font-semibold mb-2">
                {option.name}
              </legend>
              <div className="flex flex-wrap gap-4">
                {option.values.map((value) => {
                  const selected = isOptionSelected(option.name, value);
                  return (
                    <Badge
                      key={value}
                      onClick={() => handleOptionChange(option.name, value)}
                      className={`cursor-pointer transition-all ${
                        selected
                          ? "bg-black text-white border-black"
                          : "bg-gray-100 text-gray-800 border-gray-300"
                      }`}
                      variant={selected ? "default" : "outline"}
                    >
                      {value}
                    </Badge>
                  );
                })}{" "}
              </div>
              <Spacing size={2} />
              <Separator />
            </fieldset>
          ))}
        </div>
        <p className="mt-6 text-gray-700 text-xl font-[400]">
          {product.description}
        </p>
        <Spacing size={2} />
        <Separator />

        <div className="mt-6 flex justify-between items-center gap-3">
          <QuantitySelector
            quantity={quantity}
            onIncrease={increase}
            onDecrease={decrease}
          />

          <div className="flex-1">
            <AddToCart quantity={quantity} selectedVariant={selectedVariant} />
          </div>
        </div>
      </div>
    </div>
  );
}
