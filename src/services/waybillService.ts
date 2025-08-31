import api from "@/services/baseApi";

// Types
export interface WaybillResponse {
  success: boolean;
  message: string;
  data?: {
    waybillNumber: string;
    transactionId: string;
    // Add other properties that your API returns
  };
}

export interface WaybillError {
  message: string;
  status?: number;
}

/**
 * Generate waybill for a transaction
 * @param transactionId - The ID of the transaction to generate waybill for
 * @returns Promise<WaybillResponse>
 */
export const generateWaybill = async (
  transactionId: string
): Promise<WaybillResponse> => {
  try {
    const response = await api.patch(`/transactions/${transactionId}/waybill`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return {
      success: true,
      message: "Waybill generated successfully",
      data: response.data,
    };
  } catch (error: any) {
    // Handle different types of errors
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to generate waybill";

    const errorStatus = error.response?.status;

    throw {
      message: errorMessage,
      status: errorStatus,
    } as WaybillError;
  }
};

export default {
  generateWaybill,
};
