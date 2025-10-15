// import api from "@/services/baseApi";
// import type { AxiosError } from "axios";

// // Types
// export interface WaybillResponse {
//   success: boolean;
//   message: string;
//   data?: {
//     waybillNumber: string;
//     transactionId: string;
//   };
// }

// export interface WaybillError {
//   message: string;
//   status?: number;
// }

// export interface WaybillGenerationResponse {
//   waybillNumber: string;
// }

// // Generate waybill number without assigning to transaction
// export const generateWaybillNumber =
//   async (): Promise<WaybillGenerationResponse> => {
//     try {
//       const response = await api.get("/transactions/generate-waybill-number");
//       return response.data;
//     } catch (error) {
//       const err = error as AxiosError;
//       throw {
//         message: "Failed to generate waybill number",
//         status: err.response?.status,
//       } as WaybillError;
//     }
//   };

// // Assign waybill to transaction
// export const assignWaybillToTransaction = async (
//   transactionId: string,
//   waybillNumber: string
// ): Promise<WaybillResponse> => {
//   try {
//     const response = await api.patch(
//       `/transactions/${transactionId}/assign-waybill`,
//       {
//         waybillNumber,
//       }
//     );

//     return {
//       success: true,
//       message: "Waybill assigned successfully",
//       data: response.data,
//     };
//   } catch (error) {
//     const err = error as AxiosError;
//     throw {
//       message: "Failed to assign waybill ",
//       status: err.response?.status,
//     } as WaybillError;
//   }
// };

// // Legacy function for backward compatibility
// export const generateWaybill = async (
//   transactionId: string
// ): Promise<WaybillResponse> => {
//   try {
//     const response = await api.patch(`/transactions/${transactionId}/waybill`, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     return {
//       success: true,
//       message: "Waybill generated successfully",
//       data: response.data,
//     };
//   } catch (error) {
//     const err = error as AxiosError;
//     throw {
//       message: "Failed to generate waybill number",
//       status: err.response?.status,
//     } as WaybillError;
//   }
// };

// export default {
//   generateWaybillNumber,
//   assignWaybillToTransaction,
//   generateWaybill,
// };

import api from "@/services/baseApi";
import type { AxiosError } from "axios";

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

// Assign waybill to transaction (main function)
export const assignWaybillToTransaction = async (
  transactionId: string,
  waybillNumber: string
): Promise<WaybillResponse> => {
  try {
    const response = await api.patch(
      `/transactions/${transactionId}/assign-waybill`,
      {
        waybillNumber,
      }
    );

    return {
      success: true,
      message: "Waybill assigned successfully",
      data: response.data,
    };
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    throw {
      message: err.response?.data?.message || "Failed to assign waybill",
      status: err.response?.status,
    } as WaybillError;
  }
};

export default {
  assignWaybillToTransaction,
};
