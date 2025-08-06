import * as React from 'react';
import { AlertSettingsSection } from './components/AlertSettings';
import { NotificationSettingsSection } from './components/NotificationSettings';
import { PriceUpdateTableSection } from './components/PriceUpdate';
import { useProducts, useUpdateProductPrice, useSettings } from '@/hooks/useSetting';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { type Product, type Settings } from '@/types/types';
import { useHasRole } from '@/lib/roles';

export function DashboardSettings() {
  const canModifySettings = useHasRole(["SUPER_ADMIN", "ADMIN"]);
  const canModifyPrices = useHasRole(["SUPER_ADMIN", "ADMIN", "MAINTAINER"]);

  const { data: products } = useProducts();
  const { data: apiSettings } = useSettings();
  const updateProductPriceMutation = useUpdateProductPrice();

  const {
    currentSettings,
    initializeSettings,
    setSetting,
  } = useSettingsStore();

  const [editingPrices, setEditingPrices] = React.useState<{ [key: string]: number }>({});
  const loadingProductId = updateProductPriceMutation.isPending ? updateProductPriceMutation.variables?.productId || null : null;

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
          <h1 className="text-2xl font-bold text-gray-800">Settings & Configurations</h1>
          <p className="text-gray-600">Manage your system preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Alert Settings</h2>
              <AlertSettingsSection
                settings={currentSettings}
                onSettingChange={handleSettingChange}
                isReadOnly={!canModifySettings}
              />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Notification Preferences</h2>
              <NotificationSettingsSection
                settings={currentSettings}
                onSettingChange={handleSettingChange}
                isReadOnly={!canModifySettings}
              />
            </div>
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
  );
}
// import { useEffect, useState } from "react";
// import DashboardTitle from "../../../components/dashboard/DashboardTitle";
// import api from "@/services/baseApi";

// interface Item {
//   productName: string;
//   quantity: number;
//   unit: string;
//   unitPrice: number;
//   discount: number;
//   subtotal: number;
// }

// interface Transaction {
//   _id: string;
//   invoiceNumber: string;
//   type: string;
//   walkInClient?: {
//     name: string;
//     phone: string;
//   };
//   clientId?: {
//     _id: string;
//     name: string;
//     phone: string;
//   };
//   items: Item[];
//   subtotal: number;
//   discount: number;
//   total: number;
//   amountPaid: number;
//   paymentMethod: string;
//   status: string;
//   createdAt: string;
// }

// const DashboardSettings = () => {
//   const [transactions, setTransactions] = useState<Transaction[]>([]);

//   useEffect(() => {
//     const getTransaction = async () => {
//       const response = await api.get("/transactions");
//       setTransactions(response.data);
//     };

//     getTransaction();
//   }, []);

//   return (
//     <div className="p-4">
//       <DashboardTitle title="All Transactions" />

//       {transactions.length === 0 ? (
//         <p>Loading transactions...</p>
//       ) : (
//         <div className="grid gap-4">
//           {transactions.map((txn) => (
//             <div
//               key={txn._id}
//               className="border rounded-lg p-4 shadow-sm bg-white"
//             >
//               <h2 className="font-bold text-lg">
//                 {txn.invoiceNumber} - {txn.type}
//               </h2>

//               <p>
//                 <strong>Client:</strong>{" "}
//                 {txn.clientId?.name || txn.walkInClient?.name} (
//                 {txn.clientId?.phone || txn.walkInClient?.phone})
//               </p>
//               <p>
//                 <strong>Status:</strong> {txn.status}
//               </p>
//               <p>
//                 <strong>Payment Method:</strong> {txn.paymentMethod}
//               </p>
//               <p>
//                 <strong>Type:</strong> {txn.type}
//               </p>
//               <p>
//                 <strong>Total:</strong> ₦{txn.total.toLocaleString()}
//               </p>
//               <p>
//                 <strong>Paid:</strong> ₦{txn.amountPaid.toLocaleString()}
//               </p>
//               <p>
//                 <strong>Date:</strong>{" "}
//                 {new Date(txn.createdAt).toLocaleString()}
//               </p>

//               <div className="mt-2">
//                 <strong>Items:</strong>
//                 <ul className="list-disc list-inside text-sm">
//                   {txn.items.map((item, index) => (
//                     <li key={index}>
//                       {item.productName} - {item.quantity} {item.unit} @ ₦
//                       {item.unitPrice.toLocaleString()} = ₦
//                       {item.subtotal.toLocaleString()}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

export default DashboardSettings;

// import DashboardTitle from "../../../components/dashboard/DashboardTitle";

// const DashboardSettings = () => {
//   return (
//     <div>
//       <DashboardTitle
//         heading="Admin Settings"
//         description="Manage your basic system preferences"
//       />
//     </div>
//   );
// };

// export default DashboardSettings;
