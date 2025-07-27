import React from "react";
import { useParams } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import DatePicker from "@/components/DatePicker";
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
import ClientDetailInfo from "@/components/clients/ClientDetailInfo";

const ClientDetailsPage: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { clients } = useClientStore();

  if (!clients || clients.length === 0) {
    return <div>Loading clients...</div>;
  }

  // get client
  const client = clients.find((c) => c._id === clientId);
  console.log("client", client);
  if (!client) {
    return <div>Client not found</div>;
  }

  return (
    <>
      <header className="flex justify-between items-center py-3 px-10">
        <div className="flex gap-10">
          <button
            onClick={() => navigate(-1)}
            className="flex gap-1 items-center text-[#7D7D7D]"
          >
            <ChevronLeft />
            <span>Back</span>
          </button>
          <p className="text-lg text-[#333333]">Client Account Management</p>
        </div>
        <div className="flex justify-end gap-4 my-4 mx-7">
          <Button className="bg-white hover:bg-gray-100 text-text-dark border border-[#7D7D7D]">
            <ChevronUp />
            <span>Export data</span>
          </Button>
          <Select>
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
        </div>
      </header>

      {/* main content */}
      <main className="flex gap-3 bg-[#F5F5F5] py-5 px-12">
        {/* section by the left */}
        <ClientDetailInfo client={client} />
        {/* section by the right */}
        <section className="w-full bg-white py-8 px-5 rounded">
          {/* data */}
          <div className="flex justify-between items-end gap-5 mb-10">
            <div>
              <p className="text-[#7D7D7D] text-[0.625rem] mb-1 ml-1.5">
                Date from
              </p>
              <DatePicker />
            </div>
            <div>
              <p className="text-[#7D7D7D] text-[0.625rem] mb-1 ml-1.5">
                Date to
              </p>
              <DatePicker />
            </div>
            <div>
              <label
                htmlFor="transaction"
                className="text-[#7D7D7D] text-[0.625rem] mb-1 ml-1.5"
              >
                Transaction type
              </label>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Transactions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Select transaction type</SelectLabel>
                    <SelectItem value="all">All transactions</SelectItem>
                    <SelectItem value="purchase">Purchase</SelectItem>
                    <SelectItem value="pick-up">Pick-up</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label
                htmlFor="transaction"
                className="text-[#7D7D7D] text-[0.625rem] mb-1 ml-1.5"
              >
                Staff member
              </label>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Staff" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Select staff</SelectLabel>
                    <SelectItem value="all-staff">All Staff</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <Button className="bg-[#2ECC71] hover:bg-[var(--cl-bg-green-hover)] text-white">
              Apply filters
            </Button>
          </div>
          {/* display data */}
          {client.transactions.length === 0 ? (
            <p className="text-center text-sm text-[#7D7D7D] py-10">
              No transactions found for this client
            </p>
          ) : (
            client.transactions.map((txn) => (
              <div
                key={txn._id}
                className="border rounded-lg px-5 py-3 mb-10 shadow"
              >
                {/* type, date and time, balance */}
                <div className="grid grid-cols-[1fr_5fr_1fr] py-4 border-b border-[#d7d7d7]">
                  <p className="text-xs">{txn.type}</p>
                  <p className="flex flex-col">
                    <span className="text-xs">
                      {new Date(txn.date).toLocaleDateString()}
                    </span>
                    <span className="text-xs">
                      {new Date(txn.date).toLocaleTimeString()}
                    </span>
                  </p>
                  <p
                    className={`${
                      txn.amount > 0 ? "text-[#2ECC71]" : "text-[#F95353]"
                    }`}
                  >
                    ₦{client.balance.toLocaleString()}
                  </p>
                </div>
                {/* details */}
                <div className="flex justify-between px-2 py-5">
                  <div className="w-[220px] space-y-3">
                    <h6 className="text-[#333333] font-normal text-base">
                      Balance Change
                    </h6>

                    <div className="bg-[#F5F5F5] rounded py-2 px-5">
                      <div className="flex justify-between">
                        <p className="text-[9px] text-[#7D7D7D]">Previous</p>
                        <p className="text-[9px] text-[#7D7D7D]">New</p>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-[#444444] text-[13px]">
                          250,00
                        </span>
                        <span>
                          <ArrowRight size={13} />
                        </span>
                        <span className="text-[#444444] text-[13px]">
                          509955
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* transaction details */}
                  <div className="space-y-3">
                    <h6 className="text-[#333333] font-normal text-base">
                      Transaction Details
                    </h6>
                    <div>
                      <p className="font-medium text-[#444444] text-[13px]">
                        Amount:{" "}
                        <span className="font-normal">
                          ₦{client?.balance.toLocaleString()}
                        </span>
                      </p>
                      <p className="font-medium text-[#444444] text-[13px]">
                        Method:{" "}
                        <span className="font-normal">
                          {/*{txn.paymentMethod}*/}
                        </span>{" "}
                      </p>
                    </div>
                  </div>

                  {/* process by */}
                  <div className="space-y-3">
                    <h6 className="text-[#333333] font-normal text-base">
                      Process By
                    </h6>
                    <p className="font-medium text-[#444444] text-[13px]">
                      Staff:
                      <span className="font-normal"> Jane Smith</span>
                    </p>
                    <p className="rounded-[2px] bg-[#E2F3EB] p-0.5 text-center">
                      <span className="text-[#3D80FF] text-xs">
                        INV-2-25-003
                      </span>
                    </p>
                  </div>
                </div>

                {/* partial payment block */}
                <div className="bg-[#F5F5F5] py-4 px-6 rounded-[8px]">
                  <h6 className="text-base text-[#333333] font-normal">
                    Partial Payment Received
                  </h6>
                  <p className="text-[0.625rem] text-[#333333]">
                    Payment towards outstanding balance
                  </p>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </>
  );
};

export default ClientDetailsPage;
