/** @format */

import React, { useMemo, useState } from "react";
import DashboardTitle from "@/features/dashboard/shared/DashboardTitle";
import type { Client } from "@/types/types";
import { Search } from "lucide-react";
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllClients } from "@/services/clientService";
import { VscRefresh } from "react-icons/vsc";
import ClientDirectory from "../shared/ClientDirectory";
import ClientDirectoryMobile from "../shared/mobile/ClientDirectoryMobile";

const StaffClients: React.FC = () => {
  const queryClient = useQueryClient();

  const {
    data: clients = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["clients"],
    queryFn: getAllClients,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    filteredClients: statusBalanceFilter,
    clientBalance,
    setClientBalance,
  } = useClientFiltering(clients);

  const filteredClients = useMemo(() => {
    if (!statusBalanceFilter || statusBalanceFilter.length === 0) {
      return [];
    }

    const searchTermLower = searchTerm.toLowerCase().trim();

    if (!searchTermLower) {
      return statusBalanceFilter;
    }

    return statusBalanceFilter.filter((client) => {
      const nameMatch = client.name?.toLowerCase().includes(searchTermLower);
      const idMatch = client._id?.toLowerCase().includes(searchTermLower);
      const phoneMatch = client.phone?.toLowerCase().includes(searchTermLower);
      const emailMatch = client.email?.toLowerCase().includes(searchTermLower);

      return nameMatch || idMatch || phoneMatch || emailMatch;
    });
  }, [searchTerm, statusBalanceFilter]);

  const handleProcessPayment = (client: Client) => {
    if (!client || !client._id) {
      console.error("Invalid client data");
      return;
    }
    setSelectedClient(client);
    setShowPaymentModal(true);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      // Also invalidate the query cache to force a fresh fetch
      await queryClient.invalidateQueries({ queryKey: ["clients"] });
    } catch (error) {
      console.error("Error refreshing clients:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setSelectedClient(null);
    // Refresh the clients data after successful payment
    queryClient.invalidateQueries({ queryKey: ["clients"] });
  };

  // Loading state
  if (isLoading) {
    return (
      <main>
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 mb-7">
          <DashboardTitle
            heading="Clients"
            description="Search, view, and edit client transaction"
          />
        </div>
        <section className="bg-white rounded-xl mt-5 overflow-hidden border border-[#d9d9d9] min-h-[66vh] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading clients...</p>
          </div>
        </section>
      </main>
    );
  }

  // Error state
  if (isError) {
    return (
      <main>
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 mb-7">
          <DashboardTitle
            heading="Clients"
            description="Search, view, and edit client transaction"
          />
        </div>
        <section className="bg-white rounded-xl mt-5 overflow-hidden border border-[#d9d9d9] min-h-[66vh] flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading clients</p>
            <Button
              onClick={handleRefresh}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Try Again
            </Button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 mb-7">
        <DashboardTitle
          heading="Clients"
          description="Search, view, and edit client transactions"
        />
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="w-40 bg-white hover:bg-[#f5f5f5] text-[#333333] border border-[var(--cl-secondary)] font-Inter font-medium transition-colors duration-200 ease-in-out disabled:opacity-50"
        >
          <VscRefresh className={isRefreshing ? "animate-spin" : ""} />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      <section className="bg-white rounded-xl mt-5 overflow-hidden border border-[#d9d9d9] min-h-[66vh]">
        <h4 className="font-medium text-xl font-Inter text-[#1E1E1E] px-7 pt-4">
          Client directory ({filteredClients.length} clients)
        </h4>

        {/* Search Bar */}
        <div className="flex justify-between items-center px-4 py-5 flex-wrap sm:flex-nowrap sm:px-2 md:px-8 ">
          <div className="bg-[#F5F5F5] flex items-center gap-1 px-4 rounded-md w-full sm:w-1/2 mx-4">
            <Search size={18} className="text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="search"
              placeholder="Search clients by name, ID, phone, or email..."
              className="py-2 outline-0 bg-transparent w-full placeholder:text-gray-400"
            />
          </div>

          <div className="gap-4 pt-4 sm:pt-0 md:gap-3 px-4 md:px-0">
            <Select
              value={clientBalance}
              onValueChange={(value) =>
                setClientBalance(value as clientBalance)
              }
            >
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

        {/* No clients message */}
        {filteredClients.length === 0 && !isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-gray-500 mb-2">
                {searchTerm || clientBalance !== "All Balances"
                  ? "No clients match your search criteria"
                  : "No clients found"}
              </p>
              {(searchTerm || clientBalance !== "All Balances") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setClientBalance("All Balances");
                  }}
                  className="mt-2"
                >
                  Clear filters
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Client Directory - Desktop */}
        {filteredClients.length > 0 && (
          <>
            <ClientDirectory
              searchTerm={searchTerm}
              filteredClientsData={filteredClients}
              onClientAction={handleProcessPayment}
              actionLabel=""
              isStaffView={true}
            />

            <ClientDirectoryMobile
              searchTerm={searchTerm}
              filteredClientsData={filteredClients}
              onClientAction={handleProcessPayment}
              actionLabel="Add Payment"
              isStaffView={true}
            />
          </>
        )}
      </section>

      {/* Payment Modal */}
      {showPaymentModal && selectedClient && (
        <PaymentModal
          client={selectedClient}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedClient(null);
          }}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </main>
  );
};

export default StaffClients;
