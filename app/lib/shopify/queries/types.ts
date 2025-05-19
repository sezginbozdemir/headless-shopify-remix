export const getTypesQuery = /* GraphQL */ `
  query getTypes {
    productTypes(first: 250) {
      edges {
        node
      }
    }
  }
`;
