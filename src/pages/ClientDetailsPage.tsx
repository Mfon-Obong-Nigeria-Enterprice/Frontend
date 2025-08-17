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
import CustomDatePicker from "@/utils/CustomDatePicker";
import { useAuthStore } from "@/stores/useAuthStore";
import DeleteClientDialog from "@/features/dashboard/manager/component/DeleteClientDialog";
import { toast } from "sonner";
import EditClientDialog from "@/features/dashboard/manager/component/EditClientDialog";

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
  const { transactions } = useTransactionsStore();
  // Get user from auth store
  const { user } = useAuthStore();

  // Determine if current user is a manager/super_admin
  const isManager = useMemo(() => {
    if (isManagerView) return true;
    if (!user || !user.role) return false;

    const normalizedRole = user.role.toString().trim().toUpperCase();
    return normalizedRole === "SUPER_ADMIN";
  }, [user, isManagerView]);
  // Filter states
  const [transactionTypeFilter, setTransactionTypeFilter] =
    useState<string>("all");
  const [staffFilter, setStaffFilter] = useState<string>("all-staff");
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const mergedTransactions = useMemo(() => {
    if (!transactions || !clients) return [];
    console.log(
      "🔄 Merging transactions:",
      transactions.length,
      "clients:",
      clients.length
    );
    const merged = mergeTransactionsWithClients(transactions, clients);
    console.log("✅ Merged transactions:", merged.length);
    return merged;
  }, [transactions, clients]);

  //get Clients
  const client = useMemo(() => {
    if (!clients || !clientId) return null;
    return clients.find((c) => c._id === clientId) || null;
  }, [clients, clientId]);
  //

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

  const clientTransactions = useMemo(() => {
    if (!clientId) return [];
    let filtered = mergedTransactions.filter((t) => t.client?._id === clientId);

    // Apply transaction type filter
    if (transactionTypeFilter !== "all") {
      const typeMap: { [key: string]: string } = {
        purchase: "PURCHASE",
        "pick-up": "PICKUP",
        pickup: "PICKUP",
      };

      const filterType = typeMap[transactionTypeFilter];
      if (filterType) {
        filtered = filtered.filter((t) => t.type === filterType);
      }
    }

    if (staffFilter !== "all-staff") {
      filtered = filtered.filter((t) => t.userId?.name === staffFilter);
    }
    if (dateFrom) {
      filtered = filtered.filter((t) => new Date(t.createdAt) >= dateFrom);
    }
    if (dateTo) {
      filtered = filtered.filter((t) => new Date(t.createdAt) <= dateTo);
    }

    return filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [
    clientId,
    dateFrom,
    dateTo,
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
      case "delete":
        setShowDialog(true);
        break;
      default:
        break;
    }
  };

  const handleDeleteSuccess = () => {
    toast.success("Client deleted successfully");
    navigate(-1);
  };
  const handleEditSuccess = () => {
    toast.success("Client updated successfully");
  };

  const handleApplyFilters = () => {
    // Filters are applied automatically via useMemo
    console.log("Filters applied:", {
      transactionTypeFilter,
      staffFilter,
      dateFrom,
      dateTo,
    });
  };

  // Loading states
  if (!clients || clients.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2ECC71] mx-auto mb-4"></div>
          <p>Loading clients...</p>
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
          <Button onClick={() => navigate("/clients")}>Back to Clients</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="grid md:grid-cols-5 grid-cols-1 items-center py-3 md:px-10">
        <div className="flex gap-5 justify-between md:justify-start col-span-2 md:col-span-2 px-5 md:px-0">
          <button
            onClick={() => navigate(-1)}
            className="flex gap-1 items-center text-[#7D7D7D] cursor-pointer"
          >
            <ChevronLeft />
            <span>Back</span>
          </button>
          <p className="lg:text-lg text-sm text-[#333333]">
            Client Account Management
          </p>
        </div>
        <div className="flex justify-end gap-4 my-4 md:mx-7 col-span-3 md:col-span-3 border-t-[#D9D9D9] md:border-none border-t-2 pt-2 md:pt-0 transition-all px-5 md:px-0">
          <Button className="bg-white hover:bg-gray-100 text-text-dark border border-[#7D7D7D]">
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
                  <SelectItem value="suspend">Suspend Client</SelectItem>
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
        <section className=" bg-white py-8 px-5 rounded lg:col-span-3">
          <Tabs className="space-y-4" defaultValue="clientTransaction">
            <TabsList className="flex gap-2 lg:justify-start justify-evenly ">
              <TabsTrigger value="clientTransaction">Transaction</TabsTrigger>
              <TabsTrigger value="clientDiscount">Discount</TabsTrigger>
            </TabsList>

            <TabsContent value="clientTransaction">
              {/* data */}
              <div className=" flex justify-start items-center flex-wrap w-full gap-4 md:gap-1  lg:gap-4 mb-10">
                <div className="flex flex-col sm:w-[230px] md:w-[210px] transition-all w-full ">
                  <label className="text-xs font-medium text-gray-600 ">
                    Date from
                  </label>
                  <div className="relative sm:w-[230px] md:w-[210px] transition-all w-full  border rounded-lg p-[6px]">
                    <CustomDatePicker
                      selected={dateFrom}
                      onChange={setDateFrom}
                      className=" "
                    />
                    <svg
                      className="w-5 h-5 text-gray-400 absolute right-2 top-2 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>

                <div className="flex flex-col sm:w-[230px] md:w-[210px] transition-all w-full   ">
                  <label className="text-xs font-medium text-gray-600">
                    Date to
                  </label>
                  <div className="relative sm:w-[230px] md:w-[210px] transition-all w-full border rounded-lg p-[6px] ">
                    <CustomDatePicker
                      selected={dateTo}
                      onChange={setDateTo}
                      className=""
                    />
                    <svg
                      className="w-5 h-5 text-gray-400 absolute right-2 top-2.5 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>

                <div className="flex flex-col  sm:w-[230px] md:w-[210px] transition-all w-full ">
                  <label className="text-xs font-medium text-gray-600">
                    Transaction type
                  </label>
                  <Select
                    value={transactionTypeFilter}
                    onValueChange={setTransactionTypeFilter}
                  >
                    <SelectTrigger className="  sm:w-[240px] md:w-[210px] transition-all w-full">
                      <SelectValue placeholder="All Transactions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All transactions</SelectItem>
                      <SelectItem value="purchase">Purchase</SelectItem>
                      <SelectItem value="pick-up">Pick-up</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col  sm:w-[230px] md:w-[210px] transition-all w-full">
                  <label className="text-xs font-medium text-gray-600">
                    Staff member
                  </label>
                  <Select value={staffFilter} onValueChange={setStaffFilter}>
                    <SelectTrigger className="  sm:w-[230px] md:w-[210px] transition-all w-full">
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

                <div className="flex flex-col pt-0 sm:pt-4 items-center sm:w-[230px] md:w-[210px] transition-all w-full">
                  <Button
                    className="  bg-[#2ECC71] hover:bg-[#27ae60] text-white font-medium  sm:w-[230px] md:w-[210px] transition-all w-full "
                    onClick={handleApplyFilters}
                  >
                    Apply filters
                  </Button>
                </div>
              </div>

              {/* Transaction summary */}
              <div className="mb-6 p-4 bg-[#F5F5F5] rounded-lg">
                <p className="text-sm text-[#7D7D7D]">
                  Showing {clientTransactions.length} transaction
                  {clientTransactions.length !== 1 ? "s" : ""}
                  {transactionTypeFilter !== "all" &&
                    ` (${transactionTypeFilter})`}
                  {staffFilter !== "all-staff" && ` by ${staffFilter}`}
                </p>
              </div>

              <ClientTransactionDetails
                client={client}
                clientTransactions={clientTransactions}
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
      {/* Edit Client Dialog can be implemented similarly */}
      <EditClientDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        client={client}
        onEditSuccess={handleEditSuccess}
      />
    </>
  );
};

export default ClientDetailsPage;
