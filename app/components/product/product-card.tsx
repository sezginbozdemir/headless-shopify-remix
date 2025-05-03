import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Product } from "@/lib/shopify/types";

type ProductCardProps = {
  product: Product;
};

function getSaleInfo(product: Product) {
  let maxDiscount = 0;
  const isOnSale = product.variants.some((variant) => {
    const price = Number(variant.price.amount);
    const compareAt = variant.compareAtPrice?.amount
      ? Number(variant.compareAtPrice.amount)
      : null;

    if (compareAt !== null && compareAt > price) {
      const discount = ((compareAt - price) / compareAt) * 100;
      if (discount > maxDiscount) maxDiscount = discount;
      return true;
    }

    return false;
  });

  return {
    isOnSale,
    discount: isOnSale ? Math.round(maxDiscount) : 0,
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images[0]?.url;
  const price = product.variants[0]?.price.amount || 0;
  const oldPrice = product.variants[0]?.compareAtPrice?.amount;
  const isoDate = product.createdAt;
  const date = new Date(isoDate);
  const readableDate = date.toLocaleDateString();
  const { isOnSale, discount } = getSaleInfo(product);
  return (
    <Card className="rounded-[20px] h-[28rem] flex flex-col justify-between">
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
