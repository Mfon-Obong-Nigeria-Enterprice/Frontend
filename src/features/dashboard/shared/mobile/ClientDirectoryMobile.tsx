// Similarly update ClientDirectoryMobile.tsx - Remove Zustand dependency
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import usePagination from "@/hooks/usePagination";
import type { Client } from "@/types/types";
import { formatCurrency } from "@/utils/formatCurrency";
import { getTypeDisplay } from "@/utils/helpersfunction";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

interface ClientDirectoryMobileProps {
  searchTerm: string;
  filteredClientsData: Client[];
  onClientAction?: (client: Client) => void;
  actionLabel?: string;
  isStaffView?: boolean;
}

const ClientDirectoryMobile: React.FC<ClientDirectoryMobileProps> = ({
  searchTerm,
  filteredClientsData,
  onClientAction,
  actionLabel = "view",
  isStaffView = false,
}) => {
  const navigate = useNavigate();

  // Use the provided filtered data directly, then apply search filter
  const filteredClients = filteredClientsData.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // this is where the transaction is coming from
  const getClientTransaction = (client: Client) => {
    if (
      !client.transactions ||
      !Array.isArray(client.transactions) ||
      client.transactions.length === 0
    ) {
      return null;
    }

    const sortedTransaction = [...client.transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return sortedTransaction[0] || null;
  };

  const {
    currentPage,
    totalPages,
    goToPreviousPage,
    goToNextPage,
    canGoPrevious,
    canGoNext,
  } = usePagination(filteredClients.length, 4);

  // Memoized current page using useMemo since the value is an object
  const currentClient = useMemo(() => {
    const startIndex = (currentPage - 1) * 4;
    const endIndex = startIndex + 4;
    return filteredClients.slice(startIndex, endIndex);
  }, [filteredClients, currentPage]);

  const handleViewClient = (client: Client) => {
    // Navigate to client details page
    if (onClientAction) {
      onClientAction(client);
    } else {
      navigate(`/clients/${client._id}`);
    }
  };

  return (
    <section className=" lg:hidden px-4 mt-2 mb-4 block">
      <ul className="space-y-3">
        {currentClient.map((client, idx) => {
          const lastTransaction = getClientTransaction(client);
          return (
            <li
              key={idx}
              className="bg-white flex flex-col gap-2 border-b-2 border-[#D9D9D9] "
            >
              <div className="flex justify-between items-center ">
                <p>{client.name}</p>
                <p>
                  {" "}
                  <Badge
                    variant="outline"
                    className={`uppercase p-2 w-[85px] text-[12px] border rounded-2xl ${
                      lastTransaction?.type === "PURCHASE"
                        ? "border border-[#F95353] bg-[#FFCACA] text-[#F95353] rounded-2xl"
                        : lastTransaction?.type === "PICKUP"
                        ? "border border-[#FFA500] bg-[#FFE7A4] text-[#FFA500] rounded-2xl"
                        : lastTransaction?.type === "DEPOSIT"
                        ? "border border-[#2ECC71] bg-[#C8F9DD] text-[#2ECC71] rounded-2xl"
                        : "bg-gray-100 rounded-2xl text-gray-300 border border-gray-300 "
                    }`}
                  >
                    {lastTransaction
                      ? getTypeDisplay(lastTransaction.type)
                      : "New Client"}
                  </Badge>
                </p>
              </div>
              <div>
                <p className="font-[400] text-[#444444] text-sm">
                  {lastTransaction
                    ? new Date(lastTransaction.date).toLocaleDateString()
                    : new Date(client.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex justify-between items-center gap-2 pb-2">
                <div>
                  <p className={`font-[400] text-[#444444] text-sm `}>
                    {lastTransaction
                      ? formatCurrency(Math.abs(lastTransaction.amount))
                      : "₦0"}
                  </p>
                </div>

                <div>
                  <span>Balance:</span>
                  <span
                    className={`font-medium ${
                      client.balance > 0
                        ? "text-green-400"
                        : client.balance < 0
                        ? "text-red-400"
                        : "text-gray-300"
                    } `}
                  >
                    {client.balance < 0 ? "-" : client.balance > 0 ? "+" : ""}₦
                    {Math.abs(client.balance).toLocaleString()}
                  </span>
                </div>
                {isStaffView ? (
                  client.balance < 0 ? (
                    <Button
                      variant="ghost"
                      className="border-[#3D80FF] border text-[#3D80FF] cursor-pointer hover:text-[#3D80FF] transition-colors duration-200 ease-in-out"
                      onClick={() => handleViewClient(client)}
                    >
                      Add payment
                    </Button>
                  ) : null
                ) : (
                  <Button
                    variant="link"
                    size="icon"
                    className="text-[#3D80FF] text-sm underline ring-offset-1 font-[400] cursor-pointer"
                    onClick={() => handleViewClient(client)}
                  >
                    {actionLabel}
                  </Button>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <Button
          onClick={goToPreviousPage}
          disabled={!canGoPrevious}
          className={`px-4 py-2 bg-gray-300 rounded ${
            !canGoPrevious ? "cursor-not-allowed" : ""
          }`}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={goToNextPage}
          disabled={!canGoNext}
          className={`px-4 py-2 bg-gray-300 rounded ${
            !canGoNext ? "cursor-not-allowed" : ""
          }`}
        >
          Next
        </Button>
      </div>
    </section>
  );
};

export default ClientDirectoryMobile;
