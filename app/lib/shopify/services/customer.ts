import { getClient } from "../client";
import {
  CustomerCreateResponse,
  CustomerFormData,
  Customer,
  AccessTokenFormData,
  AccessTokenResponse,
  ShopifyCustomer,
  ApiResult,
} from "../types";
import {
  createAccessTokenMutation,
  createCustomerMutation,
  customerRecoverMutation,
} from "../mutations/customer";
import { ClientResponse } from "@shopify/storefront-api-client";
import { getCustomerQuery } from "../queries/customer";
import { commitSession, getSession } from "../../session.server";
import { reshapeCustomer } from "../utils";
import { createLogger } from "@/lib/logger";

// Initiate shopify client

const client = getClient();

// Initiate logger instance

const logger = createLogger("SHOPIFY CUSTOMER MODULE");

/**
 * Sends a recovery email to the customer for resetting their password.
 */
export async function recoverCustomer(email: string): Promise<ApiResult> {
  try {
    logger.info("Attempting to recover customer", { email });
    logger.startTimer("recover customer");

    const response = await client.request(customerRecoverMutation, {
      variables: { email },
    });

    logger.endTimer("recover customer");

    if (!response.data) {
      logger.error(
        "No data returned from customerRecoverMutation",
        response.errors,
      );
      return { success: false, error: "Server error please try again later." };
    }

    if (response.data.customerRecover.customerUserErrors?.length) {
      const errors = response.data.customerRecover.customerUserErrors;
      logger.error("UserErrors in customerRecover", errors);
      return {
        success: false,
        error:
          `userErrors:${errors[0]?.message}` ||
          "userErrors:An unknown error occurred",
      };
    }

    logger.info("Customer recovery email sent successfully");
    return { success: true, result: undefined };
  } catch (err) {
    logger.error("Error in recoverCustomer", err!);
    return { success: false, error: "Unknown error" };
  }
}

/**
 * Creates a new Shopify customer account.
 */
export async function createCustomer(
  customerData: CustomerFormData,
): Promise<ApiResult> {
  try {
    logger.info("Creating new customer", { email: customerData.email });
    logger.startTimer("create customer");

    const response: ClientResponse<CustomerCreateResponse> =
      await client.request(createCustomerMutation, {
        variables: { input: { ...customerData } },
      });

    logger.endTimer("create customer");

    if (!response.data) {
      logger.error(
        "No data returned from customerCreateMutation",
        response.errors,
      );
      return { success: false, error: "Server error please try again later." };
    }

    if (!response.data.customerCreate.customer) {
      const errors = response.data.customerCreate.customerUserErrors;
      logger.error("UserErrors in customerCreate", errors);
      return {
        success: false,
        error:
          `userErrors:${errors[0]?.message}` ||
          "userErrors:An unknown error occurred",
      };
    }

    logger.info("Customer account created successfully.");
    return { success: true, result: undefined };
  } catch (err) {
    logger.error("Error creating customer", err!);
    return { success: false, error: "Unknown error" };
  }
}

/**
 * Creates a customer access token (login) and stores it in session cookies.
 */
export async function createAccessToken(
  tokenData: AccessTokenFormData,
): Promise<ApiResult<Headers>> {
  const session = await getSession();

  try {
    logger.info("Creating customer access token", { email: tokenData.email });
    logger.startTimer("create access token");

    const response: ClientResponse<AccessTokenResponse> = await client.request(
      createAccessTokenMutation,
      {
        variables: {
          input: {
            email: tokenData.email,
            password: tokenData.password,
          },
        },
      },
    );

    logger.endTimer("create access token");

    if (!response.data) {
      logger.error(
        "No data returned from createAccessTokenMutation",
        response.errors,
      );
      return { success: false, error: "Server error please try again later." };
    }

    if (!response.data.customerAccessTokenCreate.customerAccessToken) {
      const errors = response.data.customerAccessTokenCreate.customerUserErrors;
      logger.error("UserErrors in access token creation", errors);
      return {
        success: false,
        error:
          `userErrors:${errors[0]?.message}` ||
          "userErrors:An unknown error occurred",
      };
    }

    const accessToken =
      response.data.customerAccessTokenCreate.customerAccessToken.accessToken;

    session.set("customerToken", accessToken);

    const headers = new Headers();
    headers.append("Set-Cookie", await commitSession(session));

    logger.info("Access token created and stored in session");
    return { result: headers, success: true };
  } catch (err) {
    logger.error("Error creating access token", err!);
    return { success: false, error: "Unknown error" };
  }
}

/**
 * Retrieves customer information using the access token stored in the session.
 */
export async function getCustomerInfo(
  request: Request,
): Promise<ApiResult<Customer>> {
  const session = await getSession(request.headers.get("Cookie"));
  const accessToken = session.get("customerToken");

  if (!accessToken) {
    logger.warn("No customer access token found in session.");
    return {
      success: false,
      error: "getCustomerInfo: User is not a signed customer",
    };
  }

  try {
    logger.info("Fetching customer info");
    logger.startTimer("get customer");

    const response: ClientResponse<{ customer: ShopifyCustomer }> =
      await client.request(getCustomerQuery, {
        variables: { accessToken },
      });

    logger.endTimer("get customer");

    if (!response.data) {
      logger.error("No data returned from getCustomerQuery", response.errors);
      return { success: false, error: "getCustomerInfo: Server error" };
    }

    const customer = reshapeCustomer(response.data.customer);
    logger.info("Customer info fetched successfully");
    logger.debug("Customer ID:", { customerId: customer.id });

    return { success: true, result: customer };
  } catch (err) {
    logger.error("Error fetching customer info", err!);
    return { success: false, error: "getCustomerInfo: Unknown Error" };
  }
}
