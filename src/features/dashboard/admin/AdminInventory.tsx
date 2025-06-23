import DashboardTitle from "../../../components/dashboard/DashboardTitle";
import InventoryTab from "./components/InventoryTab";

import { IoIosArrowUp } from "react-icons/io";
import { CiImport } from "react-icons/ci";
import { IoIosSearch } from "react-icons/io";

const AdminInventory = () => {
  return (
    <main className="bg-[#f5f5f5] min-h-screen p-10 font-Inter">
      <DashboardTitle
        heading="Inventory Management"
        description="Manage your product, categories, and stock levels"
      />
      <section className="bg-white rounded-xl mt-5 overflow-hidden">
        <div className="flex justify-between items-center py-4 px-5 bg-[#f0f0f3]">
          <h3 className="text-xl font-medium text-text-dark">
            Product & Categories
          </h3>
          <div className="flex gap-4">
            <button className="bg-white flex gap-1 items-center rounded-md py-2 px-4 border border-[#7d7d7d]">
              <IoIosArrowUp />
              <span>Export</span>
            </button>
            <button className="bg-white flex gap-1 items-center rounded-md py-2 px-4 border border-[#7d7d7d]">
              <CiImport />
              <span>Import Stock</span>
            </button>
            <button className="bg-[#2ECC71] text-white flex gap-1 items-center rounded-md py-2 px-4 border border-[#2ECC71]">
              <span>+ Add product</span>
            </button>
          </div>
        </div>
        {/* search */}
        <div className="flex justify-between items-center px-4 py-5 border">
          <div className="bg-[#F5F5F5] flex items-center gap-1 w-1/2 px-4 rounded-md">
            <IoIosSearch size={18} />
            <input
              type="search"
              placeholder="Search products, categories..."
              className="py-2 outline-0 w-full"
            />
          </div>
          {/*  */}
          <div className="flex items-center gap-4">
            <button className="bg-[#D9D9D9] flex gap-1 items-center rounded-md py-2 px-4 border border-[#7d7d7d]">
              <span>Stock status</span>
              <IoIosArrowUp />
            </button>
            <button className="bg-[#D9D9D9] flex gap-1 items-center rounded-md py-2 px-4 border border-[#7d7d7d]">
              <span>Price range</span>
              <IoIosArrowUp />
            </button>
          </div>
        </div>

        {/* tabbed section */}
        <div className="my-5 px-4">
          <InventoryTab />
        </div>
      </section>
    </main>
  );
};

export default AdminInventory;
