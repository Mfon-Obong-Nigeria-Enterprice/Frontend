import api from "./baseApi";
import { type AxiosError } from "axios";
import {
  basicHealthResponseSchema,
  detailedHealthResponseSchema,
  type BasicHealthResponse,
  type DetailedHealthResponse,
} from "@/schemas/SystemHealthSchemas";

export const HealthService = {
  getHealthCheck: async (): Promise<BasicHealthResponse> => {
    try {
      const response = await api.get("/health");
      const validatedData = basicHealthResponseSchema.parse(response.data);
      return validatedData;
    } catch (error) {
      const err = error as AxiosError;
      console.error("Error fetching basic health:", err.response?.data || err.message);
      throw error;
    }
  },

  getDetailedHealth: async (): Promise<DetailedHealthResponse> => {
    try {
      const response = await api.get("/health/detailed");
      const validatedData = detailedHealthResponseSchema.parse(response.data);
      return validatedData;
    } catch (error) {
      const err = error as AxiosError;
      console.error("Error fetching detailed health:", err.response?.data || err.message);
      throw error;
    }
  },

  getAllHealthData: async () => {
    try {
      const [basic, detailed] = await Promise.all([
        HealthService.getHealthCheck(),
        HealthService.getDetailedHealth(),
      ]);
      return { basic, detailed };
    } catch (error) {
      const err = error as AxiosError;
      console.error("Error fetching all health data:", err.response?.data || err.message);
      throw error;
    }
  },
};