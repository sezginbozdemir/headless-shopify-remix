import { imageFragment } from "../fragments/image";

export const getCustomerQuery = /* GraphQL */ `
  query CustomerQuery($accessToken: String!) {
    customer(customerAccessToken: $accessToken) {
      id
      email
      firstName
      lastName
      defaultAddress {
        address1
        address2
        city
        country
        id
      }
      addresses(first: 250) {
        edges {
          node {
            address1
            address2
            city
            country
            id
          }
        }
      }
      orders(first: 250) {
        edges {
          node {
            currentSubtotalPrice {
              amount
              currencyCode
            }
            currentTotalPrice {
              amount
              currencyCode
            }
            currentTotalShippingPrice {
              amount
              currencyCode
            }
            currentTotalTax {
              amount
              currencyCode
            }
            customerUrl
            financialStatus
            orderNumber
            processedAt
            lineItems(first: 250) {
              edges {
                node {
                  title
                  currentQuantity
                  discountedTotalPrice {
                    amount
                    currencyCode
                  }
                  variant {
                    id
                    title
                    quantityAvailable
                    selectedOptions {
                      name
                      value
                    }
                    price {
                      amount
                      currencyCode
                    }
                    compareAtPrice {
                      amount
                      currencyCode
                    }

                    image {
                      ...image
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  ${imageFragment}
`;
