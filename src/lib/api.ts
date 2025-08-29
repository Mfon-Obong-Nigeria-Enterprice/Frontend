// src/lib/api.ts
import axios, { type AxiosResponse } from 'axios';
import type {
  Settings,
  Product,
  ApiResponse,
  ProductUpdatePricePayload,
  UpdateSettingsPayload,
  ApiSettings
} from '@/types/types';
import { toast } from 'sonner';

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mfon-obong-enterprise.onrender.com/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle API errors
api.interceptors.response.use(
  response => response,
  error => {
    if (!import.meta.env.PROD) {
      console.error('API Error:', error);
    }
    return Promise.reject(error);
  }
);

// Helper to handle API responses
export const handleApiResponse = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
  if (!response.data.success) {
    throw new Error(response.data.message || 'API request failed');
  }
  return response.data.data;
};

// Convert API settings to frontend format
const convertApiToFrontendSettings = (apiSettings: ApiSettings): Settings => {
  return {
    alerts: {
      lowStockAlerts: apiSettings.lowStockAlert ?? true,
      newProductNotifications: apiSettings.newProductNotification ?? true,
      expirationReminders: apiSettings.expirationReminder ?? true,
      clientsDebtsAlert: apiSettings.debtAlert ?? false,
      CustomThresholdAlerts: apiSettings.customThresholdAlert ?? false,
      LargeBalanceAlertThreshold: apiSettings.largeBalanceAlert ?? false,
      PriceChangeNotification: apiSettings.priceChangeNotification ?? false,
      dashboardNotification: apiSettings.dashboardNotification ?? false,
      emailNotification: apiSettings.emailNotification ?? false,
      inactivityAlerts: apiSettings.inactivityAlert ?? false,
      systemHealthAlerts: apiSettings.systemHealthAlert ?? false,
      userLoginNotifications: apiSettings.userLoginNotification ?? false,
    },
    system: {
      lowStockAlertThreshold: apiSettings.lowStockThreshold ?? 15,
      maximumDiscount: apiSettings.maxDiscount ?? 10,
      bulkDiscountThreshold: apiSettings.bulkDiscountThreshold ?? 10000,
      minimumPurchaseForBulkDiscount: apiSettings.minPurchaseForBulkDiscount ?? 500,
      allowNegativeBalances: apiSettings.allowNegativeBalance ?? false,
      largeBalanceThreshold: apiSettings.largeBalanceThreshold ?? 50000,
    },
    clientAccount: {
      defaultCreditLimit: apiSettings.defaultCreditLimit ?? 800000,
      inactivePeriodDays: apiSettings.inactivePeriodDays ?? 30,
    },
  };
};

// Convert frontend settings to API format
const convertFrontendToApiSettings = (frontendSettings: UpdateSettingsPayload): Partial<ApiSettings> => {
  const apiSettings: Partial<ApiSettings> = {};

  // Alert settings
  if (frontendSettings.alerts) {
    const alerts = frontendSettings.alerts;
    apiSettings.lowStockAlert = alerts.lowStockAlerts;
    apiSettings.newProductNotification = alerts.newProductNotifications;
    apiSettings.expirationReminder = alerts.expirationReminders;
    apiSettings.debtAlert = alerts.clientsDebtsAlert;
    apiSettings.customThresholdAlert = alerts.CustomThresholdAlerts;
    apiSettings.largeBalanceAlert = alerts.LargeBalanceAlertThreshold;
    apiSettings.priceChangeNotification = alerts.PriceChangeNotification;
    apiSettings.dashboardNotification = alerts.dashboardNotification;
    apiSettings.emailNotification = alerts.emailNotification;
    apiSettings.inactivityAlert = alerts.inactivityAlerts;
    apiSettings.systemHealthAlert = alerts.systemHealthAlerts;
    apiSettings.userLoginNotification = alerts.userLoginNotifications;
  }

  // System settings
  if (frontendSettings.system) {
    const system = frontendSettings.system;
    apiSettings.lowStockThreshold = system.lowStockAlertThreshold;
    apiSettings.maxDiscount = system.maximumDiscount;
    apiSettings.bulkDiscountThreshold = system.bulkDiscountThreshold;
    apiSettings.minPurchaseForBulkDiscount = system.minimumPurchaseForBulkDiscount;
    apiSettings.allowNegativeBalance = system.allowNegativeBalances;
    apiSettings.largeBalanceThreshold = system.largeBalanceThreshold;
  }

  // Client account settings
  if (frontendSettings.clientAccount) {
    const clientAccount = frontendSettings.clientAccount;
    apiSettings.defaultCreditLimit = clientAccount.defaultCreditLimit;
    apiSettings.inactivePeriodDays = clientAccount.inactivePeriodDays;
  }

  return apiSettings;
};

// Settings API
export const fetchSettings = async (): Promise<Settings> => {
  try {
    const response = await api.get<ApiResponse<ApiSettings>>('/system-preferences');
    const apiSettings = handleApiResponse(response);
    return convertApiToFrontendSettings(apiSettings);
  } catch (error) {
    if (!import.meta.env.PROD) {
      console.error('Error fetching settings:', error);
    }
    throw error;
  }
};

export const updateSettings = async (payload: UpdateSettingsPayload): Promise<Settings> => {
  try {
    const apiPayload = convertFrontendToApiSettings(payload);
    
    const response = await api.patch<ApiResponse<ApiSettings>>(
      '/system-preferences', 
      apiPayload
    );
    
    const updatedApiSettings = handleApiResponse(response);
    toast.success('Settings updated successfully');
    
    return convertApiToFrontendSettings(updatedApiSettings);
  } catch (error) {
    if (!import.meta.env.PROD) {
      console.error('Error updating settings:', error);
    }
    throw error;
  }
};

// Products API
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get<ApiResponse<Product[]>>('/find-all-products');
    const data = handleApiResponse(response);
    
    if (!Array.isArray(data)) {
      if (!import.meta.env.PROD) {
        console.error('Expected array of products but got:', data);
      }
      return [];
    }
    
    return data;
  } catch (error) {
    if (!import.meta.env.PROD) {
      console.error('Error fetching products:', error);
    }
    return [];
  }
};

export const updateProductPrice = async (payload: ProductUpdatePricePayload): Promise<Product> => {
  try {
    const response = await api.patch<ApiResponse<Product>>(
      '/update-price',
      { 
        productId: payload.productId, 
        newPrice: payload.newPrice 
      }
    );
    
    const data = handleApiResponse(response);
    toast.success('Product price updated successfully');
    return data;
  } catch (error) {
    if (!import.meta.env.PROD) {
      console.error(`Error updating product price:`, error);
    }
    throw error;
  }
};

export default api;