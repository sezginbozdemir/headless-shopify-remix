import {
  Collection,
  Connection,
  Product,
  ShopifyCart,
  ShopifyCollection,
  ShopifyCustomer,
  ShopifyProduct,
} from "./types";

// Calculates whether a product is on sale and the highest discount percentage among its variants
export function getSaleInfo(product: Product) {
  let maxDiscount = 0;

  // Check each variant for discount by comparing price with compareAtPrice
  const isOnSale = product.variants.some((variant) => {
    const price = Number(variant.price.amount);
    const compareAt = variant.compareAtPrice?.amount
      ? Number(variant.compareAtPrice.amount)
      : null;

    // If compareAtPrice exists and is greater than price, calculate discount
    if (compareAt !== null && compareAt > price) {
      const discount = ((compareAt - price) / compareAt) * 100;

      // Keep track of the maximum discount found
      if (discount > maxDiscount) maxDiscount = discount;
      return true;
    }

    return false;
  });

  // Return whether on sale and the rounded discount percent
  return {
    isOnSale,
    discount: isOnSale ? Math.round(maxDiscount) : 0,
  };
}

// Utility to extract an array of nodes from a GraphQL Connection object
export const removeEdgesAndNodes = <T>(array: Connection<T>): T[] => {
  return array.edges.map((edge) => edge?.node);
};

// Cleans up Shopify collections by removing edges and nodes and determining a "type" field
export const cleanCollections = (
  collections: Connection<ShopifyCollection>,
): Collection[] => {
  return removeEdgesAndNodes(collections).map((collection) => {
    if (collection.products) {
      const collectionProducts = removeEdgesAndNodes(collection.products);

      // Handles for collections to exclude when determining "type"
      const excludedHandles = ["all-products", "sale", "featured"];

      // Determine type from first product's productType unless excluded
      const type = excludedHandles.includes(collection.handle)
        ? undefined
        : collectionProducts.length > 0
        ? collectionProducts[0].productType
        : undefined;

      const { products, ...rest } = collection;

      // Return cleaned collection with type
      return {
        ...rest,
        type,
      };
    }

    // Return collection with undefined type if no products
    const { products, ...rest } = collection;
    return {
      ...rest,
      type: undefined,
    };
  });
};

// Reshape a Shopify product by cleaning up nested connections (images, variants, collections)
export const reshapeProduct = (product: ShopifyProduct) => {
  const { images, variants, collections, ...rest } = product;

  return {
    ...rest,
    images: removeEdgesAndNodes(images),
    variants: removeEdgesAndNodes(variants),
    collections: collections ? cleanCollections(collections) : [],
  };
};

// Reshape a Shopify customer by cleaning up addresses and orders connections
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

// Reshape a Shopify cart by cleaning up lines connection
export const reshapeCart = (cart: ShopifyCart) => {
  const { lines, ...rest } = cart;
  return {
    ...rest,
    lines: removeEdgesAndNodes(lines),
  };
};

// Reshape an array of Shopify products by applying reshapeProduct on each one
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
