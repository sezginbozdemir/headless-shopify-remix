import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Product } from "@/lib/shopify/types";
import { getSaleInfo } from "@/lib/shopify/utils";
import { AddToCart } from "../cart/actions/add-to-cart";
import { Badge } from "../ui/badge";
import { useNavigate } from "@remix-run/react";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.featuredImage.url;
  const price = product.variants[0]?.price.amount || 0;
  const oldPrice = product.variants[0]?.compareAtPrice?.amount;
  const createdAt = new Date(product.createdAt);
  const now = new Date();
  const fourteenDaysAgo = new Date(now);
  fourteenDaysAgo.setDate(now.getDate() - 14);

  const isNew = createdAt > fourteenDaysAgo;
  const { isOnSale, discount } = getSaleInfo(product);

  const navigate = useNavigate();
  const variant =
    product.variants.length === 1 ? product.variants[0] : undefined;
  return (
    <Card
      onClick={() => navigate(`/products/${product.handle}`)}
      className="cursor-pointer group relative rounded-[15px] hover:rounded-[25px] w-full  h-[30rem] flex flex-col justify-between transition-all hover:shadow-lg"
    >
      <div className="p-5 flex items-center gap-2">
        {isOnSale && <Badge className="w-[80px] h-[40px]">{discount}%</Badge>}
        {isNew && <Badge className="w-[80px] h-[40px]">NEW</Badge>}
      </div>
      <CardHeader className="overflow-hidden p-[1rem] h-[20rem]">
        <img
          src={primaryImage}
          alt={product.title}
          className="w-full h-full  object-contain mb-4 transition-transform duration-300 ease-in-out group-hover:scale-105"
        />
      </CardHeader>
      <div className="w-[180px] self-center m-5 transition-all invisible group-hover:visible group-hover:animate-in group-hover:slide-in-from-bottom">
        <AddToCart quantity={1} selectedVariant={variant} />
      </div>

      <CardContent className="flex flex-col justify-between gap-3">
        <p className="text-sm uppercase text-gray-600">{product.vendor}</p>
        <h2 className="text-2xl font-[400]">{product.title}</h2>
        <div className="flex gap-[1rem] ">
          <p className="text-xl font-[400] font-heading">${price}</p>
          {oldPrice && (
            <p className="text-xl font-[400] font-heading line-through text-gray-600">
              ${oldPrice}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
