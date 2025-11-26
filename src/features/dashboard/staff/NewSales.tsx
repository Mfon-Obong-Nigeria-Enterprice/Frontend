// import React, { useState, useEffect, useRef } from "react";
// import { useQueryClient } from "@tanstack/react-query";
// import { toast } from "react-toastify";
// import { io } from "socket.io-client";

// // components
// import ClientSearch from "./components/ClientSearch";
// import AddSaleProduct from "./components/AddSaleProduct";
// import ClientDisplayBox from "./components/ClientDisplayBox";
// import WalkinClientDetailBox from "./components/WalkinClientDetailBox";
// import SalesReceipt from "./components/SalesReceipt";

// // store
// import { useInventoryStore } from "@/stores/useInventoryStore";
// import { useClientStore } from "@/stores/useClientStore";
// import { useAuthStore } from "@/stores/useAuthStore";

// // services
// import { AddTransaction } from "@/services/transactionService";

// // types
// import type { Client } from "@/types/types";
// import type { Transaction } from "@/types/transactions";

// // ui
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import Modal from "@/components/Modal";
// import ClientStatusBadge from "@/pages/ClientStatusBadge";

// // utils
// import {
//   toSentenceCaseName,
//   balanceTextClass,
//   formatCurrency,
// } from "@/utils/styles";
// import { handleApiError } from "@/services/errorhandler";

// // icons
// import { AlertCircle } from "lucide-react";

// // data
// import { bankNames, posNames } from "@/data/banklist";

// // Helper function to get the correct server URL
// const getServerUrl = () => {
//   const apiUrl = import.meta.env.VITE_API_URL;

//   // For development with localhost
//   if (
//     apiUrl?.includes("localhost") ||
//     apiUrl?.includes("127.0.0.1") ||
//     window.location.hostname === "localhost" ||
//     window.location.hostname === "127.0.0.1"
//   ) {
//     return "http://localhost:3000";
//   }

//   // For production with onrender
//   if (apiUrl && apiUrl.includes("onrender.com")) {
//     return apiUrl.replace("/api", ""); // Remove /api path for websocket
//   }

//   // Fallback to localhost for development
//   return "http://localhost:3000";
// };

// // connect to socket with proper URL detection
// const socket = io(getServerUrl());

// export type Row = {
//   productId: string;
//   unitPrice: number;
//   quantity: number;
//   discount: number;
//   discountType: "percent" | "amount";
//   total: number;
//   unit?: string;
//   productName?: string;
// };

// // Define a simple type for the receipt data based on backend structure
// type ReceiptData = Transaction;

// const emptyRow: Row = {
//   productId: "",
//   unitPrice: 0,
//   quantity: 1,
//   discount: 0,
//   discountType: "amount",
//   total: 0,
//   unit: "",
//   productName: "",
// };

// // Returns today's date in local timezone formatted as YYYY-MM-DD for input[type="date"]
// const getTodayDateString = () => {
//   const now = new Date();
//   const year = now.getFullYear();
//   const month = String(now.getMonth() + 1).padStart(2, "0");
//   const day = String(now.getDate()).padStart(2, "0");
//   return `${year}-${month}-${day}`;
// };

// const NewSales: React.FC = () => {
//   const queryClient = useQueryClient();
//   // Store data
//   const { products } = useInventoryStore();
//   const clients = useClientStore((state) => state.clients);
//   const { user } = useAuthStore();

//   // Client state
//   const [selectedClient, setSelectedClient] = useState<Client | null>(null);
//   const [isWalkIn, setIsWalkIn] = useState(false);
//   const [walkInData, setWalkInData] = useState({ name: "", phone: "" });

//   // Payment state
//   const [paymentMethod, setPaymentMethod] = useState("cash");
//   const [purchaseType, setPurchaseType] = useState<"PURCHASE" | "PICKUP">(
//     "PURCHASE"
//   );
//   const [subMethod, setSubMethod] = useState("");
//   const [amountPaid, setAmountPaid] = useState(""); // Store raw digits
//   const [notes, setNotes] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Product state
//   const [rows, setRows] = useState<Row[]>([emptyRow]);
//   const amountPaidInputRef = useRef<HTMLInputElement>(null);

//   // discount state
//   const [discountReason, setDiscountReason] = useState("");
//   const [globalDiscount, setGlobalDiscount] = useState(0);

//   // receipt state
//   const [showReceipt, setShowReceipt] = useState(false);
//   const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);

//   const [bankSearch, setBankSearch] = useState("");

