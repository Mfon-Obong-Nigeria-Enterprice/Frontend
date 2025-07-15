import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UpdateStock from './UpdateStock';

interface Product {
  id: string;
  name: string;
  category: string;
  currentQuantity: number;
  unit: string;
  minLevel: number;
  unitPrice: string;
  shieldStatus: 'high' | 'low';
}

export default function UpdateStockPage() {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Dangote Cement",
      category: "Cement",
      currentQuantity: 200,
      unit: "bags",
      minLevel: 50,
      unitPrice: "4,500",
      shieldStatus: "high"
    },
    {
      id: "2",
      name: "16mm Steel Rod",
      category: "Steel Rod",
      currentQuantity: 150,
      unit: "pcs",
      minLevel: 20,
      unitPrice: "8,600",
      shieldStatus: "high"
    },
    {
      id: "3",
      name: "3-inch Nails",
      category: "Nails",
      currentQuantity: 5,
      unit: "bags",
      minLevel: 10,
      unitPrice: "2,800",
      shieldStatus: "low"
    },
    {
      id: "4",
      name: "Banger Paints White",
      category: "Paints",
      currentQuantity: 25,
      unit: "gallons",
      minLevel: 8,
      unitPrice: "12,500",
      shieldStatus: "high"
    },
    {
      id: "5",
      name: "Dangote Cement",
      category: "Construction",
      currentQuantity: 200,
      unit: "bags",
      minLevel: 50,
      unitPrice: "12,500",
      shieldStatus: "high"
    },
   
  ]);

  const handleSaveSuccess = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    setIsDialogOpen(false);
    navigate('/inventory');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UpdateStock
        products={products}  // Changed from initialProducts to products
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveSuccess}  // Changed from onSaveSuccess to onSave
      />
    </div>
  );
}