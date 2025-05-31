import { productFragment } from "../fragments/product";

export const getProductQuery = /* GraphQL */ `
  query GetProduct($handle: String!) {
    product(handle: $handle) {
      ...product
    }
  }
  ${productFragment}
`;
