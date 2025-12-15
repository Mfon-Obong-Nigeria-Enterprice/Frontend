/** @format */

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClientStore } from "@/stores/useClientStore";
import { useTransactionsStore } from "@/stores/useTransactionStore";

import ClientDetailInfo from "@/components/clients/ClientDetailInfo";
import { mergeTransactionsWithClients } from "@/utils/mergeTransactionsWithClients";
import { ClientTransactionDetails } from "@/components/clients/ClientTransactionDetails";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientDiscountDetails from "@/components/clients/ClientDiscountDetails";
import { DateFromToPicker } from "@/components/DateFromToPicker";

import { useAuthStore } from "@/stores/useAuthStore";
import DeleteClientDialog from "@/features/dashboard/manager/component/DeleteClientDialog";
import EditClientDialog from "@/features/dashboard/manager/component/EditClientDialog";
import { toast } from "react-toastify";
import BlockUnblockClient from "@/features/dashboard/manager/BlockUnblockClient";
import jsPDF from "jspdf";
import { getAllTransactions } from "@/services/transactionService";
import { useQuery } from "@tanstack/react-query";
import { getTransactionDate } from "@/utils/transactions";
import { calculateTransactionsWithBalance } from "@/utils/calculateOutstanding";

import type { DateRange } from "react-day-picker";

interface ClientDetailsPageProps {
  isManagerView?: boolean;
}

