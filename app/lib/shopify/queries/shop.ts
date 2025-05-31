import { imageFragment } from "../fragments/image";

export const getShopQuery = /* GraphQL */ `
  query getShop {
    shop {
      name
      brand {
        shortDescription
        slogan
        coverImage {
          image {
            ...image
          }
        }
        colors {
          primary {
            background
            foreground
          }
          secondary {
            background
            foreground
          }
        }
        logo {
          image {
            ...image
          }
        }
      }
      primaryDomain {
        url
      }
    }
  }
  ${imageFragment}
`;
