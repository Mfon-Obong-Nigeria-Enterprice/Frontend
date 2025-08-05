import type { Transaction } from "@/types/transactions";
import { Search } from "lucide-react";
import { useState } from "react";

interface ClientDiscountDetailsProps {
  clientTransactions: Transaction[];
}

const ClientDiscountDetails: React.FC<ClientDiscountDetailsProps> = ({
  clientTransactions,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDiscountTransactions = clientTransactions.filter((txn) => {
    return (
      txn.type === "PURCHASE" ||
      (txn.type === "PICKUP" &&
        (txn._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          txn.items.some((item) =>
            item.productName.toLowerCase().includes(searchTerm.toLowerCase())
          )))
    );
  });
  return (
    <div>
      <div className="mb-4 flex items-center gap-2 justify-between flex-wrap bg-[#ffffff] px-6 py-10 rounded-md shadow-lg border">
        <h1 className="text-[#333333] font-medium text-lg font-Inter">
          Discount History
        </h1>
        <div className="bg-[#F5F5F5] flex items-center gap-1 px-4 rounded-md w-full sm:w-1/2 ">
          <Search size={18} className="text-[#A4A4A4]" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="search"
            placeholder="Search discount payment by ID or date.."
            className="py-2 outline-0 w-full"
          />
        </div>
      </div>
      {filteredDiscountTransactions.length > 0 ? (
        <ul className="space-y-6 mt-6 ">
          {filteredDiscountTransactions.map((txn) => (
            <li
              key={txn._id}
              className="px-4 py-6 border rounded-md  bg-white shadow-lg flex flex-col gap-2"
            >
              <div className="flex items-center justify-between ">
                <p>{txn.invoiceNumber}</p>
                <p className="text-[#2ECC71] font-normal font-Inter text-lg">
                  ₦{txn.discount?.toLocaleString()} saved
                </p>
              </div>
              <div className="flex items-center justify-between ">
                <p>
                  {txn.createdAt &&
                    new Date(txn.createdAt).toLocaleDateString()}
                </p>
                {txn?.total ? (
                  <p className="text-[#7D7D7D] text-sm font-Inter">
                    {" "}
                    {(
                      ((txn?.discount ?? 0) / (txn?.subtotal ?? 0)) *
                      100
                    ).toFixed(2)}
                    % discount
                  </p>
                ) : (
                  "No discount"
                )}
              </div>

              <div>
                <p>Discount Breakdown: </p>
                <ul className="text-sm text-[#7D7D7D]">
                  {txn.items.map((item) => (
                    <li key={item.productId}>
                      <div className="flex items-center sm:justify-between justify-start py-2 gap-4">
                        <p>
                          {item.productName}({item.quantity}X): ₦
                          {item.unitPrice.toLocaleString()}
                        </p>
                        {item.discount ? (
                          <p>₦{item.discount.toLocaleString()}</p>
                        ) : (
                          <p>(No item discount)</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 border-l-5 border-[#2ECC71] pl-4 bg-[#E2F3EB] p-4 rounded-md">
                <p className="text-[#333333] font-normal text-[16px] font-Inter">
                  Summary:
                </p>
                <div className="flex items-center justify-between py-2">
                  <p>Original Total:</p>
                  <p>₦{txn.subtotal?.toLocaleString()}</p>
                </div>
                <div className="flex items-center justify-between py-2">
                  <p>Final Total:</p>
                  <p>₦{txn.total.toLocaleString()}</p>
                </div>
                <div className="flex items-center justify-between py-2 text-[#2ECC71]">
                  <p>Total Save:</p>
                  <p>₦{txn.discount?.toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-3 bg-[#FFE7A4] rounded-md p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-[#333333] font-normal text-[16px] font-Inter">
                    Reason:
                  </p>
                  <p className="text-[#7D7D7D] text-sm bg-[#FFF2CE80] rounded-sm px-2">
                    {txn.notes || "No reason provided"}
                  </p>
                </div>
                <p className="text-xs text-[#444444] font-normal font-Inter">
                  Applied by: {txn.userId?.name || "Unknown"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No discount transactions found.</p>
      )}
    </div>
  );
};

export default ClientDiscountDetails;