//   const [date, setDate] = useState<string>(() => getTodayDateString());

//   // listen for socket event
//   useEffect(() => {
//     socket.on("transaction_created", (data: ReceiptData) => {
//       setReceiptData(data);
//       setShowReceipt(true);
//     });
//     //clean up function
//     return () => {
//       socket.off("transaction_created");
//     };
//   }, []);

//   if (!user?.branchId) {
//     toast.error("Branch ID is missing");
//     return null;
//   }

//   const formatCurrencyDisplay = (value: string) => {
//     if (!value) return "₦0";

//     // Remove all non-digit characters except numbers
//     const digitsOnly = value.replace(/\D/g, "");

//     // Handle empty value
//     if (digitsOnly === "") return "₦0";

//     // Convert to number directly (no division by 100)
//     const numericValue = parseFloat(digitsOnly);

//     // Format with commas but NO decimal places
//     return `₦${numericValue.toLocaleString("en-GB", {
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     })}`;
//   };

//   const handleAmountPaidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const input = e.target.value;

//     // Extract only digits
//     const newRawValue = input.replace(/\D/g, "");

//     setAmountPaid(newRawValue);
//   };

//   const handleAmountPaidKeyDown = (
//     e: React.KeyboardEvent<HTMLInputElement>
//   ) => {
//     // Allow navigation keys, backspace, delete, tab, etc.
//     const allowedKeys = [
//       "ArrowLeft",
//       "ArrowRight",
//       "ArrowUp",
//       "ArrowDown",
//       "Backspace",
//       "Delete",
//       "Tab",
//       "Home",
//       "End",
//     ];

//     if (!allowedKeys.includes(e.key) && !e.ctrlKey && !e.metaKey) {
//       // Allow only digits
//       if (!/\d/.test(e.key)) {
//         e.preventDefault();
//       }
//     }
//   };

//   const handleAmountPaidFocus = (e: React.FocusEvent<HTMLInputElement>) => {
//     // Select all text when focused for easy editing
//     setTimeout(() => e.target.select(), 0);
//   };

//   // Helper to get numeric value safely
//   const getAmountPaid = () => {
//     if (!amountPaid) return 0;
//     const value = parseFloat(amountPaid);
//     return isNaN(value) ? 0 : value;
//   };

//   const canSubmit = () => {
//     if (selectedClient && isClientBlocked) return false;
//     if (!selectedClient && !isWalkIn) return false;
//     if (isWalkIn && !walkInData.name.trim()) return false;
//     if (!rows.some((row) => row.productId)) return false;
//     // if (rows.some((row) => row.discount > 0) && !discountReason.trim())
//     if (
//       (rows.some((row) => row.discount > 0) || globalDiscount > 0) &&
//       !discountReason.trim()
//     )
//       return false;
//     if (!paymentMethod) return false;
//     const paid = getAmountPaid();
//     if (paid === null || paid < 0) return false;
//     return true;
//   };

//   const validateSales = () => {
//     if (selectedClient && isClientBlocked) {
//       toast.error(
//         "Cannot create transaction for suspended client. Please contact manager."
//       );
//       return false;
//     }
//     if (!canSubmit()) {
//       toast.error("Please fill all required fields correctly");
//       return false;
//     }

//     if (isWalkIn) {
//       const { total } = calculateTotals();
//       const paid = getAmountPaid() || 0;

//       if (Math.abs(paid - total) > 0.01) {
//         toast.error(
//           `Walk-in clients must pay exactly ${formatCurrency(total)}`
//         );
//         return false;
//       }
//     }

//     return true;
//   };

//   const calculateTotals = () => {
//     const subtotal = rows.reduce(
//       (acc, row) => acc + (Number(row.quantity) * Number(row.unitPrice) || 0),
//       0
//     );

//     const rowDiscountTotal = rows.reduce((acc, row) => {
//       const lineAmount = Number(row.quantity) * Number(row.unitPrice);
//       if (!row.discount) return acc;

//       let discountAmount = 0;
//       if (row.discountType === "percent") {
//         discountAmount = (lineAmount * Number(row.discount)) / 100;
//       } else if (row.discountType === "amount") {
//         discountAmount = Number(row.discount);
//       }

//       return acc + discountAmount;
//     }, 0);

//     // only apply global discount if no discount exists
//     const discountTotal =
//       rowDiscountTotal > 0 ? rowDiscountTotal : globalDiscount;

//     const total = subtotal - discountTotal;
//     return { subtotal, discountTotal, total };
//   };

//   const getBalanceInfo = () => {
//     const { total } = calculateTotals();
//     const paid = getAmountPaid();
//     const clientBalance =
//       clients.find((c) => c._id === selectedClient?._id)?.balance || 0;

//     const availableBalance = selectedClient ? clientBalance : 0;
//     const effectiveAmountPaid = paid + availableBalance;
//     const balanceDue = Math.max(0, total - effectiveAmountPaid);
//     const newBalance = effectiveAmountPaid - total;

//     let statusMessage;
//     if (isWalkIn) {
//       if (paid === total) {
//         statusMessage = "Payment complete";
//       } else if (paid > total) {
//         statusMessage = `Overpayment: ₦${(paid - total).toLocaleString(
//           "en-US",
//           {
//             minimumFractionDigits: 0,
//             maximumFractionDigits: 0,
//           }
//         )} (not allowed for walk-in)`;
//       } else {
//         statusMessage = `Amount due: ₦${(total - paid).toLocaleString("en-US", {
//           minimumFractionDigits: 0,
//           maximumFractionDigits: 0,
//         })} (full payment required)`;
//       }
//     } else if (balanceDue === 0) {
//       statusMessage = "No balance due";
//     } else if (selectedClient && clientBalance > 0) {
//       statusMessage = `Balance due: ₦${balanceDue.toLocaleString("en-US", {
//         minimumFractionDigits: 0,
//         maximumFractionDigits: 0,
//       })} (Account balance: ₦${clientBalance.toLocaleString("en-US", {
//         minimumFractionDigits: 0,
//         maximumFractionDigits: 0,
//       })})`;
//     } else {
//       statusMessage = `Balance due: ₦${balanceDue.toLocaleString("en-US", {
//         minimumFractionDigits: 0,
//         maximumFractionDigits: 0,
//       })}`;
//     }

//     return { statusMessage, total, paid, clientBalance, newBalance };
//   };

//   const { statusMessage, total, paid, clientBalance, newBalance } =
//     getBalanceInfo();

//   const handleWalkInDataChange = (data: { name: string; phone: string }) => {
//     setWalkInData(data);
//   };

//   const handleResetClient = () => {
//     setSelectedClient(null);
//     setIsWalkIn(false);
//     setWalkInData({ name: "", phone: "" });
//     setRows([{ ...emptyRow }]);
//     setPaymentMethod("cash");
//     setAmountPaid("");
//     setDiscountReason("");
//     setNotes("");
//     setIsSubmitting(false);
//     setGlobalDiscount(0);
//     setDate(getTodayDateString());
//     setPurchaseType("PURCHASE");
//   };

//   const handleSubmit = async () => {
//     if (!validateSales()) return;

//     setIsSubmitting(true);
//     try {
//       const { discountTotal } = calculateTotals();
//       const effectiveAmountPaid = getAmountPaid() || 0;

//       const apiItems = rows
//         .filter((row) => row.productId)
//         .map((row) => {
//           const product = products.find((p) => p._id === row.productId);
//           return {
//             productId: row.productId,
//             quantity: row.quantity,
//             unit: product?.unit || "pcs",
//             discount: 0,
//           };
//         });

//       // let saleType: "PURCHASE" | "PICKUP" = "PURCHASE";
//       // if (!isWalkIn && selectedClient) {
//       //   const clientBalance = selectedClient.balance || 0;
//       //   const canCover = effectiveAmountPaid + clientBalance >= total;

//       //   saleType = canCover ? "PURCHASE" : "PICKUP";
//       // }

//       let paymentMethodForBackend = paymentMethod;
//       if (subMethod) {
//         if (paymentMethod === "bank" || paymentMethod === "transfer") {
//           paymentMethodForBackend = `Transfer from ${subMethod}`;
//         } else if (paymentMethod === "pos") {
//           paymentMethodForBackend = `POS with ${subMethod}`;
//         }
//       }

//       const payload = {
//         ...(selectedClient?._id
//           ? { clientId: selectedClient._id }
//           : { walkInClient: walkInData }),
//         type: purchaseType,
//         items: apiItems,
//         amountPaid: effectiveAmountPaid,
//         discount: discountTotal,
//         paymentMethod:
//           purchaseType === "PICKUP" ? "Credit" : paymentMethodForBackend,
//         notes,
//         date,
//       };

//       await AddTransaction(payload);
//       // console.log("payload", payload);
//       toast.success("Transaction created successfully");

//       queryClient.invalidateQueries({ queryKey: ["transactions"] });

//       handleResetClient();
//     } catch (error) {

//       handleApiError(error, "Transaction error");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Helper function to get sub list based on payment method
//   const getSubList = () => {
//     if (paymentMethod === "bank" || paymentMethod === "transfer") {
//       return bankNames;
//     } else if (paymentMethod === "pos") {
//       return posNames;
//     }
//     return [];
//   };

//   const isClientBlocked = selectedClient ? false : false;

import React, { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";

// components
import ClientSearch from "./components/ClientSearch";
import ClientSalesTypes from "./components/ClientSalesTypes";
import AddSaleProduct from "./components/AddSaleProduct";
import ClientDisplayBox from "./components/ClientDisplayBox";
import WalkinClientDetailBox from "./components/WalkinClientDetailBox";
// import SalesReceipt from "./components/SalesReceipt";

// store
import { useInventoryStore } from "@/stores/useInventoryStore";
import { useClientStore } from "@/stores/useClientStore";
import { useAuthStore } from "@/stores/useAuthStore";

// services
import { AddTransaction } from "@/services/transactionService";

// types
import type { Client } from "@/types/types";
// import type { Transaction } from "@/types/transactions";

// ui
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import Modal from "@/components/Modal";
import ClientStatusBadge from "@/pages/ClientStatusBadge";

// utils
import {
  toSentenceCaseName,
  balanceTextClass,
  formatCurrency,
} from "@/utils/styles";
import { handleApiError } from "@/services/errorhandler";

// icons
import { AlertCircle } from "lucide-react";

// data
import { bankNames, posNames } from "@/data/banklist";

// Helper function to get the correct server URL
const getServerUrl = () => {
  // explicit override from env (recommended)
  const socketUrl = import.meta.env.VITE_SOCKET_URL as string | undefined;
  if (socketUrl && socketUrl.length) return socketUrl.replace(/\/$/, "");

  const apiUrl = import.meta.env.VITE_API_URL as string | undefined;

  // For development with localhost
  if (
    apiUrl?.includes("localhost") ||
    apiUrl?.includes("127.0.0.1") ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    return "http://localhost:3000";
  }

  // For production with onrender
  if (apiUrl && apiUrl.includes("onrender.com")) {
    return apiUrl.replace("/api", "");
  }

  // Fallback to current origin
  return window.location.origin;
};

// socket-related types
export type Row = {
  productId: string;
  unitPrice: number;
  quantity: number;
  discount: number;
  discountType: "percent" | "amount";
  total: number;
  unit?: string;
  productName?: string;
};

// type ReceiptData = Transaction;

const emptyRow: Row = {
  productId: "",
  unitPrice: 0,
  quantity: 1,
  discount: 0,
  discountType: "amount",
  total: 0,
  unit: "",
  productName: "",
};

const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const NewSales: React.FC = () => {
  const queryClient = useQueryClient();
  const { products } = useInventoryStore();
  const clients = useClientStore((state) => state.clients);
  const { user } = useAuthStore();

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isWalkIn, setIsWalkIn] = useState(false);
  const [walkInData, setWalkInData] = useState({ name: "", phone: "" });

  const [salesType, setSalesType] = useState<"Retail" | "Wholesale">("Retail");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [transactionType, setTransactionType] = useState<
    "PURCHASE" | "PICKUP" | "WHOLESALE" | "RETURN"
  >("PURCHASE");
  const [subMethod, setSubMethod] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [rows, setRows] = useState<Row[]>([emptyRow]);
  const amountPaidInputRef = useRef<HTMLInputElement>(null);

  const [discountReason, setDiscountReason] = useState("");
  const [globalDiscount, setGlobalDiscount] = useState(0);

  // const [showReceipt, setShowReceipt] = useState(false);
  // const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);

  const [bankSearch, setBankSearch] = useState("");
  const [date, setDate] = useState<string>(() => getTodayDateString());

  // SOCKET: useRef to hold socket instance and control lifecycle
  const socketRef = useRef<Socket | null>(null);

  // Update sales type when a client is selected
  useEffect(() => {
    if (selectedClient && selectedClient.salesType) {
      // If client has a salesType, use it
      setSalesType(selectedClient.salesType);
    } else {
      // Otherwise, default to "Retail"
      setSalesType("Retail");
    }
  }, [selectedClient]);

  // Connect socket inside useEffect so it doesn't run at module import time
  useEffect(() => {
    // only connect when user branch is present
    if (!user?.branchId) return;

    const url = getServerUrl();
    console.debug("[NewSales] connecting socket to:", url);

    const s = io(url, {
      path: "/socket.io",
      withCredentials: true,
      // force websocket to avoid polling/xhr fallback
      transports: ["websocket"],
      // optional reconnection settings
      reconnection: true,
      reconnectionAttempts: 5,
    });

    // debug handlers
    s.on("connect", () => {
      console.debug("[NewSales][WS] connected, id:", s.id);
    });

    s.on("connect_error", (err: any) => {
      console.error("[NewSales][WS] connect_error:", err);
    });

    s.on("error", (err: any) => {
      console.error("[NewSales][WS] error:", err);
    });

    // s.on("transaction_created", (data: ReceiptData) => {
    //   setReceiptData(data);
    //   setShowReceipt(true);
    // });

    socketRef.current = s;

    return () => {
      if (socketRef.current) {
        socketRef.current.off("transaction_created");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user?.branchId]);

  if (!user?.branchId) {
    toast.error("Branch ID is missing");
    return null;
  }

  const formatCurrencyDisplay = (value: string) => {
    if (!value) return "₦0";
    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly === "") return "₦0";
    const numericValue = parseFloat(digitsOnly);
    return `₦${numericValue.toLocaleString("en-GB", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  const handleAmountPaidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const newRawValue = input.replace(/\D/g, "");
    setAmountPaid(newRawValue);
  };

  const handleAmountPaidKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const allowedKeys = [
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Backspace",
      "Delete",
      "Tab",
      "Home",
      "End",
    ];
    if (!allowedKeys.includes(e.key) && !e.ctrlKey && !e.metaKey) {
      if (!/\d/.test(e.key)) {
        e.preventDefault();
      }
    }
  };

  const handleAmountPaidFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setTimeout(() => e.target.select(), 0);
  };

  const getAmountPaid = () => {
    if (!amountPaid) return 0;
    const value = parseFloat(amountPaid);
    return isNaN(value) ? 0 : value;
  };

  const canSubmit = () => {
    if (selectedClient && isClientBlocked) return false;
    if (!selectedClient && !isWalkIn) return false;
    if (isWalkIn && !walkInData.name.trim()) return false;
    if (!rows.some((row) => row.productId)) return false;
    if (
      (rows.some((row) => row.discount > 0) || globalDiscount > 0) &&
      !discountReason.trim()
    )
      return false;
    if (!paymentMethod) return false;
    const paid = getAmountPaid();
    if (paid === null || paid < 0) return false;
    return true;
  };

  const validateSales = () => {
    if (selectedClient && isClientBlocked) {
      toast.error(
        "Cannot create transaction for suspended client. Please contact manager."
      );
      return false;
    }
    if (!canSubmit()) {
      toast.error("Please fill all required fields correctly");
      return false;
    }

    if (isWalkIn) {
      const { total } = calculateTotals();
      const paid = getAmountPaid() || 0;

      if (Math.abs(paid - total) > 0.01) {
        toast.error(
          `Walk-in clients must pay exactly ${formatCurrency(total)}`
        );
        return false;
      }
    }

    return true;
  };

  const calculateTotals = () => {
    const subtotal = rows.reduce(
      (acc, row) => acc + (Number(row.quantity) * Number(row.unitPrice) || 0),
      0
    );

    const rowDiscountTotal = rows.reduce((acc, row) => {
      const lineAmount = Number(row.quantity) * Number(row.unitPrice);
      if (!row.discount) return acc;

      let discountAmount = 0;
      if (row.discountType === "percent") {
        discountAmount = (lineAmount * Number(row.discount)) / 100;
      } else if (row.discountType === "amount") {
        discountAmount = Number(row.discount);
      }

      return acc + discountAmount;
    }, 0);

    const discountTotal =
      rowDiscountTotal > 0 ? rowDiscountTotal : globalDiscount;
    const total = subtotal - discountTotal;
    return { subtotal, discountTotal, total };
  };

  const getBalanceInfo = () => {
    const { total } = calculateTotals();
    const paid = getAmountPaid();
    const clientBalance =
      clients.find((c) => c._id === selectedClient?._id)?.balance || 0;

    const availableBalance = selectedClient ? clientBalance : 0;
    const effectiveAmountPaid = paid + availableBalance;
    const balanceDue = Math.max(0, total - effectiveAmountPaid);
    const newBalance = effectiveAmountPaid - total;

    let statusMessage;
    if (isWalkIn) {
      if (paid === total) {
        statusMessage = "Payment complete";
      } else if (paid > total) {
        statusMessage = `Overpayment: ₦${(paid - total).toLocaleString(
          "en-US",
          {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }
        )} (not allowed for walk-in)`;
      } else {
        statusMessage = `Amount due: ₦${(total - paid).toLocaleString("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })} (full payment required)`;
      }
    } else if (balanceDue === 0) {
      statusMessage = "Status: No balance due";
    } else if (selectedClient && clientBalance > 0) {
      statusMessage = `Balance due: ₦${balanceDue.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })} (Account balance: ₦${clientBalance.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })})`;
    } else {
      statusMessage = `Balance due: ₦${balanceDue.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`;
    }

    return { statusMessage, total, paid, clientBalance, newBalance };
  };

  const { statusMessage, total, paid, clientBalance, newBalance } =
    getBalanceInfo();

  const handleWalkInDataChange = (data: { name: string; phone: string }) => {
    setWalkInData(data);
  };

  const handleResetClient = () => {
    setSelectedClient(null);
    setIsWalkIn(false);
    setWalkInData({ name: "", phone: "" });
    setRows([{ ...emptyRow }]);
    setPaymentMethod("cash");
    setAmountPaid("");
    setDiscountReason("");
    setNotes("");
    setIsSubmitting(false);
    setGlobalDiscount(0);
    setDate(getTodayDateString());
    setTransactionType("PURCHASE");
  };

  const handleSubmit = async () => {
    if (!validateSales()) return;

    setIsSubmitting(true);
    try {
      // --- SENIOR ENGINEER DEBUG LOG ---
      console.groupCollapsed("--- New Sales Submission Data ---");
      console.log("Timestamp:", new Date().toISOString());
      console.log("Submitting User:", user);
      console.log("---------------------------------");
      console.log("CLIENT INFO");
      console.log("Is Walk-In:", isWalkIn);
      console.log("Selected Client:", selectedClient);
      console.log("Walk-In Data:", walkInData);
      console.log("---------------------------------");
      console.log("TRANSACTION & PAYMENT");
      console.log("Sales Type:", salesType);
      console.log("Transaction Type:", transactionType);
      console.log("Payment Method:", paymentMethod);
      console.log("Sub-Method (Bank/POS):", subMethod);
      console.log("Amount Paid (Raw Input):", amountPaid);
      console.log("Transaction Date:", date);
      console.log("Notes:", notes);
      console.log("---------------------------------");
      console.log("PRODUCTS & TOTALS");
      console.log("Product Rows:", rows);
      console.log("Calculated Totals:", calculateTotals());
      console.log("Balance Info:", getBalanceInfo());
      console.groupEnd();
      // --- END OF DEBUG LOG ---

      const { discountTotal } = calculateTotals();
      const effectiveAmountPaid = getAmountPaid() || 0;

      const apiItems = rows
        .filter((row) => row.productId)
        .map((row) => {
          const product = products.find((p) => p._id === row.productId)!;
          const isWholesale = transactionType === "WHOLESALE";
          const price = isWholesale
            ? product.wholesalePrice || product.unitPrice
            : product.unitPrice;
          return {
            productId: row.productId,
            quantity: row.quantity,
            ...(isWholesale ? { wholesalePrice: price } : { unitPrice: price }),
            unit: product?.unit || "pcs",
            discount: 0,
          };
        });

      let paymentMethodForBackend = paymentMethod;
      if (subMethod) {
        if (paymentMethod === "bank" || paymentMethod === "transfer") {
          paymentMethodForBackend = `Transfer from ${subMethod}`;
        } else if (paymentMethod === "pos") {
          paymentMethodForBackend = `POS with ${subMethod}`;
        }
      }

      const payload = {
        ...(selectedClient?._id
          ? { clientId: selectedClient._id }
          : { walkInClient: walkInData }),
        salesType: salesType,
        type: transactionType,
        items: apiItems,
        amountPaid: effectiveAmountPaid,
        discount: discountTotal,
        paymentMethod:
          transactionType === "PICKUP" ? "Credit" : paymentMethodForBackend,
        notes,
        date,
      };

      await AddTransaction(payload);
      toast.success("Transaction created successfully");

      queryClient.invalidateQueries({ queryKey: ["transactions"] });

      handleResetClient();
    } catch (error) {
      handleApiError(error, "Transaction error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSubList = () => {
    if (paymentMethod === "bank" || paymentMethod === "transfer") {
      return bankNames;
    } else if (paymentMethod === "pos") {
      return posNames;
    }
    return [];
  };

  const isClientBlocked = selectedClient ? false : false;

  return (
    <main>
      <section className="md:bg-white md:px-7 py-5 md:py-10 rounded-[0.625rem] md:shadow">
        <h4 className="text-[#333] text-lg md:text-xl font-medium mb-6">
          Create New Sales
        </h4>

        {/* Client Selection */}
        <div className="md:p-5 md:rounded-[8px] md:border md:border-[#D9D9D9]">
          {!isWalkIn ? (
            <div>
              {/* <h6 className="hidden md:block">Select Client</h6> */}
              <div className="flex flex-col md:flex-row gap-4 md:gap-10 md:mt-2 md:items-end ">
                <ClientSearch
                  selectedClient={selectedClient}
                  onClientSelect={setSelectedClient}
                />
                <ClientSalesTypes
                  salesType={salesType}
                  onSalesTypeChange={setSalesType}
                />

                {/* Conditionally render Walk in button. Not available for Wholesale. */}
                {salesType !== "Wholesale" && (
                  <Button
                    onClick={() => {
                      setIsWalkIn(true);
                      setSelectedClient(null);
                    }}
                    className="w-full md:w-fit bg-[#3D80FF] text-white"
                  >
                    Walk in
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h6>Walk-in Client Details</h6>
                <Button
                  onClick={() => {
                    setIsWalkIn(false);
                    setWalkInData({ name: "", phone: "" });
                  }}
                  variant="outline"
                  size="sm"
                >
                  Back
                </Button>
              </div>
              <WalkinClientDetailBox
                onDataChange={handleWalkInDataChange}
                data={walkInData}
              />
            </div>
          )}

          {selectedClient && (
            <>
              <div className="mt-4">
                <ClientStatusBadge client={selectedClient} />
              </div>
              {isClientBlocked && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <p className="text-red-700 text-sm">
                    This client is suspended.
                  </p>
                </div>
              )}
              <ClientDisplayBox
                clientName={selectedClient.name}
                phoneNumber={selectedClient.phone}
                address={selectedClient.address}
                balance={selectedClient.balance}
              />
            </>
          )}

          {isWalkIn && walkInData.name && (
            <div className="mt-4 p-4 border rounded-lg bg-[#F8F9FA]">
              <h6 className="font-medium text-[#333]">Walk-in Client</h6>
              <p>Name: {toSentenceCaseName(walkInData.name)}</p>
              {walkInData.phone && <p>Phone: {walkInData.phone}</p>}
            </div>
          )}

          {(!selectedClient || !isClientBlocked || isWalkIn) && (
            <div className="mt-7">
              <AddSaleProduct
                rows={rows}
                setRows={setRows}
                emptyRow={emptyRow}
                onDiscountReasonChange={setDiscountReason}
                discountReason={discountReason}
                setGlobalDiscount={setGlobalDiscount}
                globalDiscount={globalDiscount}
              />
            </div>
          )}
        </div>

        {/* Payment Section */}
        {(!selectedClient || !isClientBlocked || isWalkIn) && (
          <div className="p-5 my-7 border rounded-[8px]">
            <h5 className="text-xl font-medium mb-4">Payment Details</h5>
            <div className="flex flex-col sm:flex-wrap sm:flex-row gap-4 sm:gap-6">
              <div className="w-full sm:w-auto">
                <Label className="mb-1">Payment Method</Label>
                <Select
                  value={paymentMethod}
                  onValueChange={(val) => {
                    setPaymentMethod(val);
                    setSubMethod("");
                    setBankSearch("");
                  }}
                >
                  <SelectTrigger className="w-full sm:w-[180px] bg-[#D9D9D9]">
                    <SelectValue placeholder="Select Payment Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash"> Cash </SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                    <SelectItem value="bank">Bank</SelectItem>
                    <SelectItem value="pos">P.O.S</SelectItem>
                    {!isWalkIn && (
                      <>
                        <SelectItem value="balance">From Balance</SelectItem>
                        <SelectItem value="credit">On Credit</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {["bank", "transfer", "pos"].includes(paymentMethod) && (
                <div className="w-full sm:w-auto">
                  <Label className="mb-1">
                    Choose {paymentMethod === "pos" ? "POS" : "Bank"}
                  </Label>

                  <Select value={subMethod} onValueChange={setSubMethod}>
                    <SelectTrigger className="w-full sm:w-[180px] bg-[#D9D9D9]">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent
                      side="top"
                      className="max-h-[250px] overflow-y-auto"
                    >
                      <div
                        className="px-2 py-2 sticky top-0 bg-white z-10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Input
                          type="text"
                          placeholder={`Search ${
                            paymentMethod === "pos" ? "POS" : "Bank"
                          }`}
                          value={bankSearch}
                          onChange={(e) => setBankSearch(e.target.value)}
                          className="h-8 text-sm"
                        />
                      </div>

                      {/* Filtered List */}
                      {getSubList()
                        .filter((name) =>
                          name.toLowerCase().includes(bankSearch.toLowerCase())
                        )
                        .map((name) => (
                          <SelectItem key={name} value={name}>
                            {name}
                          </SelectItem>
                        ))}

                      {/* Show message if no results */}
                      {getSubList().filter((name) =>
                        name.toLowerCase().includes(bankSearch.toLowerCase())
                      ).length === 0 && (
                        <div className="px-3 py-2 text-sm text-gray-500">
                          No matches found
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label className="mb-1">Transaction Type</Label>
                <Select
                  value={transactionType}
                  onValueChange={(value: string) =>
                    setTransactionType(
                      value as "PURCHASE" | "PICKUP" | "WHOLESALE" | "RETURN"
                    )
                  }
                >
                  <SelectTrigger className="w-full sm:w-[180px] bg-[#D9D9D9]">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent side="top">
                    <SelectItem value="PURCHASE">Purchase</SelectItem>
                    <SelectItem value="WHOLESALE">Wholesale</SelectItem>
                    <SelectItem value="RETURN">Return</SelectItem>
                    {!isWalkIn && selectedClient && (
                      <SelectItem value="PICKUP">Pickup</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full sm:w-auto">
                <Label className="mb-1">Amount Paid</Label>
                <Input
                  ref={amountPaidInputRef}
                  type="text"
                  placeholder="₦0"
                  className="w-full sm:w-40"
                  value={formatCurrencyDisplay(amountPaid)}
                  onChange={handleAmountPaidChange}
                  onKeyDown={handleAmountPaidKeyDown}
                  onFocus={handleAmountPaidFocus}
                />
              </div>

              {/* for date */}
              <div className="w-full sm:w-auto">
                <Label className="mb-1">Transaction Date</Label>
                <Input
                  type="date"
                  placeholder=""
                  className="w-full sm:w-40"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
            {isWalkIn && (
              <p className="mt-3 text-sm text-[#7D7D7D]">{statusMessage}</p>
            )}

            {/* for registered client, show account details */}
            {selectedClient && total > 0 && (
              <div className="bg-[#f0f0f3] px-5 py-5 rounded-[10px] mt-5 space-y-2.5">
                {/* client balance */}
                <p className="flex justify-between items-center text-sm font-Inter">
                  <span className="text-[#444444]">
                    Current Client Balance:
                  </span>
                  <span
                    className={`font-medium ${balanceTextClass(clientBalance)}`}
                  >
                    {formatCurrency(clientBalance)}
                  </span>
                </p>

                {/* total purchase */}
                <p className="flex justify-between items-center text-sm font-Inter">
                  <span className="text-[#444444]">Purchase Total:</span>
                  <span className="font-medium text-[#F95353]">
                    -₦
                    {total.toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </p>

                {/* amount paid */}
                <p className="flex justify-between items-center text-sm font-Inter">
                  <span className="text-[#444444]">Amount Paid:</span>
                  <span className="font-medium text-[#2ECC71]">
                    +₦
                    {paid.toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </p>

                {/* new balance */}
                <p className="flex justify-between items-center text-sm font-Inter border-t border-[#7D7D7D] pt-2 font-medium">
                  <span className="text-[#7D7D7D]">
                    New balance (After purchase):
                  </span>
                  <span className={balanceTextClass(newBalance)}>
                    {formatCurrency(newBalance)}{" "}
                    {newBalance > 0 ? "(Credit)" : "(Debt)"}
                  </span>
                </p>
              </div>
            )}

            {selectedClient && newBalance < 0 && (
              <div className="flex items-center bg-[#FFF2CE] border border-[#ffa500] rounded-[8px] min-h-[63px] px-4 sm:px-14 mt-5">
                <p className="font-Inter text-amber-800">
                  <span className="font-medium text-[15px]">Warning:</span>
                  <span className="text-sm">
                    This transaction will result in a debt of ₦
                    {Math.abs(newBalance).toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                    . Client will owe money after this purchase
                  </span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={handleResetClient}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !canSubmit()}
            className="text-white w-full sm:w-auto"
          >
            {isSubmitting ? "Processing..." : "Complete Sales"}
          </Button>
        </div>
      </section>
    </main>
  );
};

export default NewSales;