/** @format */

import DashboardTitle from "../shared/DashboardTitle";
import ClientDirectory from "../shared/ClientDirectory";
import { useMemo, useState } from "react";
import { useClientStore } from "@/stores/useClientStore";
import useClientFiltering, {
  type clientBalance,
  type clientStat,
} from "@/hooks/useClientFiltering";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import autoTable from "jspdf-autotable";
import type { Client, TransactionItem } from "@/types/types";
import jsPDF from "jspdf";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Stats from "../shared/Stats";
import type { StatCard } from "@/types/stats";

const ManagerClients = () => {
  const {
    clients,
    getNewClientsThisMonth,
    getNewClientsPercentageChange,
    getActiveClients, // This uses the 3-month logic
    getTotalClientsPercentageChange, // New function for total client growth
  } = useClientStore();

  const [searchTerm, setSearchTerm] = useState("");

  // Get dynamic data from store
  const totalClients = clients.length;
  const totalClientsChange = getTotalClientsPercentageChange();
  const newClientsThisMonth = getNewClientsThisMonth();
  const newClientsChange = getNewClientsPercentageChange();
  const activeClients = getActiveClients(); // 3-month active clients

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
            ? "PURCHASE"
            : "PICKUP",
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
            ? "PURCHASE"
            : "PICKUP",
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
      <main className="flex flex-col gap-4 mb-7">
        <DashboardTitle
          heading="Clients"
          description="Manage your client relationships and view outstanding balances"
        />
        <Stats data={stats} />

        <section className="bg-white rounded-[0.625rem] pt-4 border border-[#D9D9D9] mt-10 md:mx-1">
          <div className="flex items-center justify-between px-7 pt-5 flex-wrap">
            <h4 className="font-medium text-xl font-Inter text-[#1E1E1E]">
              Client directory
            </h4>
            <div className="flex items-center gap-3 pt-5 sm:pt-0 justify-self-end sm:justify-self-auto">
              <Button
                className="bg-white hover:bg-[#f5f5f5] text-[#333333] border border-[var(--cl-secondary)] font-Inter font-medium transition-colors duration-200 ease-in-out"
                onClick={handleExportPDF}
              >
                Export PDF
              </Button>
              <Button
                className="bg-white hover:bg-[#f5f5f5] text-[#333333] border border-[var(--cl-secondary)] font-Inter font-medium transition-colors duration-200 ease-in-out"
                onClick={handleExportExcel}
              >
                Download Excel
              </Button>
            </div>
          </div>

          {/* Search and filters */}
          <div className="flex justify-between items-center px-4 py-5 mt-5 flex-wrap sm:flex-nowrap sm:px-2 md:px-8">
            <div className="bg-[#F5F5F5] flex items-center gap-1 px-4 rounded-md w-full sm:w-1/2">
              <Search size={18} />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type="search"
                placeholder="Search clients, ID..."
                className="py-2 outline-0 w-full bg-transparent"
              />
            </div>
            <div className="flex items-center gap-4 pt-4 sm:pt-0 md:gap-3">
              <Select value={clientStatus} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-40 bg-[#D9D9D9] text-[#444444] border border-[#7d7d7d]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Status">All Status</SelectItem>
                  <SelectItem value="Registered">Registered</SelectItem>
                  <SelectItem value="Unregistered">Unregistered</SelectItem>
                </SelectContent>
              </Select>

              <Select value={clientBalance} onValueChange={handleBalanceChange}>
                <SelectTrigger className="w-40 bg-[#D9D9D9] text-[#444444] border border-[#7d7d7d]">
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

          <ClientDirectory
            searchTerm={searchTerm}
            filteredClientsData={filteredClients}
            actionLabel="view"
            isStaffView={false}
          />
        </section>
      </main>
    </div>
  );
};

export default ManagerClients;
