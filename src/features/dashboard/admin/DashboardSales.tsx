//components
import DashboardTitle from "../shared/DashboardTitle";
import SalesAnalytics from "./components/AdminSales/SalesAnalytics";
import SalesTableData from "./components/AdminSales/SalesTableData";
import Stats from "../shared/Stats";

// libs
// import { toast } from "sonner";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";

// stores
import { useTransactionsStore } from "@/stores/useTransactionStore";
import { useClientStore } from "@/stores/useClientStore";

// types
import type { StatCard } from "@/types/stats";
import { useMemo } from "react";

//hooks
import usePagination from "@/hooks/usePagination";

// ui
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// icons
import { ChevronLeft, ChevronRight } from "lucide-react";

const todaysMetrics = {
  totalSales: 475200,
  transactionCount: 28,
  activeClients: 42,
  averageTransaction: 16971,
};

const topProducts = [
  {
    prodName: "cement",
    soldUnit: 320,
    revenue: 960000,
    category: "construction",
  },
  {
    prodName: "Rod",
    soldUnit: 190,
    revenue: 285000,
    category: "Reinforcement",
  },
  {
    prodName: "Tiles",
    soldUnit: 100,
    revenue: 280000,
    category: "Finishing",
  },
];

const DashboardSales = () => {
  const { transactions } = useTransactionsStore();
  const { getClientById, getActiveClients } = useClientStore();

  const activeClients = getActiveClients();

  const stats: StatCard[] = [
    {
      heading: "Total Sales (Today)",
      salesValue: 450000,
      format: "currency",
      hideArrow: true,
    },
    {
      heading: "Total transactions",
      salesValue: `${transactions?.length || 0}`,
      hideArrow: true,
    },
    {
      heading: "Active Clients",
      salesValue: `${activeClients}`,
      hideArrow: true,
      salesColor: "green",
    },
    {
      heading: "Avg. Transactions",
      salesValue: 40000,
      format: "currency",
      hideArrow: true,
      salesColor: "orange",
    },
  ];

  const mergedTransactions = useMemo(() => {
    return (transactions ?? []).map((transaction) => {
      // const clientId = transaction.clientId?._id;
      const clientId =
        typeof transaction.clientId === "string"
          ? transaction.clientId
          : transaction.clientId?._id;
      const client = clientId ? getClientById(clientId) : null;

      return {
        ...transaction,
        client,
      };
    });
  }, [transactions, getClientById]);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    goToPreviousPage,
    goToNextPage,
    canGoPrevious,
    canGoNext,
  } = usePagination((mergedTransactions ?? []).length, 5);

  const currentTransaction = useMemo(() => {
    const startIndex = (currentPage - 1) * 5;
    const endIndex = startIndex + 5;
    return mergedTransactions?.slice(startIndex, endIndex);
  }, [mergedTransactions, currentPage]);

  const handleExportExcel = () => {
    const data =
      mergedTransactions &&
      mergedTransactions.map((txn) => ({
        Time: new Date(txn.createdAt).toTimeString(),
        Name: txn.clientId?.name || txn.walkInClient?.name,
        Items: txn.items,
        Amount: txn.total,
        Staff: txn.userId.name,
      }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales");
    XLSX.writeFile(workbook, "sales_export.xlsx");
    toast.success("Downloaded Successfully!");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    const columns = [
      {
        header: "Time",
        dataKey: "time",
      },
      { header: "Name", dataKey: "clientName" },
      { header: "Items", dataKey: "items" },
      { header: "Amount", dataKey: "amount" },
      { header: "Staff", dataKey: "staff" },
    ];

    const rows = (mergedTransactions ?? []).map((txn) => ({
      time: new Date(txn.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      clientName: txn.clientId?.name || txn.walkInClient?.name || "N/A",
      items: txn.items
        .map((item) => `${item.quantity}x ${item.productName}`)
        .join(", "),
      amount: txn.total.toLocaleString(),
      staff: txn.userId.name || "N/A",
    }));

    // const rows = (mergedTransactions ?? []).map((txn) => [
    //   new Date(txn.createdAt).toTimeString(),
    //   txn.clientId?.name || txn.walkInClient?.name,
    //   txn.items,
    //   txn.total.toLocaleString(),
    //   txn.userId.name,
    // ]);

    doc.text("Sales Export", 14, 16);
    autoTable(doc, {
      startY: 22,
      columns,
      body: rows,
      styles: {
        fontSize: 9,
      },
      headStyles: { fillColor: [44, 204, 113] },
    });
    doc.save("sales_export.pdf");
    toast.success("Downloaded Successfully!");
  };

  return (
    <main>
      <DashboardTitle
        heading="Sales Management"
        description="Process orders & manage customer purchases"
      />
      <section>
        <div className="flex gap-[24px] items-end justify-end">
          <Button
            variant="secondary"
            onClick={handleExportExcel}
            className="bg-white border border-[#7d7d7d]"
          >
            Download Excel
          </Button>
          <Button onClick={handleExportPDF}>Export PDF</Button>
        </div>
        <Stats data={stats} />

        <div className="mt-10">
          <SalesAnalytics metrics={todaysMetrics} topProduct={topProducts} />
        </div>

        <div className="bg-white rounded-2xl shadow-xl">
          <SalesTableData
            currentTransaction={currentTransaction}
            setCurrentPage={setCurrentPage}
          />
          {/* pagination */}
          {currentTransaction &&
            currentTransaction?.length > 0 &&
            totalPages > 1 && (
              <div className="h-14 bg-[#f5f5f5] text-sm text-[#7D7D7D] flex justify-center items-center gap-3">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={canGoPrevious ? goToPreviousPage : undefined}
                        className={
                          !canGoPrevious
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                        aria-label="Go to previous page"
                      >
                        <Button
                          disabled={!canGoPrevious}
                          className="border border-[#d9d9d9] rounded"
                        >
                          <ChevronLeft size={14} />
                        </Button>
                      </PaginationPrevious>
                    </PaginationItem>
                    <PaginationItem className="px-4 text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </PaginationItem>
                    <PaginationNext
                      onClick={canGoNext ? goToNextPage : undefined}
                      className={
                        !canGoNext
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                      aria-label="Go to next page"
                    >
                      <Button className="border border-[#d9d9d9] rounded">
                        <ChevronRight size={14} />
                      </Button>
                    </PaginationNext>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
        </div>
      </section>
    </main>
  );
};

export default DashboardSales;
