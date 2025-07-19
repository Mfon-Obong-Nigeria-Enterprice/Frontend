import React from "react";

type BalanceItem = {
  name: string;
  amount: string;
};

const balances: BalanceItem[] = [
  { name: "XYZ builders", amount: "₦54,350" },
  { name: "Metro developers", amount: "₦120,800" },
  { name: "City build Ltd", amount: "₦97,400" },
];

const OutstandingBalances: React.FC = () => {
  return (
    <div className="w-full max-w-5xl border border-gray-300 rounded-md p-4 bg-white shadow-sm">
      <h2 className="text-lg font-medium mb-4">Outstanding Balances</h2>
      <ul className="space-y-3 divide-y divide-gray-200">
        {balances.map((item, index) => (
          <li key={index} className="flex justify-between text-sm py-1.5">
            <span className="text-gray-700 font-small">{item.name}</span>
            <span className="text-[#F95353] font-semibold">{item.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OutstandingBalances;
