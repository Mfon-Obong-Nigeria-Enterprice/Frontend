import EditnDelete from "@/components/EditnDelete";
import { IoIosArrowRoundUp } from "react-icons/io";

type prodProps = {
  ProductTitle: string;
  category: string;
  stockValue: string;
  unitPrice: string;
  totalValue: string;
  minLevel: string;
  stock?: string;
};
const ProductDisplayTab = ({
  ProductTitle,
  category,
  stockValue,
  unitPrice,
  totalValue,
  minLevel,
  stock = "high",
}: prodProps) => {
  return (
    <article className="bg-white border border-[var(--cl-border-gray)] rounded-[8px] p-4 mt-6 font-Arial hover:shadow-2xl hover:border-green-400 transition-all duration-300 ease-in-out">
      <div className="flex justify-between">
        <div>
          <h6 className="text-lg font-normal text-[var(--cl-text-gray)]">
            {ProductTitle}
          </h6>
          <p className="bg-[var(--cl-bg-light)] rounded text-[0.75rem] text-[var(--cl-secondary)] inline-block py-1.5 px-5">
            {category}
          </p>
        </div>
        <div>
          <EditnDelete />
        </div>
      </div>

      {/* stock begins */}
      <div className="grid grid-cols-2 gap-1.5 mt-4">
        <div>
          <p className="text-[0.75rem] text-[var(--cl-secondary)] mb-1">
            Stock
          </p>
          <p className="font-medium text-[var(--cl-text-semidark)] text-[0.8125rem]">
            {stockValue}
          </p>
        </div>
        <div>
          <p className="text-[0.75rem] text-[var(--cl-secondary)] mb-1">
            Unit price
          </p>
          <p className="font-medium text-[var(--cl-text-semidark)] text-[0.8125rem]">
            {`₦${unitPrice}`}
          </p>
        </div>
        <div>
          <p className="text-[0.75rem] text-[var(--cl-secondary)] mb-1">
            Total value
          </p>
          <p className="font-medium text-[var(--cl-text-semidark)] text-[0.8125rem]">
            {`₦${totalValue}`}
          </p>
        </div>
        <div>
          <p className="text-[0.75rem] text-[var(--cl-secondary)] mb-1">
            Minimum level
          </p>
          <p className="font-medium text-[var(--cl-text-semidark)] text-[0.8125rem]">
            {minLevel}
          </p>
        </div>
      </div>
      <div
        className={`mt-10 border rounded px-1 py-1 text-[.75rem] flex gap-0.5 items-center ${
          stock === "high"
            ? "border-[var(--cl-bg-green)] bg-[var(--cl-bg-light-green)] text-[var(--cl-bg-green)]"
            : "border-[#F95353] bg-[#FFE4E2] text-[#F95353]"
        }`}
      >
        <IoIosArrowRoundUp size={16} />
        <p>
          {`stock ${
            stock === "high" ? "High stock" : "Low Stock - Reorder soon"
          }`}
        </p>
      </div>
    </article>
  );
};

export default ProductDisplayTab;
