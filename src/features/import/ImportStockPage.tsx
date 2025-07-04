import { StockStep } from "@/features/import/StockStep";

const ImportStockPage = () => {
  return (
    <main className="bg-[#F5F5F5] flex justify-center items-center min-h-screen">
      <section className="w-full max-w-3xl  bg-white border border-[#D9D9D9] rounded py-5 mx-2.5">
        <StockStep />
      </section>
    </main>
  );
};

export default ImportStockPage;
