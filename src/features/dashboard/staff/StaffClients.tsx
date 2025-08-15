/** @format */

import React, { useMemo, useState } from "react";
import DashboardTitle from "@/features/dashboard/shared/DashboardTitle";
import ClientDirectory from "../admin/components/ClientDirectory";
// import { useSyncClientsWithQuery } from "@/stores/useClientStore";
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
import { useQuery } from "@tanstack/react-query";
import { getAllClients } from "@/services/clientService";
import { VscRefresh } from "react-icons/vsc";

const StaffClients: React.FC = () => {
  // useSyncClientsWithQuery();
  //Get clients from rectQuery not zustand store
  const { data: clients } = useQuery({
    queryKey: ["clients"],
    queryFn: getAllClients,
    staleTime: 5 * 60 * 1000,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const {
    filteredClients: statusBalanceFilter,
    clientBalance,
    setClientBalance,
  } = useClientFiltering(clients);

  const filteredClients = useMemo(() => {
    return statusBalanceFilter.filter(
      (client) =>
        client.name.includes(searchTerm.toLowerCase()) ||
        client._id.includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, statusBalanceFilter]);

  const handleProcessPayment = (client: Client) => {
    setSelectedClient(client);
    setShowPaymentModal(true);
  };

  return (
    <main>
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 mb-7">
        <DashboardTitle
          heading="Clients"
          description="Search, view, and edit client transaction"
        />
        <Button
          onClick={() => window.location.reload()}
          className="w-40 bg-white hover:bg-[#f5f5f5] text-[#333333] border border-[var(--cl-secondary)] font-Inter font-medium transition-colors duration-200 ease-in-out"
        >
          <VscRefresh />
          Refresh
        </Button>
      </div>

      <section className="bg-white rounded-xl mt-5 overflow-hidden border border-[#d9d9d9] min-h-[66vh]">
        <h4 className="font-medium text-xl font-Inter text-[#1E1E1E] px-7 pt-4">
          Client directory
        </h4>
        {/* Search Bar */}
        <div className="flex justify-between items-center px-4 py-5 flex-wrap sm:flex-nowrap sm:px-2 md:px-8 ">
          <div className="bg-[#F5F5F5] flex items-center gap-1 px-4 rounded-md w-full sm:w-1/2  mx-4">
            <Search size={18} />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="search"
              placeholder="Search clients by name or ID..."
              className="py-2 outline-0 bg-transparent w-full"
            />
          </div>

          {/*  */}
          <div className=" gap-4 pt-4 sm:pt-0  md:gap-3 px-4 md:px-0">
            {/* <Select
              value={clientStatus}
              onValueChange={(value) => setClientStatus(value as clientStat)}
            >
              <SelectTrigger className="w-40 bg-[#D9D9D9] text-[#444444] border border-[#7d7d7d]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Status">All Status</SelectItem>
                <SelectItem value="Registered">Registered</SelectItem>
                <SelectItem value="Unregistered">Unregistered</SelectItem>
              </SelectContent>
            </Select> */}

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

        <ClientDirectory
          searchTerm={searchTerm}
          filteredClientsData={filteredClients}
          onClientAction={handleProcessPayment}
          actionLabel=""
          isStaffView={true}
        />
      </section>

      {/* Payment Modal */}
      {showPaymentModal && selectedClient && (
        <PaymentModal
          client={selectedClient}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={() => {
            // Refresh data or show success message
            setShowPaymentModal(false);
            setSelectedClient(null);
          }}
        />
      )}
    </main>
  );
};

export default StaffClients;
