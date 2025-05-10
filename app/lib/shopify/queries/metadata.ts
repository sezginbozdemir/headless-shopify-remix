export const getProductMetaQuery = /* GraphQL */ `
  query AllOptions($after: String) {
    products(first: 250, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          productType
          vendor
          options {
            name
            values
          }
        }
      }
    }
  }
`;
