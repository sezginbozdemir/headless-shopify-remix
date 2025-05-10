import { productFragment } from "../fragments/product";

export const searchProductsQuery = /* GraphQL */ `
  query SearchProducts(
    $sortKey: SearchSortKeys
    $first: Int
    $last: Int
    $after: String
    $before: String
    $filters: [ProductFilter!]
    $query: String!
    $reverse: Boolean
  ) {
    search(
      sortKey: $sortKey
      first: $first
      last: $last
      query: $query
      after: $after
      before: $before
      types: [PRODUCT]
      productFilters: $filters
      reverse: $reverse
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
