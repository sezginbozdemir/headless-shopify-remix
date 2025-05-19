import {
  Collection,
  Connection,
  Product,
  ShopifyCart,
  ShopifyCollection,
  ShopifyCustomer,
  ShopifyProduct,
} from "./types";

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

export const removeEdgesAndNodes = <T>(array: Connection<T>): T[] => {
  return array.edges.map((edge) => edge?.node);
};
export const cleanCollections = (
  collections: Connection<ShopifyCollection>
): Collection[] => {
  return removeEdgesAndNodes(collections).map((collection) => {
    if (collection.products) {
      const collectionProducts = removeEdgesAndNodes(collection.products);

      const type =
        collection.handle === "all-products"
          ? undefined
          : collection.handle === "sale"
          ? undefined
          : collectionProducts.length > 0
          ? collectionProducts[0].productType
          : undefined;

      const { products, ...rest } = collection;
      return {
        ...rest,
        type,
      };
    }

    const { products, ...rest } = collection;
    return {
      ...rest,
      type: undefined,
    };
  });
};
export const reshapeProduct = (product: ShopifyProduct) => {
  const { images, variants, collections, ...rest } = product;

  return {
    ...rest,
    images: removeEdgesAndNodes(images),
    variants: removeEdgesAndNodes(variants),
    collections: collections ? cleanCollections(collections) : [],
  };
};
export const reshapeCustomer = (customer: ShopifyCustomer) => {
  const { addresses, orders, ...rest } = customer;

  return {
    ...rest,
    addresses: removeEdgesAndNodes(addresses),
    orders: removeEdgesAndNodes(orders).map((order) => ({
      ...order,
      lineItems: removeEdgesAndNodes(order.lineItems),
    })),
  };
};
export const reshapeCart = (cart: ShopifyCart) => {
  const { lines, ...rest } = cart;
  return {
    ...rest,
    lines: removeEdgesAndNodes(lines),
  };
};

export const reshapeProducts = (products: ShopifyProduct[]) => {
  const reshapedProducts = [];

  for (const product of products) {
    if (product) {
      const reshapedProduct = reshapeProduct(product);

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }

  return reshapedProducts;
};