const ClientDetailsPage: React.FC<ClientDetailsPageProps> = ({
  isManagerView = false,
}) => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  //store
  const { clients } = useClientStore();
  const { transactions, setTransactions } = useTransactionsStore();
  // Get user from auth store
  const { user } = useAuthStore();

  // Determine if current user is a manager/super_admin
  const isManager = useMemo(() => {
    if (isManagerView) return true;
    if (!user || !user.role) return false;

    const normalizedRole = user.role.toString().trim().toUpperCase();
    return (
      normalizedRole === "SUPER_ADMIN" ||
      normalizedRole === "ADMIN" ||
      normalizedRole === "MAINTAINER"
    );
  }, [user, isManagerView]);

  const { data: fetchedTransactions, isLoading: transactionsLoading } =
    useQuery({
      queryKey: ["transactions", user?.branchId],
      queryFn: getAllTransactions,
      enabled: !!user?.branchId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true,
    });

  // Update store when data is fetched
  useEffect(() => {
    if (fetchedTransactions) {
      setTransactions(fetchedTransactions);
    }
  }, [fetchedTransactions, setTransactions]);

  // Filter states
  const [transactionTypeFilter, setTransactionTypeFilter] =
    useState<string>("all");
  const [staffFilter, setStaffFilter] = useState<string>("all-staff");
  // Use a DateRange like in Transactions component
  const [dateRangeFilter, setDateRangeFilter] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [showDialog, setShowDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showBlockUnblockDialog, setShowBlockUnblockDialog] = useState(false);

  //
  const mergedTransactions = useMemo(() => {
    if (!transactions || !clients) return [];
    const merged = mergeTransactionsWithClients(transactions, clients);

    return merged;
  }, [transactions, clients]);

  //get Clients
  const client = useMemo(() => {
    if (!clients || !clientId) return null;
    return clients.find((c) => c._id === clientId) || null;
  }, [clients, clientId]);
  //

  // Check if client is blocked
  const isClientBlocked = useMemo(() => {
    return client?.isActive === false;
  }, [client]);

  // Fix auto-scroll issue
  useEffect(() => {
    // Prevent auto-scroll on page load
    const preventAutoScroll = () => {
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    // Run immediately
    preventAutoScroll();
    // Also run after a short delay to catch any delayed scrolling
    const timeoutId = setTimeout(preventAutoScroll, 100);
    return () => clearTimeout(timeoutId);
  }, [clientId]); //reruns when clientId changes

  //
  const clientTransactions = useMemo(() => {
    if (!clientId) return [];
    let filtered = mergedTransactions.filter(
      (t) => t.client?._id === clientId
    );

    // Apply transaction type filter
    if (transactionTypeFilter !== "all") {
      const typeMap: { [key: string]: string } = {
        purchase: "PURCHASE",
        "pick-up": "PICKUP",
        pickup: "PICKUP",
        deposit: "DEPOSIT",
      };

      const filterType = typeMap[transactionTypeFilter];
      if (filterType) {
        filtered = filtered.filter((t) => t.type === filterType);
      }
    }

    if (staffFilter !== "all-staff") {
      filtered = filtered.filter((t) => t.userId?.name === staffFilter);
    }

    // dateRangeFilter logic using getTransactionDate for backdated transactions
    if (dateRangeFilter.from && dateRangeFilter.to) {
      filtered = filtered.filter((t) => {
        const txDate = getTransactionDate(t);
        const fromDate = new Date(dateRangeFilter.from!);
        const toDate = new Date(dateRangeFilter.to!);

        // Set time to start/end of day for accurate comparison
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(23, 59, 59, 999);

        return txDate >= fromDate && txDate <= toDate;
      });
    } else if (dateRangeFilter.from) {
      const fromDate = new Date(dateRangeFilter.from);
      fromDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter((t) => getTransactionDate(t) >= fromDate);
    } else if (dateRangeFilter.to) {
      const toDate = new Date(dateRangeFilter.to);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter((t) => getTransactionDate(t) <= toDate);
    }

    return filtered.sort(
      (a, b) =>
        getTransactionDate(b).getTime() - getTransactionDate(a).getTime()
    );
  }, [
    clientId,
    dateRangeFilter,
    mergedTransactions,
    transactionTypeFilter,
    staffFilter,
  ]);

  const transactionsWithBalance = useMemo(() => {
    if (!client) return [];
    return calculateTransactionsWithBalance(clientTransactions, {
      balance: client.balance,
    });
  }, [clientTransactions, client]);

  // --- PDF GENERATION LOGIC ---
  const handleExportPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15;
    let cursorY = 20;

    const formatCurrencyForPDF = (amount: number) => {
      const val = new Intl.NumberFormat("en-NG", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Math.abs(amount));
      return `N${val}`;
    };

    const formatDate = (date: Date) => {
      return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "numeric",
        year: "2-digit",
      });
    };

    const checkPageBreak = (neededHeight: number) => {
      if (cursorY + neededHeight > pageHeight - margin) {
        doc.addPage();
        cursorY = margin;
        return true;
      }
      return false;
    };

    // --- 1. HEADER ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(33, 33, 33);
    doc.text("Account Statement", pageWidth / 2, cursorY, { align: "center" });
    cursorY += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.text("Materials Supply Record", pageWidth / 2, cursorY, { align: "center" });
    cursorY += 5;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.line(margin, cursorY, pageWidth - margin, cursorY);
    cursorY += 10;

    // --- DATA ---
    const sortedTxns = [...transactionsWithBalance].sort(
      (a, b) =>
        getTransactionDate(a).getTime() - getTransactionDate(b).getTime()
    );

    const firstTxn = sortedTxns[0];
    const initialBalance = firstTxn
      ? (firstTxn.balanceBefore as number) ?? 0
      : client?.balance || 0;

    const supplies = sortedTxns.filter(
      (t) => t.type === "PURCHASE" || t.type === "PICKUP"
    );
    const deductions = sortedTxns.filter(
      (t) => t.type === "DEPOSIT" || t.type === "RETURN"
    );

    // --- 2. B/F ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(51, 51, 51);

    // Insert UserName on the far right
    doc.text(client?.name || "", pageWidth - margin, cursorY, { align: "right" });

    cursorY += 6;

    // Transaction History text
    let dateRangeText = "";
    const startDate = dateRangeFilter.from || (sortedTxns.length > 0 ? getTransactionDate(sortedTxns[0]) : new Date());
    const endDate = dateRangeFilter.to || (sortedTxns.length > 0 ? getTransactionDate(sortedTxns[sortedTxns.length - 1]) : new Date());

    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    const startMonth = startDate.toLocaleDateString("en-US", { month: "long" });
    const endMonth = endDate.toLocaleDateString("en-US", { month: "long" });

    if (startYear === endYear) {
      dateRangeText = startMonth === endMonth ? `${startMonth}, ${startYear}` : `${startMonth} - ${endMonth}, ${startYear}`;
    } else {
      dateRangeText = `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
    }
    doc.setFont("helvetica", "bold");
    doc.text(`Transaction History, ${dateRangeText}`, margin, cursorY);
    cursorY += 10;

    doc.setFillColor(248, 235, 235);
    doc.rect(margin, cursorY, pageWidth - margin * 2, 10, "F");
    doc.setFillColor(231, 76, 60);
    doc.rect(margin, cursorY, 1.5, 10, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(51, 51, 51);
    const bfDate = dateRangeFilter.from
      ? formatDate(dateRangeFilter.from)
      : sortedTxns.length > 0
      ? formatDate(getTransactionDate(sortedTxns[0]))
      : formatDate(new Date());
    doc.text(
      `B/F Debt - ${bfDate}: ${formatCurrencyForPDF(initialBalance)}`,
      margin + 4,
      cursorY + 6.5
    );
    cursorY += 18;

    // --- 3. SUPPLIES LOOP ---
    let runningTotalForGrand = initialBalance;

    supplies.forEach((txn) => {
      // Lookup raw transaction to ensure fields exist
      const rawTxn = mergedTransactions.find((t) => t._id === txn._id) || txn;
      const t = rawTxn as any;

      const transactionTotal = Number(t.total) || 0;
      runningTotalForGrand += transactionTotal;

      // Calculate Items Subtotal
      let itemsTotal = 0;
      if (t.items && t.items.length > 0) {
        itemsTotal = t.items.reduce(
          (sum: number, item: any) =>
            sum + (item.quantity || 0) * (item.unitPrice || 0),
          0
        );
      } else {
        itemsTotal = Number(t.subtotal) || transactionTotal;
      }

      // Identify Specific Charges
      const charges = [];
      const loading = Number(t.loading) || 0;
      const transport = Number(t.transportFare) || 0;
      const loadingOffloading = Number(t.loadingAndOffloading) || 0;

      if (loading > 0) charges.push({ label: "Loading", amount: loading });
      if (transport > 0) charges.push({ label: "Transport", amount: transport });
      if (loadingOffloading > 0)
        charges.push({ label: "Loading/Offloading", amount: loadingOffloading });

      const discount = Number(t.discount) || 0;

      // --- DISCREPANCY CHECK ---
      // We calculate what the total *should* be:
      const calculatedExpectedTotal = itemsTotal + loading + transport + loadingOffloading - discount;
      
      // We compare it to the actual total stored in DB
      const discrepancy = transactionTotal - calculatedExpectedTotal;

      // If there is a meaningful difference (positive), we treat it as "Other Charges"
      if (discrepancy > 1) {
         charges.push({ label: "Other Charges", amount: discrepancy });
      }

      // --- RENDERING ---
      const headerHeight = 8;
      const itemLineHeight = 6;
      const chargesLineHeight = 6;
      const discountLineHeight = 6;
      const subTotalHeight = 10;
      const itemsCount = txn.items?.length || 1;

      let totalBlockHeight =
        headerHeight +
        itemsCount * itemLineHeight +
        charges.length * chargesLineHeight +
        subTotalHeight +
        5;

      if (discount > 0) totalBlockHeight += discountLineHeight;

      checkPageBreak(totalBlockHeight);

      // Header
      doc.setFillColor(246, 246, 246);
      doc.rect(margin, cursorY, pageWidth - margin * 2, headerHeight, "F");
      doc.setFillColor(51, 51, 51);
      doc.rect(margin, cursorY, 1.5, headerHeight, "F");

      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 51, 51);
      doc.text(
        `Materials Supplied on ${formatDate(getTransactionDate(txn))}`,
        margin + 4,
        cursorY + 5.5
      );
      cursorY += headerHeight + 3;

      // Items
      doc.setFontSize(8);
      doc.setTextColor(80, 80, 80);

      if (txn.items && txn.items.length > 0) {
        txn.items.forEach((item) => {
          const qty = item.quantity || 0;
          const price = item.unitPrice || 0;
          const itemText = `(${qty}) ${
            item.productName?.toUpperCase() || "ITEM"
          } @ ${formatCurrencyForPDF(price)}`;
          doc.text(itemText, margin + 4, cursorY);
          doc.text(
            formatCurrencyForPDF(qty * price),
            pageWidth - margin - 4,
            cursorY,
            { align: "right" }
          );
          cursorY += itemLineHeight;
        });
      } else {
        doc.text(txn.description || "Items supplied", margin + 4, cursorY);
        doc.text(
          formatCurrencyForPDF(itemsTotal),
          pageWidth - margin - 4,
          cursorY,
          { align: "right" }
        );
        cursorY += itemLineHeight;
      }

      // Charges (Loading, Transport, Other Charges)
      doc.setTextColor(80, 80, 80);
      charges.forEach((charge) => {
        doc.text(charge.label, margin + 4, cursorY);
        doc.text(
          formatCurrencyForPDF(charge.amount),
          pageWidth - margin - 4,
          cursorY,
          { align: "right" }
        );
        cursorY += chargesLineHeight;
      });

      // Discount
      if (discount > 0) {
        doc.setTextColor(80, 80, 80); 
        doc.text("Discount", margin + 4, cursorY);
        doc.text(
          `-${formatCurrencyForPDF(discount)}`,
          pageWidth - margin - 4,
          cursorY,
          { align: "right" }
        );
        cursorY += discountLineHeight;
      }

      // Subtotal
      doc.setFillColor(246, 246, 246);
      doc.rect(margin, cursorY, pageWidth - margin * 2, subTotalHeight, "F");
      doc.setFont("helvetica", "bold");
      doc.setTextColor(51, 51, 51);
      doc.text(
        `SUB TOTAL: ${formatCurrencyForPDF(transactionTotal)}`,
        pageWidth - margin - 4,
        cursorY + 6.5,
        { align: "right" }
      );
      cursorY += subTotalHeight + 6;
    });

    // --- 4. GRAND TOTAL ---
    checkPageBreak(15);
    doc.setFillColor(68, 68, 68);
    doc.rect(margin, cursorY, pageWidth - margin * 2, 12, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(
      `GRAND TOTAL: ${formatCurrencyForPDF(runningTotalForGrand)}`,
      pageWidth - margin - 4,
      cursorY + 8,
      { align: "right" }
    );
    cursorY += 18;

    // --- 5. LESS SECTION ---
    const lessSectionHeaderHeight = 10;
    checkPageBreak(lessSectionHeaderHeight + 5);

    doc.setFillColor(249, 249, 249);
    doc.rect(margin, cursorY, pageWidth - margin * 2, lessSectionHeaderHeight, "F");
    doc.setFillColor(150, 150, 150);
    doc.rect(margin, cursorY, 1.5, lessSectionHeaderHeight, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(51, 51, 51);
    doc.text("Less:", margin + 5, cursorY + 7);
    cursorY += lessSectionHeaderHeight;

    let totalDeductions = 0;
    deductions.forEach((txn) => {
      const rawTxn = mergedTransactions.find((t) => t._id === txn._id) || txn;
      const t = rawTxn as any;
      const amount = Number(t.total) || 0;
      totalDeductions += amount;
      const displayItems = [];
      if (t.type === "RETURN" && t.items && t.items.length > 0) {
        t.items.forEach((item: any) => {
          const itemAmount = (item.quantity || 0) * (item.unitPrice || 0);
          displayItems.push({
            description: `(${item.quantity}) ${item.productName?.toUpperCase() || "PRODUCT"} (RETURNED): `,
            value: formatCurrencyForPDF(itemAmount),
            isReturn: true,
          });
        });
      } else if (t.type === "RETURN") {
        displayItems.push({
          description: `(1) ITEM (RETURNED): `,
          value: formatCurrencyForPDF(amount),
          isReturn: true,
        });
      } else {
        displayItems.push({
          description: `Deposited: `,
          value: formatCurrencyForPDF(amount),
          isReturn: false,
        });
      }

      displayItems.forEach((item) => {
        const itemHeight = 18;
        checkPageBreak(itemHeight);

        // Background for item
        doc.setFillColor(224, 224, 224);
        doc.rect(margin, cursorY, pageWidth - margin * 2, itemHeight, "F");
        doc.setFillColor(150, 150, 150);
        doc.rect(margin, cursorY, 1.5, itemHeight, "F");

        // Date Pill
        doc.setFillColor(224, 224, 224);
        doc.rect(margin + 5, cursorY + 2, 35, 6, "F");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(51, 51, 51);
        doc.text(`On ${formatDate(getTransactionDate(txn))}`, margin + 7, cursorY + 6);

        // Description & Value
        doc.setFontSize(9);
        const descriptionWidth = (doc.getStringUnitWidth(item.description) * doc.getFontSize()) / doc.internal.scaleFactor;
        const startX = margin + 7;
        const textY = cursorY + 12;

        if (item.isReturn) {
          doc.setTextColor(68, 68, 68);
          doc.text(item.description, startX, textY);
          doc.setTextColor(231, 76, 60);
          doc.text(item.value, startX + descriptionWidth, textY);
        } else {
          doc.setTextColor(68, 68, 68);
          doc.text(item.description, startX, textY);
          doc.setTextColor(46, 204, 113);
          doc.text(item.value, startX + descriptionWidth, textY);
        }

        doc.setDrawColor(230, 230, 230);
        doc.line(margin + 5, cursorY + 16, pageWidth - margin - 5, cursorY + 16);
        cursorY += itemHeight;
      });
    });
    cursorY += 5;

    // --- 6. BALANCE ---
    checkPageBreak(12);
    const finalBalance = runningTotalForGrand - totalDeductions;
    doc.setFillColor(248, 235, 235);
    doc.rect(margin, cursorY, pageWidth - margin * 2, 12, "F");
    doc.setFillColor(231, 76, 60);
    doc.rect(margin, cursorY, 1.5, 12, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(51, 51, 51);
    doc.text(`BALANCE: ${formatCurrencyForPDF(finalBalance)}`, pageWidth - margin - 4, cursorY + 8, { align: "right" });

    // --- FOOTER ---
    const footerY = pageHeight - 15;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, footerY, pageWidth - margin, footerY);
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.text("This is a system-generated statement", pageWidth / 2, footerY + 4, { align: "center" });
    doc.text("For inquiries, please contact your account manager", pageWidth / 2, footerY + 8, { align: "center" });
    doc.text(`Statement Date: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`, pageWidth / 2, footerY + 12, { align: "center" });

    doc.save(`Statement_${client?.name || "Client"}.pdf`);
  };

  // Get unique staff members for filter dropdown
  const staffMembers = useMemo(() => {
    const uniqueStaff = Array.from(
      new Set(
        mergedTransactions
          .filter((t) => t.client?._id === clientId)
          .map((t) => t.userId?.name)
          .filter(Boolean)
      )
    );
    return uniqueStaff;
  }, [mergedTransactions, clientId]);

  const handleSelection = (value: string) => {
    switch (value) {
      case "edit":
        setShowEditDialog(true);
        break;
      case "suspend":
      case "unsuspend":
        setShowBlockUnblockDialog(true);
        break;
      case "delete":
        setShowDialog(true);
        break;
      default:
        break;
    }
  };

  const handleBlockUnblockSuccess = () => {
    const action = isClientBlocked ? "unblocked" : "blocked";
    toast.success(`Client ${action} successfully`);
  };

  const handleDeleteSuccess = () => {
    toast.success(`${client?.name} deleted successfully `);
    navigate(-1);
  };
  const handleEditSuccess = () => {
    toast.success(`${client?.name} edited successfully `);
  };

  const handleApplyFilters = () => {
    // Filters are applied automatically via useMemo
  };

  // Loading states
  if (transactionsLoading || !clients || clients.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2ECC71] mx-auto mb-4"></div>
          <p>Loading data...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Client not found</h2>
          <p className="text-gray-600 mb-4">
            The client you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate(-1)}>Back to Clients</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="grid md:grid-cols-5 grid-cols-1 items-center  md:px-10 sticky top-0 bg-white z-10 border-b border-[#D9D9D9]">
        <div className="flex gap-5 justify-between md:justify-start col-span-2 md:col-span-2 px-5 md:px-0">
          <button
            onClick={() => navigate(-1)}
            className="flex gap-1 items-center text-[#7D7D7D] cursor-pointer"
          >
            <ChevronLeft />
            <span>Back</span>
          </button>
          <p className="lg:text-lg text-sm text-[#1E1E1E]">
            Client Account Management
          </p>
        </div>
        <div className="flex justify-end gap-4 my-2 md:mx-7 col-span-3 md:col-span-3 border-t-[#D9D9D9] md:border-none border-t-2 pt-2 md:pt-0 transition-all px-5 md:px-0">
          <Button
            className="bg-white hover:bg-gray-100 text-text-dark border border-[#7D7D7D]"
            onClick={handleExportPDF}
          >
            <ChevronUp />
            <span>Export data</span>
          </Button>
          {isManager && (
            <Select onValueChange={handleSelection}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Edit Client"></SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel></SelectLabel>
                  <SelectItem value="edit">Edit Client</SelectItem>
                  <SelectItem value={isClientBlocked ? "unsuspend" : "suspend"}>
                    {isClientBlocked ? "Unsuspend Client" : "Suspend Client"}
                  </SelectItem>
                  <SelectItem value="delete">Delete Client</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </div>
      </header>

      {/* main content */}
      <main className="grid gap-3 bg-[#F5F5F5] py-5 px-3 md:px-9 grid-cols-1 lg:grid-cols-5">
        {/* section by the left */}
        <div className=" lg:col-span-2">
          <ClientDetailInfo client={client} />
        </div>

        {/* section by the right */}
        <section className="lg:-translate-x-28 max-w-[793px] bg-white py-8 px-5 rounded lg:col-span-3">
          <Tabs className="space-y-4" defaultValue="clientTransaction">
            <TabsList className="flex gap-2 lg:justify-start justify-evenly ">
              <TabsTrigger value="clientTransaction">Transaction</TabsTrigger>
              <TabsTrigger value="clientDiscount">Discount</TabsTrigger>
            </TabsList>

            <TabsContent value="clientTransaction">
              {/* data */}
              <div className="md:flex justify-start items-center w-full gap-4 md:gap-1  lg:gap-2 mb-10">
                <div className="flex flex-col justify-end transition-all w-full h-full">
                  <DateFromToPicker
                    date={dateRangeFilter}
                    onDateChange={(range) =>
                      setDateRangeFilter(range || { from: undefined, to: undefined })
                    }
                  />
                </div>

                <div className="flex flex-col  sm:w-[179px] md:w-[179px] transition-all w-full ">
                  <label className="mb-2 text-xs font-medium text-[#7D7D7D]">
                    Transaction type
                  </label>
                  <Select
                    value={transactionTypeFilter}
                    onValueChange={setTransactionTypeFilter}
                  >
                    <SelectTrigger className="sm:w-[179px] md:w-[179px] transition-all w-full">
                      <SelectValue placeholder="All Transactions" />
                    </SelectTrigger>
                    <SelectContent className="text-[#444444]">
                      <SelectItem value="all">All transactions</SelectItem>
                      <SelectItem value="purchase">Purchase</SelectItem>
                      <SelectItem value="pick-up">Pick-up</SelectItem>
                      <SelectItem value="deposit">Deposit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col  sm:w-[230px] md:w-[210px] transition-all w-full">
                  <label className="mb-2 text-xs font-medium text-[#7D7D7D]">
                    Staff member
                  </label>
                  <Select value={staffFilter} onValueChange={setStaffFilter}>
                    <SelectTrigger className="sm:w-[126px] md:w-[126px] transition-all w-full">
                      <SelectValue placeholder="All Staff" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-staff">All Staff</SelectItem>
                      {staffMembers.map((staff) => (
                        <SelectItem key={staff} value={staff}>
                          {staff}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col md:items-center sm:w-[101px] md:w-[101px] lg:w-[101px] transition-all w-full">
                  <Button
                    className="mt-6 max-w-[101px]  bg-[#2ECC71] hover:bg-[#27ae60] text-white font-medium  sm:w-[230px] md:w-[210px] transition-all w-full "
                    onClick={handleApplyFilters}
                  >
                    Apply filters
                  </Button>
                </div>
              </div>

              <ClientTransactionDetails
                clientTransactions={transactionsWithBalance}
                client={{ balance: client.balance }}
              />
            </TabsContent>
            <TabsContent value="clientDiscount">
              <ClientDiscountDetails clientTransactions={clientTransactions} />
            </TabsContent>
          </Tabs>
        </section>
      </main>
      <DeleteClientDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        client={client}
        onDeleteSuccess={handleDeleteSuccess}
      />
      <EditClientDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        client={client}
        onEditSuccess={handleEditSuccess}
      />

      <BlockUnblockClient
        open={showBlockUnblockDialog}
        onOpenchange={setShowBlockUnblockDialog}
        client={client}
        isBlocked={isClientBlocked}
        onSuccess={handleBlockUnblockSuccess}
      />
    </>
  );
};

export default ClientDetailsPage;