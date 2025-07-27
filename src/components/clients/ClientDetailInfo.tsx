// import { useClientStore } from "@/stores/useClientStore";
import { balanceClass, balanceTextClass } from "@/utils/format";
import type { Client } from "@/types/types";

const ClientDetailInfo = ({ client }: { client: Client }) => {
  //   const { clients } = useClientStore();

  return (
    <section className="w-[40%] bg-white py-8 px-5 rounded">
      {client && (
        <div>
          <p className="text-lg text-[#333333] mb-6">
            {client.name ?? "Unknown"}
          </p>
          <div
            className={`flex flex-col justify-center gap-1 min-h-18 border-l-4 text-xs py-1.5 px-3 rounded-[8px] ${balanceClass(
              client.balance
            )}
                 
            }`}
          >
            <p className="text-[#444444] text-xs">Current balance</p>
            <p
              className={`text-lg font-bold ${balanceTextClass(
                client.balance
              )}`}
            >
              {client.balance && client.balance < 0 ? "-" : ""}₦
              {Math.abs(Number(client.balance))?.toLocaleString()}
            </p>
          </div>

          {/* info */}
          <article className="my-7">
            <div className="flex justify-between items-center py-2.5 border-b border-[#d9d9d9] text-[#7D7D7D] text-[0.6875rem]">
              <p>Phone</p>
              <p>{client.phone ?? "No phone number"}</p>
            </div>
            <div className="flex justify-between items-center py-2.5 border-b border-[#d9d9d9] text-[#7D7D7D] text-[0.6875rem]">
              <p>Address</p>
              <address>{client.address || "No address provided"}</address>
            </div>
            <div className="flex justify-between items-center py-2.5 border-b border-[#d9d9d9] text-[#7D7D7D] text-[0.6875rem]">
              <p>Registered</p>
              <p>{new Date(client.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex justify-between items-center py-2.5 border-b border-[#d9d9d9] text-[#7D7D7D] text-[0.6875rem]">
              <p>Last activity</p>
              <p>
                {client.lastTransactionDate &&
                  new Date(client.lastTransactionDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex justify-between items-center py-2.5 border-b border-[#d9d9d9] text-[#7D7D7D] text-[0.6875rem]">
              <p>Account status</p>
              <p className={`capitalize ${balanceTextClass(client.balance)}`}>
                {client.balance && client.balance > 0 ? "credit" : "Overdue"}
              </p>
            </div>
          </article>
          {/* description */}
          {client.description && (
            <div className="bg-[#F5F5F5] p-4 rounded-md border border-[#d9d9d9] mt-5">
              <p className="text-[0.625rem] text-[#7D7D7D] mb-1">
                Client Description
              </p>
              <p className="text-[0.625rem] text-[#444444]">
                {client.description}
              </p>
            </div>
          )}
          {/* data */}
          <ul className="grid grid-cols-2 gap-5 mt-5">
            <li className="bg-[#F5F5F5] flex flex-col gap-0.5 justify-center items-center rounded-[8px] p-5">
              <span className="text-sm text-[#333333] font-semibold">
                {client.transactions.length}
              </span>
              <span className="text-xs text-[#444444] font-normal">
                Total order
              </span>
            </li>

            <li className="bg-[#F5F5F5] flex flex-col gap-0.5 justify-center items-center rounded-[8px] p-5">
              <span className="text-sm text-[#333333] font-semibold">
                ₦1.8M
              </span>
              <span className="text-xs text-[#444444] font-normal">
                Lifetime value
              </span>
            </li>

            <li className="bg-[#F5F5F5] flex flex-col gap-0.5 justify-center items-center rounded-[8px] p-5">
              <span className="text-sm text-[#333333] font-semibold">30</span>
              <span className="text-xs text-[#444444] font-normal">
                Days overdue
              </span>
            </li>

            <li className="bg-[#F5F5F5] flex flex-col gap-0.5 justify-center items-center rounded-[8px] p-5">
              <span className="text-sm text-[#333333] font-semibold">2</span>
              <span className="text-xs text-[#444444] font-normal">
                Pending invoices
              </span>
            </li>
          </ul>
        </div>
      )}
    </section>
  );
};

export default ClientDetailInfo;
