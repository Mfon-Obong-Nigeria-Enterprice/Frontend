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
import autoTable from "jspdf-autotable";
import { formatCurrency } from "@/utils/formatCurrency";
import { getAllTransactions } from "@/services/transactionService";
import { useQuery } from "@tanstack/react-query";
import { calculateTransactionsWithBalance } from "@/utils/calculateOutstanding";
import {
  getTransactionDate,
  getTransactionDateString,
  getTransactionTimeString,
} from "@/utils/transactions";

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

  // --- PDF GENERATION LOGIC ---
  const handleExportPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Custom currency formatter for PDF to ensure 'NGN' is used instead of symbols
    // that are not supported by the PDF's default font.
    const formatCurrencyForPDF = (amount: number) => {
      return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        currencyDisplay: "code", // Use 'NGN' instead of a symbol
      }).format(amount);
    };

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 14;

    // --- HEADER ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(33, 33, 33);
    doc.text("Client Account Statement", pageWidth / 2, 20, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(125, 125, 125);
    doc.text("Account Management Report", pageWidth / 2, 26, { align: "center" });

    const currentDate = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    // Assuming Period based on filter or current month if not selected, mimicking screenshot
    const periodText = dateRangeFilter.from 
      ? `${dateRangeFilter.from.toLocaleDateString()} - ${dateRangeFilter.to?.toLocaleDateString() || 'Now'}`
      : "May 2025"; // Using screenshot static for fallback/demo match

    doc.setTextColor(125, 125, 125);
    doc.setFontSize(10);
    doc.text(
      `Period: ${periodText} | Generated: ${currentDate}`,
      pageWidth / 2,
      32,
      { align: "center" }
    );

    // Horizontal Line
    doc.setDrawColor(230, 230, 230);
    doc.line(margin + 10, 38, pageWidth - (margin + 10), 38);

    // Section Title
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(51, 51, 51); // #333333
    doc.text(`Transaction History - ${periodText}`, margin, 50);

    // --- DATA PREPARATION ---
    // Calculate balance progression for transactions
    const transactionsWithBalance = calculateTransactionsWithBalance(
        clientTransactions,
        { balance: client?.balance || 0 }
    );

    // Sort by date - NEWEST FIRST (matching visual)
    const sortedTransactions = transactionsWithBalance.sort((a, b) => {
        const dateA = getTransactionDate(a).getTime();
        const dateB = getTransactionDate(b).getTime();
        return dateB - dateA; 
    });

    // Columns Configuration
    const columns = [
        { header: "Date", dataKey: "date" },
        { header: "Status", dataKey: "status" },
        { header: "Products", dataKey: "products" },
        { header: "Subtotal", dataKey: "subtotal" },
        { header: "Amount", dataKey: "amount" },
        { header: "Balance Change", dataKey: "balanceChange" },
        { header: "Method", dataKey: "method" },
        { header: "Charges", dataKey: "charges" },
    ];

    // Map Data
    const tableData = sortedTransactions.map(txn => {
        // Format Products list
        const productList = txn.items && txn.items.length > 0 
            ? txn.items.flatMap(item => [
                `•  ${item.quantity} ${item.unit || 'units'} @ ${formatCurrencyForPDF(item.unitPrice)}`,
                `BOLD::  ${item.productName}` // Prefix to identify bold line
              ])
            : (txn.description ? [txn.description] : ["---"]);

        // Calculate Charges text
        const chargesList = [];
        if(txn.transportFare && txn.transportFare > 0) chargesList.push(`Transport: ${formatCurrencyForPDF(txn.transportFare)}`);
        if(txn.loadingAndOffloading && txn.loadingAndOffloading > 0) chargesList.push(`Loading/Off: ${formatCurrencyForPDF(txn.loadingAndOffloading)}`);
        if(txn.loading && txn.loading > 0) chargesList.push(`Loading: ${formatCurrencyForPDF(txn.loading)}`);
        
        // Format Amount Color logic handled in didDrawCell, just passing raw or string here
        const amountStr = formatCurrencyForPDF(txn.total || 0);
        
        // Format Balance Change "+250,000 -> +200,000"
        const balBefore = formatCurrencyForPDF(txn.balanceBefore || 0);
        const balAfter = formatCurrencyForPDF(txn.balanceAfter || 0);

        return {
            date: getTransactionDate(txn).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            }),
            status: txn.type, // PURCHASE, DEPOSIT, PICKUP
            products: productList,
            subtotal: txn.subtotal ? `Subtotal: ${formatCurrencyForPDF(txn.subtotal)}` : "---",
            amount: txn.type === 'DEPOSIT' ? `+${amountStr}` : `-${amountStr}`,
            balanceChange: `${balBefore} -> \n${balAfter}`,
            method: txn.paymentMethod || "Cash",
            charges: chargesList.length > 0 ? chargesList.join("\n") : "---",
            rawType: txn.type // Hidden key for logic
        };
    });

    // --- TABLE GENERATION ---
    autoTable(doc, {
        startY: 55,
        head: [columns.map(c => c.header)],
        body: tableData.map(row => columns.map(c => row[c.dataKey as keyof typeof row])),
        
        // Styles
        theme: 'grid',
        styles: {
            fontSize: 6,
            font: "helvetica",
            cellPadding: 2,
            textColor: [68, 68, 68], // #444444
            lineColor: [230, 230, 230],
            lineWidth: 0.1,
            valign: 'top'
        },
        headStyles: {
            fillColor: [68, 68, 68], // #444444
            textColor: [255, 255, 255],
            fontSize: 7,
            fontStyle: 'normal',
            halign: 'left',
            cellPadding: { top: 8, bottom: 8, left: 4, right: 4 },
            lineWidth: { top: 0.1, right: 0, bottom: 0.1, left: 0 }
        },
        columnStyles: {
            0: { cellWidth: 20 }, // Date
            1: { cellWidth: 18 }, // Status (Badge)
            2: { cellWidth: 45 }, // Products
            3: { cellWidth: 22 }, // Subtotal
            4: { cellWidth: 22, fontStyle: 'bold' }, // Amount
            5: { cellWidth: 20 }, // Balance Change
            6: { cellWidth: 16 }, // Method
            7: { cellWidth: 'auto' }, // Charges
        },
        
        // Hooks for Custom Rendering
        didDrawCell: (data) => {
            // Custom drawing for Products column to handle bolding
            if (data.section === 'body' && data.column.index === 2) {
                const cellText = data.cell.raw;
                if (Array.isArray(cellText)) {
                    const { x, y, width, height } = data.cell;
                    const leftPadding = data.cell.padding('left');
                    const topPadding = data.cell.padding('top');
                    let currentY = y + topPadding;

                    // Erase the default content autotable would have drawn
                    // We draw a white rectangle slightly smaller than the cell to avoid covering the borders
                    const lineWidth = doc.getLineWidth();
                    doc.setFillColor(255, 255, 255);
                    // 'F' fills the rectangle. We offset by lineWidth to avoid painting over the cell borders.
                    doc.rect(x + lineWidth, y + lineWidth, width - (lineWidth * 2), height - (lineWidth * 2), 'F');

                    // Manually draw each line, checking for our BOLD prefix
                    cellText.forEach((line: string) => {
                        if (line.startsWith('BOLD::')) {
                            doc.setFontSize(6);
                            const boldText = line.substring('BOLD::'.length);
                            doc.setFont("helvetica", "bold");
                            doc.text(boldText, x + leftPadding, currentY);
                        } else {
                            doc.setFont("helvetica", "normal");
                            doc.text(line, x + leftPadding, currentY);
                        }
                        // Move Y down for the next line. The value '4' is based on font size and line spacing. Adjust if needed.
                        currentY += 4;
                    });
                    // Reset font to normal for other cells
                    doc.setFont("helvetica", "normal");
                }
            }

            if (data.section === 'body' && data.column.index === 1) {
                // --- STATUS BADGE ---
                const type = tableData[data.row.index].rawType;
                let badgeColor = [230, 230, 230]; // Default Gray
                let borderColor = [200, 200, 200];
                let textColor = [80, 80, 80];
                let badgeText = type.toLowerCase();

                if (type === 'DEPOSIT') {
                    badgeColor = [200, 249, 221]; // #C8F9DD
                    textColor = [46, 204, 113]; // Green Text
                    borderColor = [46, 204, 113]; // #2ECC71
                    badgeText = "Deposit";
                } else if (type === 'PICKUP') {
                    badgeColor = [255, 231, 164]; // #FFE7A4
                    textColor = [255, 165, 0]; // Orange Text
                    borderColor = [255, 165, 0]; // #FFA500
                    badgeText = "Pickup";
                } else if (type === 'PURCHASE') {
                    badgeColor = [255, 202, 202]; // #FFCACA
                    textColor = [249, 83, 83]; // Red Text
                    borderColor = [249, 83, 83]; // #F95353
                    badgeText = "Purchase";
                }

                const { x, y, width, height } = data.cell;
                
                // Draw White rect to cover default text
                doc.setFillColor(255, 255, 255);
                doc.rect(x + 1, y + 1, width - 2, height - 2, 'F');

                // Draw Badge
                doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
                doc.setFillColor(badgeColor[0], badgeColor[1], badgeColor[2]);
                doc.roundedRect(x + 2, y + 6, width - 4, 4, 2, 2, 'FD'); // FD for Fill and Stroke (border)

                // Draw Text
                doc.setTextColor(textColor[0], textColor[1], textColor[2]);
                doc.setFontSize(6);
                doc.text(badgeText, x + width / 2, y + 8.5, { align: 'center' });
            }

            if (data.section === 'body' && data.column.index === 4) {
                // --- COLORED AMOUNT ---
                const text = data.cell.raw as string;
                if (text.startsWith('+')) {
                    doc.setTextColor(46, 204, 113); // Green
                } else {
                    doc.setTextColor(249, 83, 83); // Red
                }
                // We have to redraw text because autoTable draws it black by default
                // This is a hacky override: draw white box then colored text
                // Ideally use `willDrawCell` to set color, but `didDraw` allows overlay
                const { x, y, width, height } = data.cell;
                doc.setFontSize(6);
                doc.setFont("helvetica", "bold");
                // Note: re-rendering text perfectly over existing text is hard, 
                // but setting textColor in willDrawCell is cleaner. See below.
            }
        },
        willDrawCell: (data) => {
             if (data.section === 'body' && data.column.index === 4) {
                const text = data.cell.raw as string;
                if (text.startsWith('+')) {
                    doc.setTextColor(46, 204, 113);
                } else {
                    doc.setTextColor(249, 83, 83);
                }
             }
        }
    });

    // --- SUMMARY SECTION ---
    // Calculate Y position after table
    let finalY = (doc as any).lastAutoTable.finalY + 10;
    
    // Summary Calculation
    const summarySales = clientTransactions
        .filter(t => t.type === 'PURCHASE' || t.type === 'PICKUP')
        .reduce((acc, curr) => acc + (curr.total || 0), 0);
        
    const summaryDeposits = clientTransactions
        .filter(t => t.type === 'DEPOSIT')
        .reduce((acc, curr) => acc + (curr.total || 0), 0);

    const summaryReturns = 0; // Assuming 0 for now based on data structure
    
    const netGrandTotal = summaryDeposits - summarySales; // Simplified logic
    
    const totalTransport = clientTransactions.reduce((acc, curr) => acc + (curr.transportFare || 0), 0);
    const totalLoadingOff = clientTransactions.reduce((acc, curr) => acc + (curr.loadingAndOffloading || 0), 0);
    const totalLoading = clientTransactions.reduce((acc, curr) => acc + (curr.loading || 0), 0);
    const totalAddCharges = totalTransport + totalLoadingOff + totalLoading;

    // 1. Gray Container
    doc.setFillColor(248, 248, 248); // #F8F8F8
    doc.setDrawColor(230, 230, 230);
    doc.roundedRect(margin, finalY, pageWidth - (margin * 2), 95, 3, 3, 'FD');

    // Title
    doc.setFontSize(11);
    doc.setTextColor(33, 33, 33);
    doc.text("May 2025 Summary", margin + 5, finalY + 10);

    // 2. Three Stats Cards
    const cardWidth = 55;
    const cardHeight = 25;
    const gap = 6;
    const startX = margin + 5;
    const cardY = finalY + 15;

    // Card 1: Sales
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(230, 230, 230);
    doc.roundedRect(startX, cardY, cardWidth, cardHeight, 1, 1, 'FD');
    
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text("Total Sales", startX + (cardWidth/2), cardY + 6, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(249, 83, 83); // Red
    doc.text(`-${formatCurrencyForPDF(summarySales)}`, startX + (cardWidth/2), cardY + 13, { align: 'center' });
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor(150, 150, 150);
    doc.text(`${clientTransactions.filter(t => t.type !== 'DEPOSIT').length} transactions`, startX + (cardWidth/2), cardY + 19, { align: 'center' });

    // Card 2: Deposits
    const card2X = startX + cardWidth + gap;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(card2X, cardY, cardWidth, cardHeight, 1, 1, 'FD');
    
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text("Total Deposits", card2X + (cardWidth/2), cardY + 6, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(46, 204, 113); // Green
    doc.text(`+${formatCurrencyForPDF(summaryDeposits)}`, card2X + (cardWidth/2), cardY + 13, { align: 'center' });
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor(150, 150, 150);
    doc.text(`${clientTransactions.filter(t => t.type === 'DEPOSIT').length} payments`, card2X + (cardWidth/2), cardY + 19, { align: 'center' });

    // Card 3: Returns
    const card3X = card2X + cardWidth + gap;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(card3X, cardY, cardWidth, cardHeight, 1, 1, 'FD');
    
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text("Total Returns", card3X + (cardWidth/2), cardY + 6, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(33, 33, 33); // Black
    doc.text(`${formatCurrencyForPDF(summaryReturns)}`, card3X + (cardWidth/2), cardY + 13, { align: 'center' });
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor(150, 150, 150);
    doc.text(`0 return`, card3X + (cardWidth/2), cardY + 19, { align: 'center' });

    // 3. Dark Grand Total Box
    const darkBoxY = cardY + cardHeight + 8;
    doc.setFillColor(60, 60, 60); // Dark Grey
    doc.roundedRect(startX, darkBoxY, (cardWidth * 3) + (gap * 2), 30, 1, 1, 'F');

    doc.setFontSize(7);
    doc.setTextColor(200, 200, 200);
    doc.text("NET GRAND TOTAL (MAY 2025)", pageWidth / 2, darkBoxY + 8, { align: 'center' });

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text(formatCurrencyForPDF(netGrandTotal), pageWidth / 2, darkBoxY + 16, { align: 'center' });

    doc.setFontSize(6);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(180, 180, 180);
    doc.text(
        `Sales (${formatCurrencyForPDF(summarySales)}) - Deposits (${formatCurrencyForPDF(summaryDeposits)}) - Returns (${formatCurrencyForPDF(summaryReturns)})`, 
        pageWidth / 2, 
        darkBoxY + 23, 
        { align: 'center' }
    );

    // 4. Additional Charges Box (White bottom)
    const chargesY = darkBoxY + 35;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(startX, chargesY, (cardWidth * 3) + (gap * 2), 30, 1, 1, 'F');

    doc.setFontSize(9);
    doc.setTextColor(33, 33, 33);
    doc.setFont("helvetica", "bold");
    doc.text("Additional Charges Summary", startX + 5, chargesY + 8);

    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    
    // Charges Grid (Approx)
    doc.text(`Total Transport: ${formatCurrencyForPDF(totalTransport)}`, startX + 5, chargesY + 16);
    doc.text(`Total Loading/Offloading: ${formatCurrencyForPDF(totalLoadingOff)}`, startX + 60, chargesY + 16);
    doc.text(`Total Loading: ${formatCurrencyForPDF(totalLoading)}`, startX + 130, chargesY + 16);

    // Charges Line
    doc.setDrawColor(240, 240, 240);
    doc.line(startX + 5, chargesY + 20, startX + (cardWidth * 3) + (gap * 2) - 5, chargesY + 20);

    // Total Charges Text
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(33, 33, 33);
    doc.text(`Total Additional Charges: ${formatCurrencyForPDF(totalAddCharges)}`, startX + 5, chargesY + 26);


    // --- FOOTER ---
    const footerY = pageHeight - 20;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, footerY, pageWidth - margin, footerY);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("This is a system-generated statement", pageWidth / 2, footerY + 6, { align: 'center' });
    doc.text("For inquiries, please contact your account manager", pageWidth / 2, footerY + 10, { align: 'center' });
    doc.text(`Statement Date: ${new Date().toLocaleDateString()}`, pageWidth / 2, footerY + 14, { align: 'center' });

    // Save
    doc.save(`Statement_${client?.name || 'Client'}_${periodText}.pdf`);
  };

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
    let filtered = mergedTransactions.filter((t) => t.client?._id === clientId);

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
      <header className="grid md:grid-cols-5 grid-cols-1 items-center  md:px-10 sticky top-0 bg-white z-10 border-b border-[#D9D9D9]">
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
      <main className="grid gap-3 bg-[#F5F5F5] py-5 px-3 md:px-9 grid-cols-1  lg:grid-cols-5">
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
              <div className="md:flex justify-start items-center w-full gap-4 md:gap-1  lg:gap-2 mb-10">
                <div className="flex flex-col justify-end transition-all w-full h-full">
                  <DateFromToPicker
                    date={dateRangeFilter}
                    onDateChange={(range) =>
                      setDateRangeFilter(range || { from: undefined, to: undefined })
                    }
                  />
                </div>

                <div className="flex flex-col  sm:w-[179px] md:w-[179px] transition-all w-full ">
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

                <div className="flex flex-col  sm:w-[230px] md:w-[210px] transition-all w-full">
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
                    className="mt-6 max-w-[101px]  bg-[#2ECC71] hover:bg-[#27ae60] text-white font-medium  sm:w-[230px] md:w-[210px] transition-all w-full "
                    onClick={handleApplyFilters}
                  >
                    Apply filters
                  </Button>
                </div>
              </div>

              <ClientTransactionDetails
                clientTransactions={clientTransactions}
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