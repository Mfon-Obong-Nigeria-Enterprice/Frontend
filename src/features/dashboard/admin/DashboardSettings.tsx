import * as React from "react";
import { AlertSettingsSection } from "./components/AlertSettings";
import { NotificationSettingsSection } from "./components/NotificationSettings";
import { PriceUpdateTableSection } from "./components/PriceUpdate";
import {
  useProducts,
  useUpdateProductPrice,
  useSettings,
} from "@/hooks/useSetting";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { type Product, type Settings } from "@/types/types";
import { useHasRole } from "@/lib/roles";

export function DashboardSettings() {
  const canModifySettings = useHasRole(["SUPER_ADMIN", "ADMIN"]);
  const canModifyPrices = useHasRole(["SUPER_ADMIN", "ADMIN", "MAINTAINER"]);

  const { data: products } = useProducts();
  const { data: apiSettings } = useSettings();
  const updateProductPriceMutation = useUpdateProductPrice();

  const { currentSettings, initializeSettings, setSetting } =
    useSettingsStore();

  const [editingPrices, setEditingPrices] = React.useState<{
    [key: string]: number;
  }>({});
  const loadingProductId = updateProductPriceMutation.isPending
    ? updateProductPriceMutation.variables?.productId || null
    : null;

  React.useEffect(() => {
    if (apiSettings) {
      initializeSettings(apiSettings);
    }
  }, [apiSettings, initializeSettings]);

  const handleSettingChange = (key: keyof Settings, value: boolean) => {
    if (canModifySettings) {
      setSetting(key, value);
    }
  };

  const handlePriceInputChange = (id: string, value: number) => {
    if (canModifyPrices) {
      setEditingPrices((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleUpdatePrice = (product: Product) => {
    if (!canModifyPrices) return;

    const newPrice = editingPrices[product._id];
    if (newPrice !== undefined && !isNaN(newPrice) && newPrice > 0) {
      updateProductPriceMutation.mutate({ productId: product._id, newPrice });
      setEditingPrices((prev) => {
        const newEditingPrices = { ...prev };
        delete newEditingPrices[product._id];
        return newEditingPrices;
      });
    }
  };

  const handleResetPrice = (product: Product) => {
    if (!canModifyPrices) return;
    setEditingPrices((prev) => {
      const newEditingPrices = { ...prev };
      delete newEditingPrices[product._id];
      return newEditingPrices;
    });
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

        <div className="">
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
                products={products || []}
                editingPrices={editingPrices}
                loadingProductId={loadingProductId}
                onPriceChange={handlePriceInputChange}
                onUpdate={handleUpdatePrice}
                onReset={handleResetPrice}
                isReadOnly={!canModifyPrices}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
