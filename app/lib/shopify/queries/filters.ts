export const getFiltersQuery = /* GraphQL */ `
  query getFilters($handle: String!) {
    collection(handle: $handle) {
      products(first: 1) {
        filters {
          label
          values {
            count
            input
            label
          }
        }
      }
    }
  }
`;
