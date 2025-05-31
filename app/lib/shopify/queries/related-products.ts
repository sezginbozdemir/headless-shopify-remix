import { productFragment } from "../fragments/product";

export const getRelatedProductsQuery = /* GraphQL */ `
  query RelatedProducts($handle: String!) {
    productRecommendations(productHandle: $handle, intent: RELATED) {
      ...product
    }
  }
  ${productFragment}
`;
