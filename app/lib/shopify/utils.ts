import { Product } from "./types";

export function getSaleInfo(product: Product) {
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
