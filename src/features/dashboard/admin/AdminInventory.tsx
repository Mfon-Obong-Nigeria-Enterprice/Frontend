import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import DashboardTitle from "../../../components/dashboard/DashboardTitle";
import InventoryTab from "./components/InventoryTab";
import Modal from "@/components/Modal";
import AddCategory from "@/components/AddCategory";
// import { Button } from "@/components/ui/button";
import { IoIosArrowUp } from "react-icons/io";
import { CiImport } from "react-icons/ci";
import { IoIosSearch } from "react-icons/io";
import { Plus, ChevronRight } from "lucide-react";

const AdminInventory = () => {
  const [position, setPosition] = useState({ x: 1280, y: 400 });
  const [dragging, setDragging] = useState(false);
  const [rel, setRel] = useState({ x: 0, y: 0 });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);

  // to close both modals
  const closeBothModals = () => {
    setIsAddModalOpen(false);
    setAddCategoryModalOpen(false);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    setDragging(true);
    setRel({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseUp = () => setDragging(false);

  // attach/detach mouse events
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragging) {
        setPosition({
          x: e.clientX - rel.x,
          y: e.clientY - rel.y,
        });
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, rel]);

  return (
    <main>
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
        <div className="my-5 ">
          <InventoryTab />
        </div>

        {/* draggable button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          onMouseDown={handleMouseDown}
          className="fixed z-50 flex justify-center items-center bg-[#2ECC71] hover:bg-[#2cCC79] w-16 h-16 rounded-full text-white shadow-2xl cursor-move text-5xl"
          style={{ left: position.x, top: position.y }}
        >
          <Plus />
        </button>

        <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
          <h6 className="text-lg font-medium text-[#333333] ml-5 mb-3">
            What would you like to add?
          </h6>
          <div className="flex flex-col gap-4 px-7 pt-4 pb-6 border-t border-[#d9d9d9]">
            <Link
              to="/add-prod"
              className="flex justify-between items-center border py-3 px-6 rounded-[0.625rem] hover:shadow-2xl transition-all duration-100 ease-in-out"
            >
              <div>
                <p className="text-[#333333] text-sm">Add Product</p>
                <p className="text-[#7D7D7D] text-[0.625rem]">
                  Add a new product to your inventory
                </p>
              </div>
              <ChevronRight size={18} />
            </Link>
            <div
              onClick={() => setAddCategoryModalOpen(true)}
              className="flex justify-between items-center border py-3 px-6 rounded-[0.625rem] hover:shadow-2xl transition-all duration-100 ease-in-out"
            >
              <div>
                <p className="text-[#333333] text-sm">Add Category</p>
                <p className="text-[#7D7D7D] text-[0.625rem]">
                  Create a new product category
                </p>
              </div>
              <ChevronRight size={18} />
            </div>
          </div>
        </Modal>

        {/* add category modal */}
        <Modal
          isOpen={addCategoryModalOpen}
          onClose={() => setAddCategoryModalOpen(false)}
          size="xxl"
        >
          <AddCategory closeBothModals={() => closeBothModals()} />
        </Modal>
      </section>
    </main>
  );
};

export default AdminInventory;
