import Modal from "@/components/Modal";
import { useTransactionsStore } from "@/stores/useTransactionStore";

const TransactionModal = () => {
  const { open, selectedTransaction, closeModal, transactions } =
    useTransactionsStore();

  if (!transactions) return null;
  console.log("select", selectedTransaction);
  return (
    <Modal isOpen={open} onClose={closeModal}>
      <h3 className="text-center pb-2 mb-2 border-b border-gray-300 font-bold text-[#7d7d7d]">
        Transaction Details
      </h3>
      {selectedTransaction && (
        <div className="">
          <div className="flex justify-between items-center gap-10">
            <span
              className={`border text-xs rounded-3xl py-1 px-2 ${
                selectedTransaction.type === "PURCHASE"
                  ? "border-[#F95353] bg-[#FFCACA] text-[#F95353]"
                  : "border-[#FFA500] bg-[#FFE7A4] text-[#FFA500]"
              }`}
            >
              {selectedTransaction?.type}
            </span>
            <p className="flex flex-col gap-0.5">
              <span className="text-xs text-[#444444]">Invoice Number:</span>
              <span className="text-sm text-[#333333] font-medium text-center">
                {selectedTransaction?.invoiceNumber}
              </span>
            </p>
            <p className="flex flex-col gap-0.5">
              <span className="text-[#333333] text-xs font-medium">
                {new Date(selectedTransaction?.createdAt).toDateString()}
              </span>
              <span className="text-[#333333] text-xs font-medium">
                {new Date(selectedTransaction?.createdAt).toLocaleTimeString()}
              </span>
            </p>
          </div>

          {/* name and phone number */}
          {selectedTransaction.walkInClient && (
            <div className="grid grid-cols-2 text-sm border-b border-[#d9d9d9] py-2 mb-2">
              <p>
                Walk in Client:
                <span className="ml-1">
                  {selectedTransaction.walkInClient.name}
                </span>
              </p>
              <p>
                Phone:
                <span className="ml-1">
                  {selectedTransaction.walkInClient.phone}
                </span>
              </p>
            </div>
          )}

          <div className="flex justify-between items-center text-sm border-b border-[#d9d9d9] my-5 pb-2">
            <div className="flex gap-1">
              <p>Status:</p>
              <p>{selectedTransaction.status}</p>
            </div>

            {selectedTransaction.waybillNumber !== null && (
              <div>
                <p>
                  <span>Weigh bill number</span>
                  <span>{selectedTransaction.waybillNumber}</span>
                </p>
              </div>
            )}
            {/* if a client, show balance */}
            {selectedTransaction.clientBalance !== null && (
              <div className="flex items-center gap-1">
                <p className="text-sm">Client Balance:</p>
                <p
                  className={`text-base font-bold ${
                    selectedTransaction.clientBalance !== null &&
                    typeof selectedTransaction.clientBalance === "number" &&
                    selectedTransaction.clientBalance < 0
                      ? "text-[#F95353]"
                      : "text-[#2ECC71]"
                  }`}
                >
                  {selectedTransaction.clientBalance !== null ? (
                    <>
                      {selectedTransaction?.clientBalance < 0 ? "-" : ""}₦
                      {Math.abs(
                        selectedTransaction?.clientBalance
                      ).toLocaleString()}
                    </>
                  ) : (
                    "No balance"
                  )}
                </p>
              </div>
            )}
          </div>

          {/* amount */}
          <div className="flex justify-between items-center gap-3 text-sm py-3 border-b border-[#d9d9d9] my-4">
            <p>
              <span className="text-[#444444]">Total cost:</span>
              <span className="text-[#333333] font-bold ml-1">
                {selectedTransaction.subtotal}
              </span>
            </p>
            {selectedTransaction.discount > 0 && (
              <p>
                <span className="text-[#444444]">Discount:</span>
                <span className="text-[#333333] font-bold ml-1">
                  {selectedTransaction.discount}
                </span>
              </p>
            )}

            <p>
              <span className="text-[#444444]">Total paid:</span>
              <span className="text-[#333333] font-bold ml-1">
                {selectedTransaction.total}
              </span>
            </p>
          </div>
          {/* items bought */}
          <h6 className="mb-2">Items bought</h6>
          <ul className="grid grid-cols-2 gap-7">
            {selectedTransaction.items.map((item) => (
              <li
                key={item.productId}
                className="p-2 border border-l-4 border-gray-200 rounded-lg"
              >
                <p className="text-xs font-medium text-[#333333]">
                  Product:
                  <span className="ml-1 font-normal text-xs">
                    {item.quantity} {item.unit} {item.productName}
                  </span>
                </p>
                <p className="text-xs font-medium text-[#333333]">
                  Unit price:
                  <span className="ml-1 font-normal text-xs">
                    {item.unitPrice}
                  </span>
                </p>
              </li>
            ))}
          </ul>
          <article className="space-y-4 mt-5">
            <div className="bg-[#f5f5f5] text-[#333333] flex flex-col gap-1 px-2 py-4 rounded my-1">
              <p className="text-sm font-medium">Payment method:</p>
              <p className="text-xs">{selectedTransaction.paymentMethod}</p>
            </div>
          </article>

          {/* notes if any */}
          {selectedTransaction.notes && (
            <div className="bg-[#f9f9f9] text-sm p-3 my-4">
              <p>Note:</p>
              <p className="text-xs text-[#333333]">
                {selectedTransaction.notes}
              </p>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default TransactionModal;
