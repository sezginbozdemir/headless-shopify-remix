import { getClient } from "../client";
import { ApiResult, Address } from "../types";
import { getSession } from "../../session.server";
import {
  createAddressMutation,
  deleteAddressMutation,
  updateAddressMutation,
  updateDefaultAddressMutation,
} from "../mutations/addresses";
import { createLogger } from "@/lib/logger";

// Initiate shopify client

const client = getClient();

// Initiate logger instance

const logger = createLogger("SHOPIFY CUSTOMER ADDRESS MODULE");

/**
 * Creates a new address for the signed-in customer.
 */
export async function createAddress(
  request: Request,
  address: Omit<Address, "id">
): Promise<ApiResult> {
  const session = await getSession(request.headers.get("Cookie"));
  const customerAccessToken = session.get("customerToken");

  try {
    logger.info("Creating customer address");
    logger.startTimer("create address");

    const response = await client.request(createAddressMutation, {
      variables: { address, customerAccessToken },
    });

    logger.endTimer("create address");

    if (!response.data) {
      logger.error("No data from createAddressMutation", response.errors);
      return { success: false, error: "Server error please try again later." };
    }

    if (!response.data.customerAddressCreate.customerAddress) {
      const errors = response.data.customerAddressCreate.customerUserErrors;
      logger.error("UserErrors in address creation", errors);
      return {
        success: false,
        error: errors[0]?.message || "An unknown error occurred",
      };
    }

    logger.info("Customer address created successfully");
    return { success: true, result: undefined };
  } catch (err) {
    logger.error("Error creating address", err!);
    return { success: false, error: "Unknown error" };
  }
}
/**
 * Updates an existing customer address by ID.
 */
export async function updateAddress(
  request: Request,
  address: Omit<Address, "id">,
  id: string
): Promise<ApiResult> {
  const session = await getSession(request.headers.get("Cookie"));
  const customerAccessToken = session.get("customerToken");

  try {
    logger.info("Updating customer address", { id });
    logger.startTimer("update address");

    const response = await client.request(updateAddressMutation, {
      variables: { address, customerAccessToken, id },
    });

    logger.endTimer("update address");

    if (!response.data) {
      logger.error("No data from updateAddressMutation", response.errors);
      return { success: false, error: "Server error please try again later." };
    }

    if (!response.data.customerAddressUpdate.customerAddress) {
      const errors = response.data.customerAddressUpdate.customerUserErrors;
      logger.error("UserErrors in address update", errors);
      return {
        success: false,
        error: errors[0]?.message || "An unknown error occurred",
      };
    }

    logger.info("Customer address updated successfully");
    return { success: true, result: undefined };
  } catch (err) {
    logger.error("Error updating address", err!);
    return { success: false, error: "Unknown error" };
  }
}

/**
 * Deletes a customer address by ID.
 */
export async function deleteAddress(
  request: Request,
  id: string
): Promise<ApiResult> {
  const session = await getSession(request.headers.get("Cookie"));
  const customerAccessToken = session.get("customerToken");

  try {
    logger.info("Deleting customer address", { id });
    logger.startTimer("delete address");

    const response = await client.request(deleteAddressMutation, {
      variables: { customerAccessToken, id },
    });

    logger.endTimer("delete address");

    if (!response.data) {
      logger.error("No data from deleteAddressMutation", response.errors);
      return { success: false, error: "Server error please try again later." };
    }

    if (!response.data.customerAddressDelete.deletedCustomerAddressId) {
      const errors = response.data.customerAddressDelete.customerUserErrors;
      logger.error("UserErrors in address deletion", errors);
      return {
        success: false,
        error: errors[0]?.message || "An unknown error occurred",
      };
    }

    logger.info("Customer address deleted successfully");
    return { success: true, result: undefined };
  } catch (err) {
    logger.error("Error deleting address", err!);
    return { success: false, error: "Unknown error" };
  }
}

/**
 * Sets a specific address as the default for the customer.
 */
export async function updateDefaultAddress(
  request: Request,
  id: string
): Promise<ApiResult> {
  const session = await getSession(request.headers.get("Cookie"));
  const customerAccessToken = session.get("customerToken");

  try {
    logger.info("Updating default customer address", { id });
    logger.startTimer("update default address");

    const response = await client.request(updateDefaultAddressMutation, {
      variables: { customerAccessToken, addressId: id },
    });

    logger.endTimer("update default address");

    if (!response.data) {
      logger.error(
        "No data from updateDefaultAddressMutation",
        response.errors
      );
      return { success: false, error: "Server error please try again later." };
    }

    if (!response.data.customerDefaultAddressUpdate.customer) {
      const errors =
        response.data.customerDefaultAddressUpdate.customerUserErrors;
      logger.error("UserErrors in default address update", errors);
      return {
        success: false,
        error: errors[0]?.message || "An unknown error occurred",
      };
    }

    logger.info("Default address updated successfully");
    return { success: true, result: undefined };
  } catch (err) {
    logger.error("Error updating default address", err!);
    return { success: false, error: "Unknown error" };
  }
}
