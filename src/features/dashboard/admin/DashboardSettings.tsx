import * as React from "react";
import { AlertSettingsSection } from "./components/AlertSettings";
import { NotificationSettingsSection } from "./components/NotificationSettings";
import { PriceUpdateTableSection } from "./components/PriceUpdate";
import {
  useUpdateProductPrice,
  useSystemSettings,
  useUpdateSystemSettings,
} from "@/hooks/useSetting";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { useInventoryStore } from "@/stores/useInventoryStore";
import { type AlertAndNotificationSettings } from "@/types/types";
import { useHasRole } from "@/lib/roles";

export function DashboardSettings() {
  const canModifySettings = useHasRole(["SUPER_ADMIN", "ADMIN"]);
  const canModifyPrices = useHasRole(["SUPER_ADMIN", "ADMIN", "MAINTAINER"]);

  const { products: storeProducts, updateProduct } = useInventoryStore();
  const { data: systemSettings, refetch: refetchSettings } = useSystemSettings();
  const updateProductPriceMutation = useUpdateProductPrice();
  const updateSystemSettingsMutation = useUpdateSystemSettings();

  const [editingPrices, setEditingPrices] = React.useState<{ [key: string]: number }>({});
  const [loadingProductId, setLoadingProductId] = React.useState<string | null>(null);

  const { 
    currentSettings, 
    initializeSettings, 
    setAlertSetting 
  } = useSettingsStore();

  React.useEffect(() => {
    if (systemSettings) {
      initializeSettings(systemSettings);
    }
  }, [systemSettings, initializeSettings]);

  const handleSettingChange = async (key: keyof AlertAndNotificationSettings, value: boolean) => {
    if (!canModifySettings) return;

    try {
      setAlertSetting(key, value);
      
      await updateSystemSettingsMutation.mutateAsync({ 
        alerts: {
          [key]: value,
          lowStockAlerts: false,
          expirationReminders: false,
          newProductNotifications: false,
          clientsDebtsAlert: false,
          CustomThresholdAlerts: false,
          PriceChangeNotification: false,
          LargeBalanceAlertThreshold: false,
          dashboardNotification: false,
          emailNotification: false,
          inactivityAlerts: false,
          systemHealthAlerts: false,
          userLoginNotifications: false
        } 
      });
      refetchSettings();
    } catch (error) {
      if (!import.meta.env.PROD) {
        console.error("Failed to update setting:", error);
      }
      setAlertSetting(key, !value);
    }
  };

  const handlePriceChange = (productId: string, newPrice: number) => {
    setEditingPrices(prev => ({ ...prev, [productId]: newPrice }));
  };

  const handleResetPrice = (productId: string) => {
    setEditingPrices(prev => {
      const newState = { ...prev };
      delete newState[productId];
      return newState;
    });
  };

  const handleUpdatePrice = async (productId: string, newPrice: number) => {
    if (!canModifyPrices) return;
    
    setLoadingProductId(productId);
    try {
      const updatedProduct = await updateProductPriceMutation.mutateAsync(
        { productId, newPrice }
      );
      updateProduct(updatedProduct);
      handleResetPrice(productId);
    } catch (error) {
      if (!import.meta.env.PROD) {
        console.error("Failed to update price:", error);
      }
    } finally {
      setLoadingProductId(null);
    }
  };

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
              settings={currentSettings}
              onSettingChange={handleSettingChange}
              isReadOnly={!canModifySettings}
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Notification Preferences
            </h2>
            <NotificationSettingsSection
              settings={currentSettings}
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