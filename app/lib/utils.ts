import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { EnvVariables } from "./constants";
import { useSearchParams, useNavigate } from "@remix-run/react";
import { ProductFilter } from "./shopify/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function isBrowser() {
  return typeof window !== "undefined";
}
export function getEnv() {
  return isBrowser() ? window.ENV : process.env;
}
const env = getEnv();
export const baseUrl = env.STORE_PRODUCTION_URL
  ? `https://${env.STORE_PRODUCTION_URL}`
  : "http://localhost:5173";

export const createUrl = (pathname: string, params: URLSearchParams) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;

  return `${pathname}${queryString}`;
};

export const validateEnvironmentVariables = () => {
  const requiredEnvironmentVariables = [
    "SHOPIFY_STORE_DOMAIN",
    "SHOPIFY_ACCESS_TOKEN",
  ];
  const missingEnvironmentVariables = [] as string[];

  requiredEnvironmentVariables.forEach((envVar) => {
    if (!(env as EnvVariables)[envVar as keyof EnvVariables]) {
      missingEnvironmentVariables.push(envVar);
    }
  });

  if (missingEnvironmentVariables.length) {
    throw new Error(
      `The following environment variables are missing. Your site will not work without them. Read more: https://vercel.com/docs/integrations/shopify#configure-environment-variables\n\n${missingEnvironmentVariables.join(
        "\n"
      )}\n`
    );
  }
};

export function useUpdateParams() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  return (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    const existingValues = params.getAll(key);

    const updatedValues = existingValues.includes(value)
      ? existingValues.filter((v) => v !== value)
      : [...existingValues, value];
    params.delete(key);
    updatedValues.forEach((v) => params.append(key, v));
    params.delete("after");
    params.delete("before");
    params.delete("page");

    navigate(`?${params.toString()}`);
  };
}
export function apiFormatter({
  priceRange,
  brands,
  inStock,
  types,
}: {
  priceRange?: number[];
  brands?: string[];
  inStock?: string;
  types?: string[];
}): string {
  const filters: string[] = [];

  if (brands?.length) {
    const brandFilter = brands.map((brand) => `vendor:'${brand}'`).join(" OR ");
    filters.push(`(${brandFilter})`);
  }

  if (types?.length) {
    const typeFilter = types
      .map((type) => `product_type:'${type}'`)
      .join(" OR ");
    filters.push(`(${typeFilter})`);
  }

  if (priceRange?.length === 2) {
    const [min, max] = priceRange;
    filters.push(`(variants.price:>=${min} AND variants.price:<=${max})`);
  }

  if (inStock === "true") {
    filters.push(`(available_for_sale:true)`);
  }

  return filters.join(" AND ");
}

export function parseFilters(url: URL, options: { [key: string]: string[] }) {
  const priceRange = url.searchParams.get("price")?.split(",").map(Number);
  const brands = url.searchParams.getAll("brand");
  const types = url.searchParams.getAll("type");
  const inStock = url.searchParams.get("stock");

  const productFilters: ProductFilter[] = [];

  if (priceRange?.length === 2) {
    productFilters.push({
      price: { min: priceRange[0], max: priceRange[1] },
    });
  }

  for (const brand of brands) {
    productFilters.push({
      productVendor: brand,
    });
  }

  for (const type of types) {
    productFilters.push({
      productType: type,
    });
  }

  if (inStock !== null) {
    productFilters.push({
      available: inStock === "true",
    });
  }

  for (const [key, values] of Object.entries(options)) {
    for (const value of values) {
      if (url.searchParams.getAll(key).includes(value)) {
        productFilters.push({
          variantOption: {
            name: key,
            value: value,
          },
        });
      }
    }
  }

  return productFilters;
}

type OptionMap = Record<string, Set<string>>;

export function extractUniqueOptions(
  products: { options: { name: string; values: string[] }[] }[]
) {
  const optionMap: OptionMap = {};

  for (const product of products) {
    for (const option of product.options) {
      if (!optionMap[option.name]) {
        optionMap[option.name] = new Set();
      }
      option.values.forEach((value) => optionMap[option.name].add(value));
    }
  }

  const result: Record<string, string[]> = {};
  for (const key in optionMap) {
    result[key] = Array.from(optionMap[key]).sort();
  }

  return result;
}
