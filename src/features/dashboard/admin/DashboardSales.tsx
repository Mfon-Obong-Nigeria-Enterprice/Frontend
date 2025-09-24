import { useNavigate } from "react-router-dom";

//components
import DashboardTitle from "../shared/DashboardTitle";
import SalesAnalytics from "../shared/TopSellingProducts";
import SalesTableData from "./components/AdminSales/SalesTableData";
import Stats from "../shared/Stats";

// libs
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
import { formatChangeText, getChangeText } from "@/utils/helpersfunction";
import SalesByCategoryChart from "../shared/CategoryTransactionChart";
import { formatCurrency } from "@/utils/formatCurrency";

const DashboardSales = () => {
  const navigate = useNavigate();
  const {
    transactions,
    getTodaysSales,
    getSalesPercentageChange,
    getTodaysTransactionCount,
    getTodaysTransactionCountPercentageChange,
    getThisWeekAverageTransaction,
    getWeeklyAverageTransactionPercentageChange,
  } = useTransactionsStore();
  const { getClientById, getActiveClients, getTotalClientsPercentageChange } =
    useClientStore();

  const activeClients = getActiveClients();
  const todaysSales = getTodaysSales();
  const dailyChange = getSalesPercentageChange();
  const totalClientsChange = getTotalClientsPercentageChange();
  const todaysTransactionCount = getTodaysTransactionCount();
  const transactionCountChange = getTodaysTransactionCountPercentageChange();
  const thisWeekAvgTransaction = getThisWeekAverageTransaction();
  const weeklyAvgTransactionChange =
    getWeeklyAverageTransactionPercentageChange();

  const stats: StatCard[] = [
    {
      heading: "Total Sales (Today)",
      salesValue: formatCurrency(todaysSales),
      statValue: getChangeText(
        dailyChange.percentage,
        dailyChange.direction,
        "yesterday"
      ),
      color:
        dailyChange.direction === "increase"
          ? "green"
          : dailyChange.direction === "decrease"
          ? "red"
          : "orange",
      hideArrow: true,
    },
    {
      heading: "Transactions",
      salesValue: `${todaysTransactionCount}`, // Updated to use today's count
      statValue: formatChangeText(transactionCountChange, " yesterday"), // Add percentage change
      color:
        transactionCountChange.direction === "increase"
          ? "green"
          : transactionCountChange.direction === "decrease"
          ? "red"
          : "blue",
      hideArrow: false, // Show arrow since we now have percentage change
    },
    {
      heading: "Active Clients",
      salesValue: `${activeClients}`,
      hideArrow: true,
      statValue: formatChangeText(totalClientsChange, "last month"),
      color:
        totalClientsChange.direction === "increase"
          ? "green"
          : totalClientsChange.direction === "decrease"
          ? "red"
          : "blue",
    },
    {
      heading: "Avg. Transactions",
      salesValue: thisWeekAvgTransaction,
      format: "currency",
      statValue: formatChangeText(weeklyAvgTransactionChange, "last week"),
      color:
        weeklyAvgTransactionChange.direction === "increase"
          ? "green"
          : weeklyAvgTransactionChange.direction === "decrease"
          ? "red"
          : "orange",
      hideArrow: false,
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
    <main className="w-full max-w-full overflow-x-hidden">
      <DashboardTitle
        heading="Sales Management"
        description="Process orders & manage customer purchases"
      />
      <section className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end justify-end mb-5 px-2">
          <Button variant="tertiary" onClick={handleExportExcel} className="w-full sm:w-auto">
            Download Excel
          </Button>
          <Button variant="tertiary" onClick={handleExportPDF} className="w-full sm:w-auto">
            Export PDF
          </Button>
          <Button onClick={() => navigate("/admin/dashboard/sale")} className="w-full sm:w-auto">
            Add Sales
          </Button>
        </div>
        <Stats data={stats} />

        <div className="grid grid-cols-1 xl:grid-cols-5 items-start gap-5 my-8 px-2">
          <div className="xl:col-span-3 w-full">
            <SalesAnalytics />
          </div>
          <div className="bg-white w-full p-4 sm:p-6 lg:p-7 border border-[#d9d9d9] rounded-xl xl:col-span-2">
            <h4 className="text-lg sm:text-xl font-medium text-[#1E1E1E] pb-4">
              Sales by Category
            </h4>
            <SalesByCategoryChart />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl mx-2 overflow-hidden">
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
