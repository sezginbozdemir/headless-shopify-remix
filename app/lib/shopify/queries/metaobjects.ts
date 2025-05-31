import { imageFragment } from "../fragments/image";

export const getMetaObjectsQuery = /* GraphQL */ `
  query getMetaObjects($type: String!) {
    metaobjects(type: $type, first: 250) {
      edges {
        node {
          type
          handle
          fields {
            reference {
              ... on MediaImage {
                id
                image {
                  ...image
                }
              }
            }
            key
            type
            value
          }
        }
      }
    }
  }
  ${imageFragment}
`;
