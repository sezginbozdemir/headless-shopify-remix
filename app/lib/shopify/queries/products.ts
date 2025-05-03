import { productFragment } from "../fragments/product";

export const getProductsQuery = /* GraphQL */ `
  query AllProducts(
    $sortKey: ProductSortKeys
    $first: Int!
    $filters: String
    $after: String
  ) {
    products(sortKey: $sortKey, first: $first, query: $filters, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          ...product
        }
      }
    }
  }
  ${productFragment}
`;
