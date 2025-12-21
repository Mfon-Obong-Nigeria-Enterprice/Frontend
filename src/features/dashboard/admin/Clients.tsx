/** @format */

import React, { useState } from "react";
import DashboardTitle from "../shared/DashboardTitle";
import { Button } from "@/components/ui/button";
import { MoreVertical, Plus, Search } from "lucide-react";
import ClientDirectory from "../shared/ClientDirectory";
import { AddClientDialog } from "./components/AddClientDialog";
import * as XLSX from "xlsx";
import type { Client, TransactionItem } from "@/types/types";
import { useClientStore } from "@/stores/useClientStore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import useClientFiltering, {
  type clientBalance,
  type clientStat,
} from "@/hooks/useClientFiltering";
import ClientStats from "./components/ClientStats";
import ClientDirectoryMobile from "../shared/mobile/ClientDirectoryMobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { getTransactionDate } from "@/utils/transactions";

interface ClientProps {
  showExportButtons?: boolean;
  onClientAction?: (client: Client) => void;
}

export const Clients: React.FC<ClientProps> = ({
  showExportButtons,
  onClientAction,
}) => {
  const { clients } = useClientStore();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    filteredClients,
    clientStatus,
    clientBalance,
    setClientBalance,
    setClientStatus,
  } = useClientFiltering(clients);

  const handleStatusChange = (value: string) => {
    setClientStatus(value as clientStat);
  };

  const handleBalanceChange = (value: string) => {
    setClientBalance(value as clientBalance);
  };

  // --- PDF Export Logic ---
  const handleExportPDF = () => {
    const doc = new jsPDF();
    const columns = [
      { header: "Client Name", dataKey: "Name" },
      { header: "Phone", dataKey: "Phone" },
      { header: " Email", dataKey: "Email" },
      { header: " Last Transaction", dataKey: "Last Transaction Type" },
      { header: " Amount", dataKey: "Amount" },
      { header: "Balance Status", dataKey: "Balance Status" },
      { header: " Total Transaction", dataKey: "Total Transaction" },
    ];

    const rows = filteredClients.map((client) => {
      const getLatestTransaction = (client: Client): TransactionItem | null => {
        if (!client.transactions || !Array.isArray(client.transactions)) return null;
        const sortedTransactions = [...client.transactions].sort(
          (a, b) => getTransactionDate(b).getTime() - getTransactionDate(a).getTime()
        );
        return sortedTransactions[0] || null;
      };

      const latestTransaction = getLatestTransaction(client);

      return {
        Name: client.name,
        Phone: client.phone || "N/A",
        Email: client.email || "N/A",
        "Last Transaction Type": latestTransaction ? latestTransaction.type : "No Transaction",
        Amount: client.balance,
        "Balance Status": client.balance > 0 ? "DEPOSIT" : client.balance < 0 ? "PURCHASE" : "PICKUP",
        "Total Transaction": client.transactions ? client.transactions.length : 0,
      };
    });

    doc.setFontSize(16);
    doc.text("Client Summary", 14, 16);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 26);
    
    autoTable(doc, {
      startY: 30,
      head: [columns.map((col) => col.header)],
      body: rows.map((row) => columns.map((col) => row[col.dataKey as keyof typeof row])),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [44, 204, 113] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });
    doc.save("Client_Summary.pdf");
  };

  // --- Excel Export Logic ---
  const handleExportExcel = () => {
    const data = filteredClients.map((client) => {
      const getLatestTransaction = (client: Client): TransactionItem | null => {
        if (!client.transactions || !Array.isArray(client.transactions)) return null;
        const sortedTransactions = [...client.transactions].sort(
          (a, b) => getTransactionDate(b).getTime() - getTransactionDate(a).getTime()
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
        "Registration Status": client.isRegistered ? "Registered" : "Unregistered",
        "Last Transaction Type": latestTransaction ? latestTransaction.type : "No Transaction",
        "Last Transaction Amount": latestTransaction ? latestTransaction.amount : 0,
        Amount: client.balance,
        "Balance Status": client.balance > 0 ? "DEPOSIT" : client.balance < 0 ? "PURCHASE" : "PICKUP",
        "Total Transaction": client.transactions ? client.transactions.length : 0,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clients");
    XLSX.writeFile(workbook, "clients_export.xlsx");
  };

  return (
    <main>
      <DashboardTitle
        heading="Client Management"
        description="Manage client accounts & relationship"
      />

      <ClientStats />

      {/* Client Directory Section */}
      <section className="bg-white rounded-[0.625rem] pt-4 border border-[#D9D9D9] mt-10 mx-3 md:mx-0">
        
        {/* Header Row */}
        <div className="flex justify-between items-center px-4 sm:px-7 pt-2">
          {/* Screenshot matches 'Clients Directory' (plural) */}
          <h4 className="font-medium text-xl font-Inter text-[#1E1E1E]">
            Clients Directory
          </h4>

          {showExportButtons !== false && (
            <>
              {/* Desktop Buttons (Hidden on Tablet/Mobile) */}
              <div className="hidden lg:flex items-center gap-3">
                <Button
                  className="bg-white hover:bg-[#f5f5f5] text-[#333333] border border-[var(--cl-secondary)] font-Inter font-medium"
                  onClick={handleExportPDF}
                >
                  Export PDF
                </Button>
                <Button
                  className="bg-white hover:bg-[#f5f5f5] text-[#333333] border border-[var(--cl-secondary)] font-Inter font-medium"
                  onClick={handleExportExcel}
                >
                  Download Excel
                </Button>
                <Button
                  onClick={() => setShowAddDialog(true)}
                  className="bg-[#2ECC71] hover:bg-[var(--cl-bg-green-hover)]"
                >
                  <Plus className="w-5 h-5 text-white mr-2" />
                  Add Client
                </Button>
              </div>

              {/* Tablet/Mobile Menu (Visible < lg) */}
              <div className="lg:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[#7D7D7D] hover:bg-transparent"
                    >
                      <MoreVertical className="w-6 h-6" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-white border border-[#D9D9D9]">
                    <DropdownMenuItem onClick={handleExportPDF}>
                      Export PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportExcel}>
                      Download Excel
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowAddDialog(true)}>
                      <span className="text-[#2ECC71]">Add Client</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          )}
        </div>

        {/* Controls Section: Stacked on Tablet/Mobile, Row on Desktop */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-4 sm:px-7 py-5">
          
          {/* Search Bar - Full width on Tablet */}
          <div className="bg-[#F5F5F5] flex items-center gap-2 px-4 rounded-md w-full lg:w-1/2 h-10 border border-transparent focus-within:border-[#D9D9D9]">
            <Search size={18} className="text-[#7D7D7D]" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="search"
              placeholder="Search"
              className="bg-transparent outline-none w-full text-sm text-[#1E1E1E] placeholder:text-[#7D7D7D]"
            />
          </div>

          {/* Filters - Below search on Tablet, Left Aligned */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            {/* Status Filter */}
            <Select value={clientStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[140px] bg-[#E0E0E0] text-[#1E1E1E] border border-[#C0C0C0] h-9 rounded-md text-sm font-medium">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="All status">All Status</SelectItem>
                <SelectItem value="registered">Registered</SelectItem>
                <SelectItem value="unregistered">Unregistered</SelectItem>
              </SelectContent>
            </Select>

            {/* Balance Filter */}
            <Select value={clientBalance} onValueChange={handleBalanceChange}>
              <SelectTrigger className="w-[150px] bg-[#E0E0E0] text-[#1E1E1E] border border-[#C0C0C0] h-9 rounded-md text-sm font-medium">
                <SelectValue placeholder="All Balances" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="All Balances">All Balances</SelectItem>
                <SelectItem value="PURCHASE">Purchase</SelectItem>
                <SelectItem value="PICKUP">Pickup</SelectItem>
                <SelectItem value="DEPOSIT">Deposit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Desktop View: Table */}
        <div className="hidden lg:block">
          <ClientDirectory
            searchTerm={searchTerm}
            filteredClientsData={filteredClients}
            onClientAction={onClientAction}
            actionLabel="view"
            isStaffView={false}
          />
        </div>

        {/* Tablet/Mobile View: List/Cards (Matches screenshot) */}
        <div className="block lg:hidden">
          <ClientDirectoryMobile
            searchTerm={searchTerm}
            filteredClientsData={filteredClients}
            onClientAction={onClientAction}
            actionLabel="view"
            isStaffView={false}
          />
        </div>
      </section>

      <AddClientDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </main>
  );
};

export default Clients;