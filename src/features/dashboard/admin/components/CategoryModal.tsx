/** @format */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, X, Pencil, Save, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { deleteCategory, updateCategory } from "@/services/categoryService";
import { isAxiosError } from "axios";
import { useInventoryStore } from "@/stores/useInventoryStore";

type ModalProps = {
  setOpenModal: () => void;
  categoryId: string;
  categoryName: string;
  description?: string;
  productCount: number;
};

const CategoryModal = ({
  setOpenModal,
  categoryId,
  categoryName,
  description,
  productCount,
}: ModalProps) => {
  const [editMode, setEditMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editedName, setEditedName] = useState(categoryName);
  const [editedDescription, setEditedDescription] = useState(description || "");

  // 🔄 Zustand actions
  const setCategories = useInventoryStore((s) => s.setCategories);
  const categories = useInventoryStore((s) => s.categories);

  // ✅ Save changes
  const handleSave = async () => {
    try {
      setIsLoading(true);

      const updated = await updateCategory(categoryId, {
        name: editedName,
        description: editedDescription,
      });

      toast.success("Category updated successfully");
      setEditMode(false);

      // 🔄 Update category in Zustand
      setCategories(
        categories.map((cat) =>
          cat._id === categoryId ? { ...cat, ...updated } : cat
        )
      );
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(
          "Failed to update category: " + (error?.message || "Unknown error")
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Delete category
  const handleDelete = async () => {
    try {
      setIsLoading(true);

      await deleteCategory(categoryId);

      toast.success("Category deleted successfully");

      // 🔄 Remove from Zustand store
      setCategories(categories.filter((cat) => cat._id !== categoryId));

      setIsDeleteModalOpen(false);
      setOpenModal();
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(
          "Failed to delete category: " + (error?.message || "Unknown error")
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedName(categoryName);
    setEditedDescription(description || "");
    setEditMode(false);
  };

  return (
    <>
      <div
        onClick={setOpenModal}
        className="fixed top-0 left-0 bg-[rgba(0,0,0,0.2)] flex justify-center items-center w-full h-screen z-50"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white shadow-md min-h-50 rounded-md px-5 py-10 min-w-lg max-w-2xl max-h-[90vh] overflow-auto"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            {editMode ? (
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="text-lg font-bold"
                disabled={isLoading}
              />
            ) : (
              <h3 className="font-bold text-lg">{categoryName}</h3>
            )}

            <div className="flex gap-2">
              {editMode ? (
                <>
                  {/* Save */}
                  <Button
                    variant="ghost"
                    className="w-fit p-2"
                    onClick={handleSave}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                  </Button>

                  {/* Cancel edit */}
                  <Button
                    variant="ghost"
                    className="w-fit p-2"
                    onClick={handleCancelEdit}
                    disabled={isLoading}
                  >
                    <X size={16} />
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  className="w-fit p-2"
                  onClick={() => setEditMode(true)}
                  disabled={isLoading}
                >
                  <Pencil
                    size={16}
                    className="text-orange-500 cursor-pointer hover:text-orange-600"
                  />
                </Button>
              )}

              {/* Delete */}
              <Button
                variant="ghost"
                className="w-fit p-2"
                onClick={() => setIsDeleteModalOpen(true)}
                disabled={isLoading}
              >
                <Trash2
                  size={16}
                  className="text-[#7d7d7d] cursor-pointer hover:text-red-500"
                />
              </Button>

              {/* Close modal */}
              <Button
                variant="ghost"
                className="w-fit p-2"
                onClick={setOpenModal}
                disabled={isLoading}
              >
                <X size={16} />
              </Button>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            {editMode ? (
              <Textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder="Enter category description"
                className="min-h-[100px]"
                disabled={isLoading}
              />
            ) : (
              <p className="text-center leading-relaxed text-[var(--cl-text-semidark)]">
                {description || "No description available"}
              </p>
            )}
          </div>

          {/* Product count */}
          <div className="bg-[var(--cl-bg-light)] max-w-[70%] mt-10 mx-auto p-4 rounded flex flex-col justify-around items-center">
            <p className="text-sm text-[var(--cl-text-dark)] font-semibold">
              {productCount}
            </p>
            <p className="text-[var(--cl-secondary)] text-[0.75rem]">Products</p>
          </div>
        </div>
      </div>

      {/* Delete confirmation */}
      {isDeleteModalOpen && (
        <div className="fixed top-0 left-0 bg-[rgba(0,0,0,0.5)] flex justify-center items-center w-full h-screen z-50">
          <div className="bg-white p-6 rounded-md max-w-md">
            <h3 className="font-bold text-lg mb-4">Confirm Deletion</h3>
            <p className="mb-4">
              Are you sure you want to delete the category "{categoryName}"?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryModal;
