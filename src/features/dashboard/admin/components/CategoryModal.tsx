/** @format */

import { Button } from "@/components/ui/button";

type modalProps = {
  setOpenModal: () => void;
  categoryName: string;
  description?: string;
  productCount: number;
  // units: string[];
};

const CategoryModal = ({
  setOpenModal,
  categoryName,
  description,
  productCount,
}: // units,
modalProps) => {
  return (
    <div
      onClick={setOpenModal}
      className="fixed top-0 left-0 bg-[rgba(0,0,0,0.2)] flex justify-center items-center w-full h-screen z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white shadow-md min-h-50 rounded-md px-5 py-10 min-w-lg max-w-2xl max-h-[90vh] overflow-auto"
      >
        <div className="flex justify-between">
          <h3 className="font-bold text-lg">{categoryName}</h3>
          <Button variant="ghost" className="w-fit p-0" onClick={setOpenModal}>
            X
          </Button>
        </div>
        <div className="mt-[5dvh]">
          <p className="text-center leading-relaxed text-[var(--cl-text-semidark)]">
            {description}
          </p>
        </div>
        {/* <div className="mt-3">
          <h5 className="border-b border-gray-200 mb-1.5 font-medium">
            Units:
          </h5>
          <div>
            {units.join(", ")}
            {/* {units.map((unit, index) => (
              <p key={index} className="text-xs">
                {unit.join(",")}
              </p>
            ))} */}
        {/* </div>
        </div> */}
        <div className="bg-[var(--cl-bg-light)] max-w-[70%] mt-10 mx-auto p-4 rounded flex flex-col justify-around items-center">
          <p className="text-sm text-[var(--cl-text-dark)] font-semibold">
            {productCount}
          </p>
          <p className="text-[var(--cl-secondary)] text-[0.75rem]">Products</p>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
