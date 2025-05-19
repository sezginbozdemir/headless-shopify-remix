export const collectionFragment = /* GraphQL */ `
  fragment collection on Collection {
    id
    handle
    title
    description
    image {
      ...image
    }
    products(first: 1) {
      edges {
        node {
          productType
        }
      }
    }
    seo {
      ...seo
    }
  }
`;
