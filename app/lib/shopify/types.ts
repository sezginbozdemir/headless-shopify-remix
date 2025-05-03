export type Connection<T> = {
  edges: Array<Edge<T>>;
};

export type Edge<T> = {
  node: T;
};

export type Image = {
  altText: string;
  url: string;
  src: string;
};

export type Collection = {
  title: string;
  id: string;
  handle: string;
  description: string;
  seo: SEO;
};

export type ProductOptions = {
  name: string;
  values: string[];
};

export type Money = {
  amount: string;
  currencyCode: string;
};

export type ProductVariant = {
  id: string;
  title: string;
  quantityAvailable: number;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  image: Image;
  price: Money;
  compareAtPrice: Money;
};

export type SEO = {
  title: string;
  description: string;
};

export type Product = Omit<
  ShopifyProduct,
  "variants" | "images" | "collections"
> & {
  variants: ProductVariant[];
  images: Image[];
  collections: Collection[];
};

export type ShopifyProduct = {
  id: string;
  title: string;
  vendor: string;
  totalInventory: number;
  availableForSale: boolean;
  description: string;
  descriptionHtml: string;
  createdAt: string;
  productType: string;
  options: ProductOptions[];
  images: Connection<Image>;
  collections: Connection<Collection>;
  variants: Connection<ProductVariant>;
  featuredImage: Image;
};

export type Menu = {
  title: string;
  path: string;
};
export type ShopifyCart = {
  id: string | undefined;
  checkoutUrl: string;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money;
  };
  lines: Connection<CartItem>;
  totalQuantity: number;
};

export type CartItem = {
  id: string | undefined;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: {
      name: string;
      value: string;
    }[];
    product: CartProduct;
  };
};

export type CartProduct = {
  id: string;
  handle: string;
  title: string;
  featuredImage: Image;
};
export type Page = {
  id: string;
  title: string;
  handle: string;
  body: string;
  bodySummary: string;
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
};
