import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { EnvVariables } from "./constants";
import { useSearchParams, useNavigate, useLocation } from "@remix-run/react";
import { ProductFilter, ShopifyFilter } from "./shopify/types";
import { createLogger } from "./logger";

const logger = createLogger("UTILS");

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility to check if code is running in hte browser

export function isBrowser() {
  return typeof window !== "undefined";
}

// Returns env variables from server or browser

export function getEnv() {
  return isBrowser() ? window.ENV : process.env;
}

// Initialize env variables
const env = getEnv();

// Base URL depending on working environment

export const baseUrl = env.STORE_PRODUCTION_URL
  ? `https://${env.STORE_PRODUCTION_URL}`
  : "http://localhost:5173";

// Create url from pathname and query parameters

export const createUrl = (pathname: string, params: URLSearchParams) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;

  return `${pathname}${queryString}`;
};

// Validates required env variables and throws error if there are any missing

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

// Hook to update filter parameters while preserving others, also removes pagination related paramaters

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

/**
 * @deprecated This function is no longer used since we switched from
 * using the `query` argument to the `filters` argument in the Shopify collection GraphQL queries.
 *
 * Formats filters into a Shopify-compatible query string for legacy usage.
 */
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

// Parse product filters from search parameters into a shopify compatible array

export function parseFilters(
  params: URLSearchParams,
  filters: ShopifyFilter[]
) {
  const productFilters: ProductFilter[] = [];

  for (const filter of filters) {
    const paramKey = filter.label;
    if (paramKey === "Price") {
      const priceParam = params.get("price");
      if (priceParam) {
        const [minStr, maxStr] = priceParam.split(",");
        const min = parseFloat(minStr);
        const max = parseFloat(maxStr);

        if (!isNaN(min) && !isNaN(max)) {
          productFilters.push({
            price: {
              min,
              max,
            },
          });
        }
      }
      continue;
    }
    const paramValues = params.getAll(paramKey);

    for (const value of filter.values) {
      if (paramValues.includes(value.label)) {
        try {
          const parsed = JSON.parse(value.input);
          productFilters.push(parsed);
        } catch (error) {
          logger.error(`Invalid JSON in filter input: ${value.input}`);
        }
      }
    }
  }

  return productFilters;
}

/**
 * Returns a breadcrumb-style string based on the current URL path.
 * e.g. `/products/:product` -> "Home / Products / ${product}"
 */

export function useBreadcrumb() {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  return ["Home", ...segments]
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" / ");
}
