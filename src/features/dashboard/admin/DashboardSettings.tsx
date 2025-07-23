import { useEffect, useState } from "react";
import DashboardTitle from "../../../components/dashboard/DashboardTitle";
import api from "@/services/baseApi";

interface Item {
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discount: number;
  subtotal: number;
}

interface Transaction {
  _id: string;
  invoiceNumber: string;
  type: string;
  walkInClient?: {
    name: string;
    phone: string;
  };
  clientId?: {
    _id: string;
    name: string;
    phone: string;
  };
  items: Item[];
  subtotal: number;
  discount: number;
  total: number;
  amountPaid: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

const DashboardSettings = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const getTransaction = async () => {
      const response = await api.get("/transactions");
      setTransactions(response.data);
    };

    getTransaction();
  }, []);

  return (
    <div className="p-4">
      <DashboardTitle title="All Transactions" />

      {transactions.length === 0 ? (
        <p>Loading transactions...</p>
      ) : (
        <div className="grid gap-4">
          {transactions.map((txn) => (
            <div
              key={txn._id}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <h2 className="font-bold text-lg">
                {txn.invoiceNumber} - {txn.type}
              </h2>

              <p>
                <strong>Client:</strong>{" "}
                {txn.clientId?.name || txn.walkInClient?.name} (
                {txn.clientId?.phone || txn.walkInClient?.phone})
              </p>
              <p>
                <strong>Status:</strong> {txn.status}
              </p>
              <p>
                <strong>Payment Method:</strong> {txn.paymentMethod}
              </p>
              <p>
                <strong>Type:</strong> {txn.type}
              </p>
              <p>
                <strong>Total:</strong> ₦{txn.total.toLocaleString()}
              </p>
              <p>
                <strong>Paid:</strong> ₦{txn.amountPaid.toLocaleString()}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(txn.createdAt).toLocaleString()}
              </p>

              <div className="mt-2">
                <strong>Items:</strong>
                <ul className="list-disc list-inside text-sm">
                  {txn.items.map((item, index) => (
                    <li key={index}>
                      {item.productName} - {item.quantity} {item.unit} @ ₦
                      {item.unitPrice.toLocaleString()} = ₦
                      {item.subtotal.toLocaleString()}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

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
