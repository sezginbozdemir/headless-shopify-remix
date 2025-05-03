import { collectionFragment } from "../fragments/collection";
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
`;

export const getCollectionProductsQuery = /* GraphQL */ `
  query getCollectionProducts(
    $handle: String!
    $sortKey: ProductCollectionSortKeys
  ) {
    collection(handle: $handle) {
      products(first: 250, sortKey: $sortKey) {
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
