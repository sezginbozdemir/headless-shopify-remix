import { collectionFragment } from "../fragments/collection";
import { imageFragment } from "../fragments/image";
import { productFragment } from "../fragments/product";
import { seoFragment } from "../fragments/seo";

export const getCollectionsQuery = /* GraphQL */ `
  query getCollections {
    collections(first: 250) {
      edges {
        node {
          ...collection
        }
      }
    }
  }
  ${collectionFragment}
  ${seoFragment}
  ${imageFragment}
`;

export const getCollectionProductsQuery = /* GraphQL */ `
  query getCollectionProducts(
    $handle: String!
    $sortKey: ProductCollectionSortKeys
    $filters: [ProductFilter!]
    $first: Int
    $last: Int
    $after: String
    $before: String
    $reverse: Boolean
  ) {
    collection(handle: $handle) {
      products(
        before: $before
        after: $after
        last: $last
        first: $first
        sortKey: $sortKey
        filters: $filters
        reverse: $reverse
      ) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }
        filters {
          label
          values {
            count
            input
            label
          }
        }

        edges {
          node {
            ...product
          }
        }
      }
    }
  }
  ${productFragment}
`;
