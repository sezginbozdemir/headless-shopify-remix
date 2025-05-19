export type Connection<T> = {
  edges: Array<Edge<T>>;
};

export type Edge<T> = {
  node: T;
};

export type Image = {
  altText: string;
  url: string;
};

export type ShopifyCollection = {
  title: string;
  id: string;
  handle: string;
  description: string;
  seo: SEO;
  products: Connection<{ productType: string }>;
  image: Image | null;
};

export type Collection = {
  title: string;
  id: string;
  handle: string;
  description: string;
  seo: SEO;
  type: string | undefined;
  image: Image | null;
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
  collections: Connection<ShopifyCollection>;
  variants: Connection<ProductVariant>;
  featuredImage: Image;
};
export type ShopifyFilter = {
  label: string;
  values: {
    count: number;
    input: string;
    label: string;
  }[];
};
export type ProductsResult = {
  count?: number;
  products: Product[];
  next: boolean;
  prev: boolean;
  end: string | null;
  start: string | null;
  filters?: ShopifyFilter[];
};
export type ProductsMeta = {
  brands: string[];
  types: string[];
  options: Record<string, string[]>;
};

export type ApiResult<T = undefined> =
  | { success: true; result: T }
  | { success: false; error: string };

export type ProductFilter =
  | { available: boolean }
  | { price: { min?: number; max?: number } }
  | { productType: string }
  | { productVendor: string }
  | { tag: string }
  | {
      productMetafield: {
        namespace: string;
        key: string;
        value: string;
      };
    }
  | {
      variantMetafield: {
        namespace: string;
        key: string;
        value: string;
      };
    }
  | {
      variantOption: {
        name: string;
        value: string;
      };
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

export type Cart = Omit<ShopifyCart, "lines"> & {
  lines: CartItem[];
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
export type CustomerFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  acceptsMarketing: boolean;
};

export type CustomerCreateResponse = {
  customerCreate: {
    customer: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      acceptsMarketing: boolean;
    } | null;
    customerUserErrors: Array<{
      field: string[];
      message: string;
      code: string;
    }>;
  };
};

export type AccessTokenFormData = {
  email: string;
  password: string;
};

export type AccessTokenResponse = {
  customerAccessTokenCreate: {
    customerAccessToken: {
      accessToken: string;
      expiresAt: string;
    };
    userErrors: {
      field: string[];
      message: string;
    }[];
  };
};
export type Address = {
  address1: string;
  address2: string;
  city: string;
  country: string;
  id: string;
};
type OrderLineItems = {
  title: string;
  currentQuantity: number;
  discountedTotalPrice: Money;
  variant: ProductVariant;
};

type ShopifyOrder = {
  currentSubtotalPrice: Money;
  currentTotalPrice: Money;
  currentTotalShippingPrice: Money;
  currentTotalTax: Money;
  customerUrl: string;
  financialStatus: string;
  orderNumber: string;
  lineItems: Connection<OrderLineItems>;
  processedAt: Date;
};
export type Order = Omit<ShopifyOrder, "lineItems"> & {
  lineItems: OrderLineItems[];
};

export type ShopifyCustomer = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  addresses: Connection<Address>;
  defaultAddress: Address | null;
  orders: Connection<ShopifyOrder>;
};
export type ShopInfo = {
  name: string;
  brand: {
    colors: {
      primary: {
        background: string;
        foreground: string;
      }[];
      secondary: {
        background: string;
        foreground: string;
      }[];
    };
    logo: {
      image: Image;
    };
  };
  primaryDomain: {
    url: string;
  };
};

export type Customer = Omit<ShopifyCustomer, "addresses" | "orders"> & {
  addresses: Address[] | [];
  orders: Order[] | [];
};
