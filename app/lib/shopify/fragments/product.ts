import { imageFragment } from "./image";
import { seoFragment } from "./seo";
import { collectionFragment } from "./collection";

export const productFragment = /* GraphQL */ `
  fragment product on Product {
    id
    handle
    title
    vendor
    totalInventory
    availableForSale
    description
    descriptionHtml
    createdAt
    productType
    options {
      name
      values
    }
    variants(first: 250) {
      edges {
        node {
          id
          quantityAvailable
          title
          selectedOptions {
            name
            value
          }
          image {
            ...image
          }

          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
        }
      }
    }

    images(first: 10) {
      edges {
        node {
          ...image
        }
      }
    }
    collections(first: 10) {
      edges {
        node {
          ...collection
        }
      }
    }
    featuredImage {
      ...image
    }
    seo {
      ...seo
    }
  }
  ${imageFragment}
  ${seoFragment}
  ${collectionFragment}
`;
