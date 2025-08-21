
import api from "./baseApi";

export type HealthStatus = 'healthy' | 'unhealthy' | 'up' | 'down' | 'critical';

export interface BasicHealthResponse {
  status: HealthStatus;
  timestamp: string;
}

export interface MemoryUsage {
  heapUsed: number;
  heapTotal: number;
  external: number;
  rss: number;
}

export interface DatabaseCheck {
  status: HealthStatus;
  responseTime: number;
}

export interface MemoryCheck {
  status: HealthStatus;
  usage: MemoryUsage;
  percentage: number;
}

export interface EnvironmentInfo {
  nodeVersion: string;
  platform: string;
  environment: string;
}

export interface DetailedHealthResponse {
  status: HealthStatus;
  timestamp: string;
  uptime: number;
  checks: {
    database: DatabaseCheck;
    memory: MemoryCheck;
    environment: EnvironmentInfo;
  };
}

export const HealthService = {
  getHealthCheck: async (): Promise<BasicHealthResponse> => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error("Error fetching basic health:", error);
      throw error;
    }
  },

  getDetailedHealth: async (): Promise<DetailedHealthResponse> => {
    try {
      const response = await api.get('/health/detailed');
      return response.data;
    } catch (error) {
      console.error("Error fetching detailed health:", error);
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
      console.error("Error fetching all health data:", error);
      throw error;
    }
  },
};