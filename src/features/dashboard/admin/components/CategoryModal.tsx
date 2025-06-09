import Button from "@/components/MyButton";

type modalProps = {
  setOpenModal: () => void;
  categoryName: string;
  productCount: number;
};

const CategoryModal = ({
  setOpenModal,
  categoryName,
  productCount,
}: modalProps) => {
  return (
    <div
      onClick={setOpenModal}
      className="fixed top-0 left-0 bg-[rgba(0,0,0,0.2)] flex justify-center items-center w-full h-screen z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white shadow-md min-h-50 rounded-md px-5 py-10 max-w-[510px]"
      >
        <div className="flex justify-between">
          <h3 className="font-bold text-lg">{categoryName}</h3>
          <Button
            text="X"
            variant="custom"
            className="w-fit p-0"
            fullWidth={false}
            onClick={setOpenModal}
          />
        </div>
        <div className="mt-[5dvh]">
          <p className="text-center leading-relaxed text-[var(--cl-text-semidark)]">
            High-quality {`${categoryName.toLowerCase()}`} products for
            construction projects. Includes various grades and type Suitable for
            difference building applications.
          </p>
        </div>
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
