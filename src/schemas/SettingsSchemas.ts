import { z } from 'zod';

export const settingsSchema = z.object({
  clientsDebtsAlert: z.boolean(),
  largeBalanceAlert: z.boolean(),
  lowStockAlert: z.boolean(),
  inactivityAlerts: z.boolean(),
  dashboardNotification: z.boolean(),
  emailNotification: z.boolean(),
});

export const updateSettingsSchema = settingsSchema.partial();
export type Settings = z.infer<typeof settingsSchema>;
export type UpdateSettingsPayload = z.infer<typeof updateSettingsSchema>;
export type SettingsFormData = z.infer<typeof settingsSchema>;