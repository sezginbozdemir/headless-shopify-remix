import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Product } from "@/lib/shopify/types";
import { getSaleInfo } from "@/lib/shopify/utils";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images[0]?.url;
  const price = product.variants[0]?.price.amount || 0;
  const oldPrice = product.variants[0]?.compareAtPrice?.amount;
  const isoDate = product.createdAt;
  const date = new Date(isoDate);
  const readableDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const { isOnSale, discount } = getSaleInfo(product);
  return (
    <Card className="rounded-[20px] h-[25rem] flex flex-col justify-center">
      <CardHeader className="overflow-hidden p-[3rem]">
        <img
          src={primaryImage}
          alt={product.title}
          className="w-full h-full object-contain mb-4"
        />
      </CardHeader>
      <CardContent className="">
        <p className="text-sm text-gray-600">{product.vendor}</p>
        <h2 className="text-xl font-bold">{product.title}</h2>
        <div className="flex gap-[1rem] ">
          <p className="text-lg font-semibold text-red-500">${price}</p>
          {oldPrice && (
            <p className="text-lg font-semibold line-through">${oldPrice}</p>
          )}
          <p className="text-lg font-light">{readableDate}</p>
        </div>
        {isOnSale && (
          <p className="text-xs text-green-600 mt-1 font-medium">
            On Sale! {discount}% off
          </p>
        )}
      </CardContent>
    </Card>
  );
}
