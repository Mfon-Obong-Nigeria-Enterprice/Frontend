import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

const AddProduct = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen bg-[#F5F5F5] px-10 py-2 flex justify-center items-center font-Inter">
      <div className="bg-white max-w-[56rem] w-[90%] rounded-[0.625rem] border border-[#D9D9D9] px-10 py-5">
        <h5>Product Information</h5>

        {/* product information */}
        <div className="border-t border-[#D9D9D9] mt-2 py-5 grid grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[#333333] text-sm">Product name</label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Product name" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="dangote">Dangote cement</SelectItem>
                  <SelectItem value="boa">Boa cement</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[#333333] text-sm">Category</label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="cement">Cement</SelectItem>
                  <SelectItem value="nails">Nails</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* inventory information */}
        <h5 className="mt-5">Inventory</h5>
        <div className="border-t border-[#D9D9D9] mt-2 py-5 grid grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[#333333] text-sm">Primary unit</label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Primary unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="sheet">Sheet</SelectItem>
                  <SelectItem value="length">Length</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[#333333] text-sm">Secondary unit</label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Secondary unit (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="bag">Bag</SelectItem>
                  <SelectItem value="sheet">Sheet</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Conversion rate (if applicable)</Label>
            <Input type="text" placeholder="e.g., 50 pounds per bag" />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Initial quantity</Label>
            <Input type="text" placeholder="Per primary units" />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Price per unit</Label>
            <Input type="text" placeholder="# 0.00" />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Low stock alert level</Label>
            <Input type="text" placeholder="Enter quantity" />
          </div>
        </div>
        <div className="flex justify-end gap-7 mt-7">
          <Button
            onClick={() => navigate(-1)}
            className="bg-white hover:bg-[#f5f5f5] text-[#333333] border border-[var(--cl-secondary)] font-Inter font-medium transition-colors duration-200 ease-in-out"
          >
            Cancel
          </Button>
          <Button
            onClick={() => alert("product added successfully")}
            className="bg-[#2ECC71] hover:bg-[var(--cl-bg-green-hover)] transition-colors duration-200 ease-in-out"
          >
            Add Product
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AddProduct;
