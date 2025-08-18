import React from "react";
import { Link } from "react-router-dom";
import { MdKeyboardArrowRight } from "react-icons/md";

const Sales = [
  {
    client: "Samad Abdulafeez",
    amount: "-₦12,750",
    time: "11:40 AM",
    products: ["5x Nails"],
  },
  {
    client: "Akpan construction",
    amount: "+₦150,000",
    time: "11:25 AM",
    products: ["10x Cement"],
  },
  {
    client: "Ade properties",
    amount: "-₦225,000",
    time: "09:15 AM",
    products: ["25x Steel Rods"],
  },
  {
    client: "Walk-in client",
    amount: "-₦7,500",
    time: "08:10 AM",
    products: ["3x Nails"],
  },
];

const RecentSalesActivity: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm font-Inter">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          Your Recent Sales Activity
        </h2>
        <Link
          to="/staff/dashboard/s-sales"
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <span className="mr-1">View all Sales</span>
          <MdKeyboardArrowRight className="text-lg" />
        </Link>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Products
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Sales.map((sale, i) => (
              <tr key={i}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {sale.client}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {sale.products.map((product, idx) => (
                    <div key={idx} className="flex items-center">
                      <span>{product}</span>
                      {idx !== sale.products.length - 1 && <span>, </span>}
                    </div>
                  ))}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                    sale.amount.startsWith("-") ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {sale.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {sale.time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-gray-200">
        {Sales.map((sale, i) => (
          <div key={i} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  {sale.client}
                </h3>
                <div className="flex flex-wrap gap-1 mb-2">
                  {sale.products.map((product, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {product}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-semibold ${
                    sale.amount.startsWith("-") ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {sale.amount}
                </p>
                <p className="text-xs text-gray-500 mt-1">{sale.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 text-center text-sm text-gray-500">
        Page 1 of 1
      </div>
    </div>
  );
};

export default RecentSalesActivity;