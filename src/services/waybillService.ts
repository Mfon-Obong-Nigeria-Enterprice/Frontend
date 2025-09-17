import api from "@/services/baseApi";

// Types
export interface WaybillResponse {
  success: boolean;
  message: string;
  data?: {
    waybillNumber: string;
    transactionId: string;
  };
}

export interface WaybillError {
  message: string;
  status?: number;
}

export const generateWaybill = async (
  transactionId: string
): Promise<WaybillResponse> => {
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
};

export default {
  generateWaybill,
};
