import Modal from "@/components/Modal";
import { useTransactionsStore } from "@/stores/useTransactionStore";
import { ArrowRight, MapPin, Phone, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";

const ClientTransactionModal = () => {
  const navigate = useNavigate();
  const { open, selectedTransaction, closeModal, transactions } =
    useTransactionsStore();

  if (!transactions) return null;

  return (
    <Modal isOpen={open} onClose={closeModal} size="xxl">
      <h4 className="text-lg text-text-dark font-medium pt-3 px-6 mb-2 border-b border-[#d9d9d9]">
        Transaction Details
      </h4>
      {selectedTransaction && selectedTransaction.clientId && (
        <div className="">
          {/* customer information */}
          <div
            className={`flex justify-between border border-l-[6px] mx-6 ${
              selectedTransaction.client?.balance !== null &&
              typeof selectedTransaction.client?.balance === "number" &&
              selectedTransaction.client?.balance < 0
                ? "border-[#DA251C] bg-[#FFE9E9] text-[#F95353]"
                : selectedTransaction.client?.balance > 0
                ? "border-[#2ECC71] bg-[#C8F9DD] text-[#2ECC71]"
                : "border-[#7d7d7d] bg-[#f6f6f6] text-[#7d7d7d]"
            } mt-7 mb-5 p-3 rounded-[0.875rem]`}
          >
            <div className="space-y-2">
              <p className="text-[#444444] font-medium">
                {selectedTransaction?.clientName}
                {/* ||
                    selectedTransaction?.walkInClientName */}
              </p>
              <address className="flex gap-0.5 items-center text-[#444444] text-sm">
                <MapPin size={14} />
                <span>{selectedTransaction.client?.address}</span>
              </address>
              <p className="flex gap-1 items-center text-[#444444] text-sm">
                <Phone size={14} />
                <span>
                  {selectedTransaction.clientId?.phone}
                  {/* selectedTransaction.walkInClient?.phone} */}
                </span>
              </p>
            </div>
            <div>
              <p className={`font-normal text-base`}>
                {selectedTransaction.client?.balance &&
                selectedTransaction.client?.balance < 0
                  ? "-"
                  : ""}
                ₦
                {Math.abs(
                  selectedTransaction.client?.balance ?? 0
                ).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
              {/* <div className="bg-[#FFE7A4] py-2 px-2.5 rounded mt-1">
                <p className="text-[#444444CC] text-[0.625rem]">
                  30 days overdue
                </p>
              </div> */}
              {selectedTransaction?.createdAt &&
                (() => {
                  const createdAt = new Date(selectedTransaction.createdAt);
                  const today = new Date();
                  const diffInMs = today.getTime() - createdAt.getTime();
                  const diffInDays = Math.floor(
                    diffInMs / (1000 * 60 * 60 * 24)
                  );

                  return diffInDays > 10 ? (
                    <div className="bg-[#FFE7A4] py-2 px-2.5 rounded mt-1">
                      <p className="text-[#444444CC] text-[0.625rem]">
                        {diffInDays} days overdue
                      </p>
                    </div>
                  ) : null;
                })()}
            </div>
          </div>

          {/* current transaction */}
          <div className="py-2 px-6">
            <h6 className="text-[#333333] text-lg font-medium">
              Current Transaction
            </h6>

            <div className="px-4 py-6 my-2 border border-[#D9D9D9] rounded-[0.625rem] shadow">
              <div className="flex justify-between border-b bordet-[#d9d9d9] pb-3">
                <div className="flex gap-6 items-center">
                  <span
                    className={`border text-xs rounded-3xl py-1 px-2 capitalize ${
                      selectedTransaction.type === "PURCHASE"
                        ? "border-[#F95353] bg-[#FFCACA] text-[#F95353]"
                        : "border-[#FFA500] bg-[#FFE7A4] text-[#FFA500]"
                    }`}
                  >
                    {selectedTransaction?.type.toLowerCase()}
                  </span>
                  <p className="">
                    <span className="text-[#333333] text-sm">
                      {new Date(selectedTransaction?.createdAt).toDateString()}
                    </span>
                    <span className="block text-[#333333] text-[0.625rem]">
                      {new Date(
                        selectedTransaction?.createdAt
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </p>
                </div>
                <div>
                  {selectedTransaction.client.balance && (
                    <p
                      className={`font-normal text-base ${
                        selectedTransaction.client.balance > 0
                          ? "text-[#00C853]"
                          : "text-[#F95353]"
                      }`}
                    >
                      {selectedTransaction.client?.balance < 0 ? "-" : ""}₦
                      {Math.abs(
                        selectedTransaction.client?.balance ?? 0
                      ).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  )}
                </div>
              </div>
              {/* next part */}
              <div className="flex justify-between py-5">
                {/* three cols */}

                <div className="w-full flex justify-between gap-4 border-b border-[#d9d9d9] pb-5">
                  <div className="space-y-2">
                    <p className="text-[#333333] font-normal text-base">
                      Balance Change
                    </p>
                    {/* prev and new bal. */}
                    <div className="bg-[#F5F5F5] rounded py-2 px-5">
                      <div className="grid grid-cols-3">
                        <p className="text-[9px] text-[#7D7D7D] text-center">
                          Previous
                        </p>
                        <p></p>
                        <p className="text-[9px] text-[#7D7D7D] text-center">
                          New
                        </p>
                      </div>

                      <div className="grid grid-cols-3">
                        <span className="text-[#444444] text-[13px]">
                          {selectedTransaction.client?.balance &&
                            `₦
${(
  selectedTransaction.total + selectedTransaction?.client?.balance
).toLocaleString()}`}
                        </span>

                        <span className="inline-flex self-center justify-self-center">
                          <ArrowRight size={13} />
                        </span>
                        <span className="text-[#444444] text-[13px]">
                          ₦
                          {selectedTransaction.client?.balance?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* transaction details */}
                  <div className="space-y-2">
                    <h6 className="text-[#333333] font-normal text-base">
                      Transaction Details
                    </h6>
                    <div>
                      <p className="font-medium text-[#444444] text-[13px]">
                        Amount:{" "}
                        <span className="font-normal">
                          ₦{selectedTransaction?.total.toLocaleString()}
                        </span>
                      </p>
                      <p className="font-medium text-[#444444] text-[13px]">
                        Method:{" "}
                        <span className="font-normal">
                          {selectedTransaction.paymentMethod}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* process by */}
                  <div className="space-y-2">
                    <h6 className="text-[#333333] font-normal text-base">
                      Process By
                    </h6>
                    <p className="font-medium text-[#444444] text-[13px]">
                      Staff:
                      <span className="font-normal ml-1">
                        {selectedTransaction?.userId.name}
                      </span>
                    </p>
                    <p className="rounded-[2px] bg-[#E2F3EB] p-0.5 text-center">
                      <span className="text-[#3D80FF] text-xs">
                        {selectedTransaction.invoiceNumber}
                      </span>
                      {selectedTransaction.waybillNumber !== null && (
                        <p>
                          <span>Way bill number:</span>
                          <span>{selectedTransaction.waybillNumber}</span>
                        </p>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* items bought */}
              <h6 className="font-normal text-base text-[#333333] mb-3">
                Product Purchase:
              </h6>
              <ul className="grid grid-cols-3 gap-7">
                {selectedTransaction.items.map((item) => (
                  <li
                    key={item.productId}
                    className="bg-[#F5F5F5] min-h-20 flex flex-col justify-center py-2.5 px-3 border-l-4 border-[#2ECC71] rounded-[8px]"
                  >
                    <p className="text-xs font-medium text-[#333333]">
                      {item.unit} {item.productName}
                    </p>
                    <p className="flex items-center gap-1.5 text-[9px] text-[#7D7D7D]">
                      {item.unit} <X size={10} /> {item.quantity}
                    </p>
                    <p className="text-[13px] font-medium text-[#2ECC71]">
                      ₦{item.unitPrice.toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* discounts */}
            <p className="bg-[#FFE7A4] mt-5 mb-10 px-3 py-3 rounded-[0.625rem] ">
              <span className="mr-1 text-sm text-[#7d7d7d]">
                Total Discount:
              </span>
              <span className="text-sm text-[#7D7D7D] font-medium">
                {selectedTransaction?.discount
                  ? `₦
${selectedTransaction.discount.toLocaleString()}`
                  : "No Discounts Applied..."}
              </span>
            </p>
          </div>
          {/* buttons */}
          <div className="bg-[#F5F5F5] py-5 px-5 flex justify-end items-center gap-10">
            {/* <Button className="bg-[#FFC761] hover:bg-[#FFE7A4] text-[#444444]">
              Send Payment Reminder
            </Button> */}
            <Button
              onClick={() =>
                navigate(`/clients/${selectedTransaction?.clientId._id}`)
              }
              className="bg-white text-[#444444] border border-[#7D7D7D]"
            >
              View Full Details
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ClientTransactionModal;
