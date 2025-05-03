import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { EnvVariables } from "./constants";

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
