import { z } from 'zod';

// First define the nested schemas to avoid reference errors
export const alertAndNotificationSettingsSchema = z.object({
  lowStockAlerts: z.boolean(),
  expirationReminders: z.boolean(),
  newProductNotifications: z.boolean(),
  clientsDebtsAlert: z.boolean(),
  CustomThresholdAlerts: z.boolean(),
  PriceChangeNotification: z.boolean(),
  LargeBalanceAlertThreshold: z.boolean(),
  dashboardNotification: z.boolean(), 
  emailNotification: z.boolean(), 
  inactivityAlerts: z.boolean(),
  systemHealthAlerts: z.boolean(),
  userLoginNotifications: z.boolean(),
});

export const systemPreferencesSchema = z.object({
  lowStockAlertThreshold: z.number().min(0, "Must be a positive number"),
  maximumDiscount: z.number().min(0, "Must be a positive number").max(100, "Cannot exceed 100%"),
  bulkDiscountThreshold: z.number().min(0, "Must be a positive number"),
  minimumPurchaseForBulkDiscount: z.number().min(0, "Must be a positive number"),
  allowNegativeBalances: z.boolean(),
  largeBalanceThreshold: z.number().min(0, "Must be a positive number"),
});

export const clientAccountSettingsSchema = z.object({
  defaultCreditLimit: z.number().min(0, "Must be a positive number"),
  inactivePeriodDays: z.number().min(1, "Must be at least 1 day"),
});

export const maintenanceModeSchema = z.object({
  enabled: z.boolean(),
  message: z.string().optional(),
  scheduledStart: z.string().datetime().optional(),
  scheduledEnd: z.string().datetime().optional(),
});

export const sessionSettingsSchema = z.object({
  timeoutHours: z.number().min(0.5).max(24),
  forceLogout: z.boolean().default(false),
});

// Now define the main settings schema
export const settingsSchema = z.object({
  clientsDebtsAlert: z.boolean(),
  largeBalanceAlert: z.boolean(),
  lowStockAlert: z.boolean(),
  inactivityAlerts: z.boolean(),
  dashboardNotification: z.boolean(),
  emailNotification: z.boolean(),
  alerts: alertAndNotificationSettingsSchema,
  system: systemPreferencesSchema,
  clientAccount: clientAccountSettingsSchema,
  maintenanceMode: maintenanceModeSchema.optional(),
  sessionSettings: sessionSettingsSchema.optional(),
});

export const updateSettingsSchema = settingsSchema.partial();

export const apiSettingsSchema = z.object({
  lowStockAlert: z.boolean().optional(),
  newProductNotification: z.boolean().optional(),
  expirationReminder: z.boolean().optional(),
  debtAlert: z.boolean().optional(),
  customThresholdAlert: z.boolean().optional(),
  largeBalanceAlert: z.boolean().optional(),
  priceChangeNotification: z.boolean().optional(),
  dashboardNotification: z.boolean().optional(),
  emailNotification: z.boolean().optional(),
  inactivityAlert: z.boolean().optional(),
  systemHealthAlert: z.boolean().optional(),
  userLoginNotification: z.boolean().optional(),
  
  // System settings
  lowStockThreshold: z.number().optional(),
  maxDiscount: z.number().optional(),
  bulkDiscountThreshold: z.number().optional(),
  minPurchaseForBulkDiscount: z.number().optional(),
  allowNegativeBalance: z.boolean().optional(),
  largeBalanceThreshold: z.number().optional(),
  
  // Client account settings
  defaultCreditLimit: z.number().optional(),
  inactivePeriodDays: z.number().optional(),
});

// Export all types
export type MaintenanceModeSettings = z.infer<typeof maintenanceModeSchema>;
export type SessionSettings = z.infer<typeof sessionSettingsSchema>;
export type AlertAndNotificationSettings = z.infer<typeof alertAndNotificationSettingsSchema>;
export type SystemPreferences = z.infer<typeof systemPreferencesSchema>;
export type ClientAccountSettings = z.infer<typeof clientAccountSettingsSchema>;
export type Settings = z.infer<typeof settingsSchema>;
export type UpdateSettingsPayload = z.infer<typeof updateSettingsSchema>;
export type SettingsFormData = z.infer<typeof settingsSchema>;
export type ApiSettings = z.infer<typeof apiSettingsSchema>;