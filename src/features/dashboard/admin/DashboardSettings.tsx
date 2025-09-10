/* eslint-disable @typescript-eslint/no-unused-vars */
// features/dashboard/super-admin/components/DashboardSettings.tsx
import * as React from "react";
import { AlertSettingsSection } from "./components/AlertSettings";
import { NotificationSettingsSection } from "./components/NotificationSettings";
import { PriceUpdateTableSection } from "./components/PriceUpdate";
import { useUpdateProductPrice } from "@/hooks/useSetting";
import { useInventoryStore } from "@/stores/useInventoryStore";
import { type AlertAndNotificationSettings, type Settings } from "@/schemas/SettingsSchemas";
import { useHasRole } from "@/lib/roles";
import { toast } from "react-toastify";

// Default settings structure
const defaultSettings: Settings = {
  alerts: {
    lowStockAlerts: false,
    newProductNotifications: false,
    expirationReminders: false,
    clientsDebtsAlert: false,
    CustomThresholdAlerts: false,
    LargeBalanceAlertThreshold: false,
    PriceChangeNotification: false,
    dashboardNotification: false,
    emailNotification: false,
    inactivityAlerts: false,
    systemHealthAlerts: false,
    userLoginNotifications: false,
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
  },
  clientsDebtsAlert: false,
  largeBalanceAlert: false,
  lowStockAlert: false,
  inactivityAlerts: false,
  dashboardNotification: false,
  emailNotification: false
};

export function DashboardSettings() {
  const canModifySettings = useHasRole(["SUPER_ADMIN", "ADMIN"]);
  const canModifyPrices = useHasRole(["SUPER_ADMIN", "ADMIN", "MAINTAINER"]);

  const { products: storeProducts, updateProduct } = useInventoryStore();
  const updateProductPriceMutation = useUpdateProductPrice(); // Using the new hook

  const [editingPrices, setEditingPrices] = React.useState<{
    [key: string]: number;
  }>({});
  const [loadingProductId, setLoadingProductId] = React.useState<string | null>(
    null
  );
  const [localSettings, setLocalSettings] =
    React.useState<Settings>(defaultSettings);

  const handleSettingChange = (
    key: keyof AlertAndNotificationSettings,
    value: boolean
  ) => {
    if (!canModifySettings) return;

    // Update local state only - no API call since settings API doesn't exist
    setLocalSettings((prev) => ({
      ...prev,
      alerts: {
        ...prev.alerts,
        [key]: value,
      },
    }));

    // Optional: Store in localStorage for persistence
    localStorage.setItem(
      "app-settings",
      JSON.stringify({
        ...localSettings,
        alerts: { ...localSettings.alerts, [key]: value },
      })
    );
  };

  const handlePriceChange = (productId: string, newPrice: number) => {
    setEditingPrices((prev) => ({ ...prev, [productId]: newPrice }));
  };

  const handleResetPrice = (productId: string) => {
    setEditingPrices((prev) => {
      const newState = { ...prev };
      delete newState[productId];
      return newState;
    });
  };

const handleUpdatePrice = async (productId: string, newPrice: number) => {
    if (!canModifyPrices) {
      toast.error("You don't have permission to modify prices");
      return;
    }

    // Validate price
    if (newPrice <= 0) {
      toast.error("Price must be greater than 0");
      handleResetPrice(productId);
      return;
    }

    setLoadingProductId(productId);
    
    try {
      const updatedProduct = await updateProductPriceMutation.mutateAsync({
        id: productId, 
        price: newPrice,
      });
      
      updateProduct(updatedProduct);
      handleResetPrice(productId);
      toast.success("Price updated successfully");
      
    } catch (error) {
      console.error("Failed to update product price:", error);
      toast.error("Failed to update price. Please try again.");
      
      // Optional: Revert the local editing state on error
      handleResetPrice(productId);
      
    } finally {
      setLoadingProductId(null);
    }
  };

  // Load settings from localStorage on mount
  React.useEffect(() => {
    const savedSettings = localStorage.getItem("app-settings");
    if (savedSettings) {
      try {
        setLocalSettings(JSON.parse(savedSettings));
      } catch (error) {
        toast.error("Failed to load settings from localStorage");
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Settings & Configurations
          </h1>
          <p className="text-gray-600">Manage your system preferences</p>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Alert Settings
            </h2>
            <AlertSettingsSection
              settings={localSettings}
              onSettingChange={handleSettingChange}
              isReadOnly={!canModifySettings}
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Notification Preferences
            </h2>
            <NotificationSettingsSection
              settings={localSettings}
              onSettingChange={handleSettingChange}
              isReadOnly={!canModifySettings}
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <PriceUpdateTableSection
              products={storeProducts}
              editingPrices={editingPrices}
              loadingProductId={loadingProductId}
              onPriceChange={handlePriceChange}
              onUpdate={handleUpdatePrice}
              onReset={handleResetPrice}
              isReadOnly={!canModifyPrices}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
