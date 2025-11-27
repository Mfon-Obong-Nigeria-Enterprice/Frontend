/** @format */

import React, { useMemo, useState } from "react";
//import DashboardTitle from "@/features/dashboard/shared/DashboardTitle";
import type { Client } from "@/types/types";
import { Search, ChevronLeft, ChevronRight} from "lucide-react";
import PaymentModal from "./components/PaymentModal";
import useClientFiltering, {
  type clientBalance,
} from "@/hooks/useClientFiltering";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getAllClients } from "@/services/clientService";

// Helper for badge styles based on type
const getTypeBadgeStyles = (type: string) => {
  switch (type.toLowerCase()) {
    case "deposit":
      return "bg-[#E2F3EB] text-[#2ECC71] border border-[#2ECC71]";
    case "pickup":
      return "bg-[#FFF8E1] text-[#FFA500] border border-[#FFA500]";
    case "purchase":
    case "puchase": // Handling typo from screenshot if data has it
      return "bg-[#FFECEC] text-[#F95353] border border-[#F95353]";
    default:
      return "bg-gray-100 text-gray-600 border border-gray-300";
  }
};

// Helper for amount coloring
const getAmountColor = (type: string) => {
    if (type.toLowerCase() === 'deposit') return 'text-[#2ECC71]';
    return 'text-[#F95353]';
}

const StaffClients: React.FC = () => {
  const { data: clients } = useQuery({
    queryKey: ["clients"],
    queryFn: getAllClients,
    staleTime: 5 * 60 * 1000,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    filteredClients: statusBalanceFilter,
    clientBalance,
    setClientBalance,
  } = useClientFiltering(clients);

  const filteredClients = useMemo(() => {
    return statusBalanceFilter.filter(
      (client) =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client._id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, statusBalanceFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleProcessPayment = (client: Client) => {
    setSelectedClient(client);
    setShowPaymentModal(true);
  };

  return (
    <main className="p-6 bg-[#F9FAFB] min-h-screen font-sans">
      
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
            <h1 className="text-[32px] font-semibold text-[#1E1E1E] leading-tight">Clients</h1>
            <p className="text-[#7D7D7D] text-base mt-1">Search, view, and edit client transaction</p>
        </div>
        
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="h-[44px] w-full md:w-[213px] px-6 bg-white hover:bg-gray-50 text-[#333333] border border-[#7D7D7D] rounded-lg font-medium flex items-center justify-center gap-2 shadow-sm"
        >
          <img src="/icons/refresh_icon.svg" width={16} height={16} className="text-[#333333]" alt="Refresh icon"/>
          Refresh
        </Button>
      </div>

      {/* Main Content Card */}
      <section className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        
        {/* Card Header & Filters */}
        <div className="p-6 pb-0">
            <h2 className="text-xl font-medium text-[#1F1F1F] mb-6">Clients Directory</h2>
            
            {/* Search Bar */}
            <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] placeholder-[#A4A4A4]" size={20} />
                <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#F9FAFB] border-none rounded-lg py-3 pl-12 pr-4 text-[#333333] placeholder-[#9CA3AF] focus:ring-1 focus:ring-gray-200 outline-none text-sm"
                />
            </div>

            {/* Filter Dropdown */}
            <div className="mb-8">
                <Select
                    value={clientBalance}
                    onValueChange={(value) => setClientBalance(value as clientBalance)}
                >
                    <SelectTrigger className="w-[160px] bg-[#D9D9D9] bg-opacity-50 border border-[#D9D9D9] text-[#333333] rounded-md h-10 text-sm font-medium">
                        <SelectValue placeholder="All Balances" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All Balances">All Balances</SelectItem>
                        <SelectItem value="PURCHASE">Purchase</SelectItem>
                        <SelectItem value="PICKUP">Pickup</SelectItem>
                        <SelectItem value="DEPOSIT">Deposit</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
                <thead className="bg-[#F9FAFB] border-t border-b border-[#E5E7EB]">
                    <tr>
                        <th className="text-left py-4 px-6 text-sm font-medium text-[#333333]">Date</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-[#333333]">Clients</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-[#333333]">Type</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-[#333333]">Amount</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-[#333333]">Balance</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-[#333333]">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                    {paginatedClients.length > 0 ? (
                        paginatedClients.map((client, index) => (
                            <tr key={client._id || index} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => window.location.href = `/staff/clients/${client._id}`}>
                                <td className="py-4 px-6 text-sm text-[#444444]">
                                    {/* Mocking date since client object usually has array of transactions, taking last or created */}
                                    {client.lastTransactionDate ? new Date(client.lastTransactionDate).toLocaleDateString() : new Date(client.createdAt).toLocaleDateString()}
                                </td>
                                <td className="py-4 px-6 text-sm text-[#444444]">
                                    {client.name}
                                </td>
                                <td className="py-4 px-6">
                                    {/* Use the last transaction's type */}
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeBadgeStyles(client.transactions[0]?.type || "N/A")}`}>
                                        {client.transactions[0]?.type || "N/A"}
                                    </span>
                                </td>
                                <td className={`py-4 px-6 text-sm font-medium ${getAmountColor(client.transactions[0]?.type || "")}`}>
                                    {/* Use the last transaction's amount */}
                                    {client.transactions[0]?.type === 'DEPOSIT' ? '+' : '-'}
                                    ₦{client.transactions[0]?.total?.toLocaleString() || "0"}
                                </td>
                                <td className="py-4 px-6 text-sm font-medium text-[#2ECC71]">
                                    +₦{client.balance.toLocaleString()}
                                </td>
                                <td className="py-4 px-6">
                                    <button 
                                        onClick={() => handleProcessPayment(client)}
                                        className="px-4 py-1.5 text-[#3B82F6] border border-[#3B82F6] rounded-md text-xs font-medium hover:bg-blue-50 transition-colors"
                                    >
                                        Deposit
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="py-8 text-center text-gray-500 text-sm">
                                No clients found matching your search.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
        <div className="bg-[#F9FAFB] border-t border-[#E5E7EB] p-4 flex justify-center items-center gap-4">
            <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded bg-white border border-[#D9D9D9] text-[#7D7D7D] disabled:opacity-50 hover:bg-gray-50"
            >
                <ChevronLeft size={16} />
            </button>
            
            <span className="text-xs text-[#7D7D7D]">
                Page {currentPage} of {totalPages || 1}
            </span>

            <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="w-8 h-8 flex items-center justify-center rounded bg-white border border-[#D9D9D9] text-[#7D7D7D] disabled:opacity-50 hover:bg-gray-50"
            >
                <ChevronRight size={16} />
            </button>
        </div>
        )}

      </section>

      {/* Payment Modal */}
      {showPaymentModal && selectedClient && (
        <PaymentModal
          client={selectedClient}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={() => {
            setShowPaymentModal(false);
            setSelectedClient(null);
          }}
        />
      )}
    </main>
  );
};

export default StaffClients;