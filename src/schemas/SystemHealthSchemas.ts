import { z } from 'zod';

export const healthStatusSchema = z.enum([
  "healthy",
  "unhealthy",
  "up",
  "down",
  "critical",
  "degraded",
  "high", 
]);

export type HealthStatus = z.infer<typeof healthStatusSchema>;

export const memoryUsageSchema = z.object({
  heapUsed: z.number(),
  heapTotal: z.number(),
  external: z.number(),
  rss: z.number(),
});

export const databaseCheckSchema = z.object({
  status: healthStatusSchema,
  responseTime: z.number(),
});

export const memoryCheckSchema = z.object({
  status: healthStatusSchema,
  usage: memoryUsageSchema,
  percentage: z.number(),
});

export const environmentInfoSchema = z.object({
  nodeVersion: z.string(),
  platform: z.string(),
  environment: z.string(),
});

export const basicHealthResponseSchema = z.object({
  status: healthStatusSchema,
  timestamp: z.string(),
});

export const detailedHealthResponseSchema = z.object({
  status: healthStatusSchema,
  timestamp: z.string(),
  uptime: z.number(),
  checks: z.object({
    database: databaseCheckSchema,
    memory: memoryCheckSchema,
    environment: environmentInfoSchema,
  }),
});

// Type exports
export type BasicHealthResponse = z.infer<typeof basicHealthResponseSchema>;
export type DetailedHealthResponse = z.infer<typeof detailedHealthResponseSchema>;
export type MemoryUsage = z.infer<typeof memoryUsageSchema>;
export type DatabaseCheck = z.infer<typeof databaseCheckSchema>;
export type MemoryCheck = z.infer<typeof memoryCheckSchema>;
export type EnvironmentInfo = z.infer<typeof environmentInfoSchema>;