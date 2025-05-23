import { productFragment } from "../fragments/product";

export const getProductsQuery = /* GraphQL */ `
  query AllProducts(
    $sortKey: ProductSortKeys
    $first: Int
    $last: Int
    $query: String
    $after: String
    $before: String
    $reverse: Boolean
  ) {
    products(
      reverse: $reverse
      sortKey: $sortKey
      first: $first
      last: $last
      query: $query
      after: $after
      before: $before
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
        startCursor
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
