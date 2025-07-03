import { useGoBack } from "@/hooks/useGoBack";
import { X, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useImportStore } from "@/stores/useImportStore";

const fileData = [
  {
    product: "Dangote cement",
    category: "cement",
    stock: 500,
    unitPrice: 50000,
  },
  {
    product: "16mm cement",
    category: "Steel Rod",
    stock: 150,
    unitPrice: 4000,
  },
  {
    product: "16mm cement",
    category: "Steel Rod",
    stock: 150,
    unitPrice: 4000,
  },
  {
    product: "16mm cement",
    category: "Steel Rod",
    stock: 150,
    unitPrice: 4000,
  },
];

const ImportView = () => {
  const { setStep } = useImportStore();
  const goBack = useGoBack();

  return (
    <div>
      <div className="flex justify-between px-5 pb-4 border-b border-[#d9d9d9]">
        <h4 className="text-lg font-medium text-[#333333]"> Import stock</h4>
        <button
          className="h-7 w-7 inline-flex justify-center items-center border border-full rounded-full"
          onClick={() => goBack()}
        >
          <X size={14} />
        </button>
      </div>
      <div className="px-5 pt-8 space-y-6">
        {/* uploaded file */}
        <div className="flex gap-4 items-center bg-[#C8F9DD] text-[#444444] p-3 border border-[#2ECC71] rounded">
          <div className="bg-[#2ECC71] w-fit px-1 py-2 rounded">
            <File className="text-white" size={16} />
          </div>
          <div>
            <h6 className="text-base leading-none font-medium text-[#333333]">
              Test
            </h6>
            <p className="text-[0.625rem] text-[#7D7D7D]">test</p>
          </div>
        </div>

        <div className="border border-[#D9D9D9] rounded-md overflow-hidden">
          <h6 className="bg-[#F5F5F5] border-b-2 border-[#D9D9D9] text-sm font-medium px-4 py-2.5">
            Data Preview (First 5 row)
          </h6>
          <table className="w-full">
            <thead>
              <tr className="border w-full px-3">
                <td className="py-2 text-center text-[#333333] font-medium">
                  Product name
                </td>
                <td className="text-center text-[#333333] font-medium">
                  Category
                </td>
                <td className="text-center text-[#333333] font-medium">
                  Stock
                </td>
                <td className="text-center text-[#333333] font-medium">
                  Unit price
                </td>
              </tr>
            </thead>
            <tbody>
              {fileData.map((file, index) => (
                <tr key={index} className="border px-3">
                  <td className="text-center text-sm text-[#444444] py-2">
                    {file.product}
                  </td>
                  <td className="text-center text-sm text-[#444444]">
                    {file.category}
                  </td>
                  <td className="text-center text-sm text-[#444444]">
                    {file.stock}
                  </td>
                  <td className="text-center text-sm text-[#444444]">
                    ₦ {file.unitPrice.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end items-center gap-4 mt-5">
          <Button
            variant="outline"
            onClick={() => setStep("upload")}
            className="w-40"
          >
            Back
          </Button>
          <Button className="w-40" onClick={() => setStep("configure")}>
            Next: Configure Import
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImportView;
