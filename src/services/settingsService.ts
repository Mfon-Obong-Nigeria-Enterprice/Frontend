/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/settingsService.ts
import api from './baseApi';
import type { 
  Settings, 
  UpdateSettingsPayload, 
  MaintenanceModeSettings,
  SessionSettings 
} from '@/schemas/SettingsSchemas'
import { toast } from 'sonner';

class SettingsService {
  // Fetch settings from API or fallback to localStorage
  async fetchSettings(): Promise<Settings> {
    try {
      // Try to get from API first
      try {
        const response = await api.get('/settings');
        return response.data;
      } catch (apiError) {
        // If API fails, fallback to localStorage
        console.warn('API not available, using localStorage fallback', apiError);
        return this.getSettingsFromLocalStorage();
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
  }

  // Update settings via API or fallback to localStorage
  async updateSettings(payload: UpdateSettingsPayload): Promise<Settings> {
    try {
      // Try to update via API first
      try {
        const response = await api.patch('/settings', payload);
        toast.success('Settings updated successfully');
        return response.data;
      } catch (apiError) {
        // If API fails, fallback to localStorage
        console.warn('API not available, using localStorage fallback', apiError);
        return this.updateSettingsInLocalStorage(payload);
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }

  // Toggle maintenance mode with API call
  async toggleMaintenanceMode(isActive: boolean): Promise<MaintenanceModeSettings> {
    try {
      // Get authentication token
      const token = localStorage.getItem('authToken') || 
                    sessionStorage.getItem('authToken') ||
                    localStorage.getItem('token') ||
                    sessionStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      // Make API call to toggle maintenance mode
      const response = await api.post("/maintenance-mode/toggle", {
        isActive: isActive,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      toast.success(isActive ? 'Maintenance mode activated' : 'Maintenance mode deactivated');
      
      return { 
        enabled: isActive,
        message: response.data.message || 
          (isActive 
            ? "System under maintenance. Please try again later." 
            : "Maintenance mode deactivated. Normal system access restored.")
      };
    } catch (err: any) {
      let errorMessage = 'Failed to toggle maintenance mode';
      
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = 'Authentication failed. Please check your credentials and try logging in again.';
        } else if (err.response.status === 404) {
          errorMessage = 'Maintenance mode endpoint not found.';
        } else {
          errorMessage = `Request failed with status ${err.response.status}: ${err.response.data?.message || 'No additional details'}`;
        }
      } else if (err.request) {
        errorMessage = 'No response received from server. Please check your network connection.';
      } else {
        errorMessage = err.message || 'An unexpected error occurred';
      }
      
      toast.error(errorMessage);
      throw err;
    }
  }

  // Update session settings
  async updateSessionSettings(sessionSettings: SessionSettings): Promise<SessionSettings> {
    try {
      const response = await api.patch('/settings/session', sessionSettings);
      toast.success('Session settings updated successfully');
      return response.data;
    } catch (error) {
      console.error('Error updating session settings:', error);
      toast.error('Failed to update session settings');
      throw error;
    }
  }

  // Get settings from localStorage with defaults
  private getSettingsFromLocalStorage(): Settings {
    try {
      const savedSettings = localStorage.getItem('app-settings');
      if (savedSettings) {
        return JSON.parse(savedSettings);
      }
    } catch (error) {
      console.error('Error reading settings from localStorage:', error);
    }

    // Return default settings if nothing in localStorage
    return this.getDefaultSettings();
  }

  // Update settings in localStorage
  private updateSettingsInLocalStorage(payload: UpdateSettingsPayload): Settings {
    try {
      const currentSettings = this.getSettingsFromLocalStorage();
      
      // Merge with new settings
      const updatedSettings: Settings = {
        ...currentSettings,
        ...payload,
        alerts: {
          ...currentSettings.alerts,
          ...payload.alerts,
        },
        system: {
          ...currentSettings.system,
          ...payload.system,
        },
        clientAccount: {
          ...currentSettings.clientAccount,
          ...payload.clientAccount,
        }
      };

      // Save to localStorage
      localStorage.setItem('app-settings', JSON.stringify(updatedSettings));
      
      toast.success('Settings updated successfully');
      return updatedSettings;
    } catch (error) {
      console.error('Error updating settings in localStorage:', error);
      throw error;
    }
  }

  // Get default application settings
  private getDefaultSettings(): Settings {
    return {
      clientsDebtsAlert: true,
      largeBalanceAlert: true,
      lowStockAlert: true,
      inactivityAlerts: true,
      dashboardNotification: true,
      emailNotification: false,
      alerts: {
        lowStockAlerts: true,
        expirationReminders: true,
        newProductNotifications: true,
        clientsDebtsAlert: true,
        CustomThresholdAlerts: false,
        PriceChangeNotification: false,
        LargeBalanceAlertThreshold: true,
        dashboardNotification: true,
        emailNotification: false,
        inactivityAlerts: true,
        systemHealthAlerts: true,
        userLoginNotifications: false
      },
      system: {
        lowStockAlertThreshold: 15,
        maximumDiscount: 10,
        bulkDiscountThreshold: 10000,
        minimumPurchaseForBulkDiscount: 500,
        allowNegativeBalances: false,
        largeBalanceThreshold: 50000,
      },
      clientAccount: {
        defaultCreditLimit: 800000,
        inactivePeriodDays: 30,
      }
    };
  }
}

export const settingsService = new SettingsService();