/** @format */

import DashboardTitle from "../shared/DashboardTitle";
import ClientDirectory from "../shared/ClientDirectory";
import { useMemo, useState } from "react";
import { useClientStore } from "@/stores/useClientStore";
import useClientFiltering, {
  type clientBalance,
  type clientStat,
} from "@/hooks/useClientFiltering";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import autoTable from "jspdf-autotable";
import type { Client, TransactionItem } from "@/types/types";
import jsPDF from "jspdf";
import Stats from "../shared/Stats";
import type { StatCard } from "@/types/stats";
import ClientDirectoryMobile from "../shared/mobile/ClientDirectoryMobile";
import { Search, MoreVertical } from "lucide-react"; // Import MoreVertical for the 3 dots

const ManagerClients = () => {
  const {
    clients,
    getNewClientsThisMonth,
    getNewClientsPercentageChange,
    getActiveClients, // This uses the 3-month logic
    getTotalClientsPercentageChange, // New function for total client growth
    getOutStandingBalanceData,
  } = useClientStore();

  const [searchTerm, setSearchTerm] = useState("");

  // State to toggle the mobile/tablet action menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Get dynamic data from store
  const totalClients = clients.length;
  const totalClientsChange = getTotalClientsPercentageChange();
  const newClientsThisMonth = getNewClientsThisMonth();
  const newClientsChange = getNewClientsPercentageChange();
  const activeClients = getActiveClients(); // 3-month active clients
  const outstandingBalance = getOutStandingBalanceData
    ? getOutStandingBalanceData()
    : { totalDebt: 0, clientsWithDebt: 0 };

  // Format change text helper
  const formatChangeText = (
    change: {
      percentage: number;
      direction: "increase" | "decrease" | "no-change";
    },
    period: string
  ) => {
    switch (change.direction) {
      case "increase":
        return `↑${change.percentage}% more than ${period}`;
      case "decrease":
        return `↓${change.percentage}% less than ${period}`;
      default:
        return `—No change from ${period}`;
    }
  };

  const stats: StatCard[] = [
    {
      heading: "Total Clients",
      salesValue: totalClients,
      format: "number",
      statValue: formatChangeText(totalClientsChange, "last month"),
      color:
        totalClientsChange.direction === "increase"
          ? "green"
          : totalClientsChange.direction === "decrease"
            ? "red"
            : "blue",
    },
    {
      heading: "Active clients",
      salesValue: activeClients,
      format: "number",
      statValue: `${Math.round(
        (activeClients / totalClients) * 100
      )}% of total clients`,
      color: "blue",
    },
    {
      heading: "Outstanding Balances",
      salesValue: outstandingBalance.totalDebt,
      format: "currency",
      statValue: formatChangeText(
        { percentage: 0, direction: "no-change" },
        "last week"
      ),
      color: "orange",
    },
    {
      heading: "New clients (This month)",
      salesValue: newClientsThisMonth,
      format: "number",
      statValue: formatChangeText(newClientsChange, "last month"),
      color:
        newClientsChange.direction === "increase"
          ? "green"
          : newClientsChange.direction === "decrease"
            ? "red"
            : "orange",
    },
  ];

  const {
    filteredClients: statusBalanceFilter,
    clientStatus,
    clientBalance,
    setClientBalance,
    setClientStatus,
  } = useClientFiltering(clients);

  const filteredClients = useMemo(() => {
    return statusBalanceFilter.filter(
      (client) =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client._id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, statusBalanceFilter]);

  const handleStatusChange = (value: string) => {
    setClientStatus(value as clientStat);
  };

  const handleBalanceChange = (value: string) => {
    setClientBalance(value as clientBalance);
  };

  // PDF export function
  const handleExportPDF = () => {
    const doc = new jsPDF();

    const columns = [
      { header: "Client Name", dataKey: "Name" },
      { header: "Phone", dataKey: "Phone" },
      { header: "Email", dataKey: "Email" },
      { header: "Last Transaction", dataKey: "Last Transaction Type" },
      { header: "Amount", dataKey: "Amount" },
      { header: "Balance Status", dataKey: "Balance Status" },
      { header: "Total Transaction", dataKey: "Total Transaction" },
    ];

    const rows = filteredClients.map((client) => {
      const getLatestTransaction = (client: Client): TransactionItem | null => {
        if (
          !client.transactions ||
          client.transactions.length === 0 ||
          !Array.isArray(client.transactions)
        )
          return null;

        const sortedTransactions = [...client.transactions].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        return sortedTransactions[0] || null;
      };

      const latestTransaction = getLatestTransaction(client);

      return {
        Name: client.name,
        Phone: client.phone || "N/A",
        Email: client.email || "N/A",
        "Last Transaction Type": latestTransaction
          ? latestTransaction.type
          : "No Transaction",
        Amount: client.balance,
        "Balance Status":
          client.balance > 0
            ? "DEPOSIT"
            : client.balance < 0
              ? "PICKUP"
              : "PURCHASE",
        "Total Transaction": client.transactions
          ? client.transactions.length
          : 0,
      };
    });

    doc.setFontSize(16);
    doc.text("Client Summary", 14, 16);

    doc.setFontSize(10);
    doc.text(
      `Generated: ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
      14,
      26
    );

    autoTable(doc, {
      startY: 30,
      head: [columns.map((col) => col.header)],
      body: rows.map((row) =>
        columns.map((col) => row[col.dataKey as keyof typeof row])
      ),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [44, 204, 113] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.save("Client_Summary.pdf");
  };

  // Export Excel function
  const handleExportExcel = () => {
    const data = filteredClients.map((client) => {
      const getLatestTransaction = (client: Client): TransactionItem | null => {
        if (
          !client.transactions ||
          client.transactions.length === 0 ||
          !Array.isArray(client.transactions)
        )
          return null;

        const sortedTransactions = [...client.transactions].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        return sortedTransactions[0] || null;
      };

      const latestTransaction = getLatestTransaction(client);

      return {
        Name: client.name,
        Phone: client.phone || "N/A",
        Email: client.email || "N/A",
        "Client ID": client._id,
        "Active Status": client.isActive ? "Active" : "Inactive",
        "Last Transaction Date": latestTransaction
          ? new Date(latestTransaction.date).toLocaleDateString()
          : new Date(client.createdAt).toLocaleDateString(),
        "Registration Status": client.isRegistered
          ? "Registered"
          : "Unregistered",
        "Last Transaction Type": latestTransaction
          ? latestTransaction.type
          : "No Transaction",
        "Last Transaction Amount": latestTransaction
          ? latestTransaction.amount
          : 0,
        Amount: client.balance,
        "Balance Status":
          client.balance > 0
            ? "DEPOSIT"
            : client.balance < 0
              ? "PICKUP"
              : "PURCHASE",
        "Total Transaction": client.transactions
          ? client.transactions.length
          : 0,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clients");
    XLSX.writeFile(workbook, "clients_export.xlsx");
  };
  return (
    <div>
      <main>
        <DashboardTitle heading="Clients" description="Manage client accounts & relationships" />
        <Stats data={stats} />

        <section className="bg-white rounded-[0.625rem] pt-4 border border-[#D9D9D9] mt-10 pb-4">

          {/* --- ROW 1: Header & Actions --- */}
          <div className="flex justify-between items-center px-4 sm:px-7 pt-2 relative">
            <h4 className="font-medium text-xl font-Inter text-[#1E1E1E]">
              Client directory
            </h4>

            {/* DESKTOP/TABLET: Export Buttons (Hidden on Mobile) */}
            <div className="hidden sm:flex gap-3">
              <Button onClick={handleExportPDF} className="bg-white hover:bg-[#f5f5f5] text-[#444444] border border-[#7D7D7D] font-Inter font-medium">
                Export PDF
              </Button>
              <Button onClick={handleExportExcel} className="bg-white hover:bg-[#f5f5f5] text-[#444444] border border-[#7D7D7D] font-Inter font-medium">
                Download Excel
              </Button>
            </div>

            {/* MOBILE ONLY: 3-Dotted Menu */}
            <div className="sm:hidden relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <MoreVertical size={24} className="text-[#444444]" />
              </button>

              {/* Mobile Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#E5E7EB] shadow-lg rounded-md z-50 flex flex-col p-3 gap-3">

                  {/* Export Actions */}
                  <button onClick={handleExportPDF} className="text-left text-sm font-medium text-[#444444] py-1">
                    Export PDF
                  </button>
                  <button onClick={handleExportExcel} className="text-left text-sm font-medium text-[#444444] py-1 border-b border-gray-100 pb-2">
                    Download Excel
                  </button>

                  {/* Filters inside Menu (Mobile Only) */}
                  <div className="flex flex-col gap-2 pt-1">
                    <label className="text-xs text-gray-500 font-semibold">FILTERS</label>

                    {/* Status Select */}
                    <Select value={clientStatus} onValueChange={handleStatusChange}>
                      <SelectTrigger className="w-full bg-[#F5F5F5] text-[#444444] border border-[#E5E7EB] h-9 text-xs">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All status">All Status</SelectItem>
                        <SelectItem value="registered">Registered</SelectItem>
                        <SelectItem value="unregistered">Unregistered</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Balance Select */}
                    <Select value={clientBalance} onValueChange={handleBalanceChange}>
                      <SelectTrigger className="w-full bg-[#F5F5F5] text-[#444444] border border-[#E5E7EB] h-9 text-xs">
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
              )}
            </div>
          </div>

          {/* --- ROW 2 & 3 Combined: Search Bar & Filters --- */}
          <div className="flex flex-col lg:flex-row px-4 sm:px-7 mt-5 gap-4 lg:items-center">
            {/* Search Bar */}
            <div className="bg-[#F5F5F5] flex items-center gap-2 px-4 rounded-md w-full lg:flex-1 border border-transparent focus-within:border-[#D9D9D9]">
              <Search size={18} className="text-[#7D7D7D]" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type="search"
                placeholder="Search"
                className="py-2.5 outline-none w-full bg-transparent text-sm placeholder:text-[#7D7D7D]"
              />
            </div>

            {/* Filters (HIDDEN ON MOBILE, VISIBLE TABLET+) */}
            <div className="hidden sm:flex gap-3 shrink-0">
              <Select value={clientStatus} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-auto min-w-[120px] bg-[#D9D9D9] text-[#444444] border border-[#7d7d7d] px-3 py-2 h-auto rounded-md text-sm font-medium">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="bg-[#D9D9D9] text-[#444444]">
                  <SelectItem value="All status">All Status</SelectItem>
                  <SelectItem value="registered">Registered</SelectItem>
                  <SelectItem value="unregistered">Unregistered</SelectItem>
                </SelectContent>
              </Select>

              <Select value={clientBalance} onValueChange={handleBalanceChange}>
                <SelectTrigger className="w-auto min-w-[120px] bg-[#D9D9D9] text-[#444444] border border-[#7d7d7d] px-3 py-2 h-auto rounded-md text-sm font-medium">
                  <SelectValue placeholder="All Balances" />
                </SelectTrigger>
                <SelectContent className="bg-[#D9D9D9] text-[#444444]">
                  <SelectItem value="All Balances">All Balances</SelectItem>
                  <SelectItem value="PURCHASE">Purchase</SelectItem>
                  <SelectItem value="PICKUP">Pickup</SelectItem>
                  <SelectItem value="DEPOSIT">Deposit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6">
            <ClientDirectory searchTerm={searchTerm} filteredClientsData={filteredClients} actionLabel="view" isStaffView={false} />
            <ClientDirectoryMobile searchTerm={searchTerm} filteredClientsData={filteredClients} actionLabel="view" isStaffView={false} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default ManagerClients;
