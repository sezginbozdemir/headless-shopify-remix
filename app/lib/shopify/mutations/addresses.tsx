export const createAddressMutation = /* GraphQL */ `
  mutation customerAddressCreate(
    $address: MailingAddressInput!
    $customerAccessToken: String!
  ) {
    customerAddressCreate(
      address: $address
      customerAccessToken: $customerAccessToken
    ) {
      customerAddress {
        address1
        address2
        city
        country
      }

      customerUserErrors {
        field
        message
      }
    }
  }
`;
export const updateAddressMutation = /* GraphQL */ `
  mutation customerAddressUpdate(
    $address: MailingAddressInput!
    $customerAccessToken: String!
    $id: ID!
  ) {
    customerAddressUpdate(
      address: $address
      customerAccessToken: $customerAccessToken
      id: $id
    ) {
      customerAddress {
        address1
        address2
        city
        country
      }
      customerUserErrors {
        field
        message
      }
    }
  }
`;
export const deleteAddressMutation = /* GraphQL */ `
  mutation customerAddressDelete($customerAccessToken: String!, $id: ID!) {
    customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
      customerUserErrors {
        field
        message
      }
      deletedCustomerAddressId
    }
  }
`;

export const updateDefaultAddressMutation = /* GraphQL */ `
  mutation customerDefaultAddressUpdate(
    $addressId: ID!
    $customerAccessToken: String!
  ) {
    customerDefaultAddressUpdate(
      addressId: $addressId
      customerAccessToken: $customerAccessToken
    ) {
      customer {
        firstName
        lastName
        email
        phone
        acceptsMarketing
      }
      customerUserErrors {
        field
        message
      }
    }
  }
`;
