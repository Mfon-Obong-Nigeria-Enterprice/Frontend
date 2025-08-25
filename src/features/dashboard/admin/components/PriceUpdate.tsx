import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Product } from '@/types/types';

interface PriceUpdateTableSectionProps {
  products: Product[];
  editingPrices: { [key: string]: number };
  loadingProductId: string | null;
  onPriceChange: (id: string, value: number) => void;
  onUpdate: (productId: string, newPrice: number) => void;
  onReset: (productId: string) => void;
  isReadOnly?: boolean;
}

export const PriceUpdateTableSection: React.FC<PriceUpdateTableSectionProps> = ({
  products,
  editingPrices,
  loadingProductId,
  onPriceChange,
  onUpdate,
  onReset,
  isReadOnly = false,
}) => {
  
  console.log('Products in table:', products);
  console.log('Editing prices:', editingPrices);
  
return (
  <div className="space-y-6 p-6 bg-white rounded-lg shadow-md">
    <h2 className="text-2xl font-semibold text-gray-800">Price Update Management</h2>
    <p className="text-sm text-gray-500 mb-4">Product prices update</p>

    <div className="border border-[#D9D9D9] rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-[#F5F5F5]">
          <TableRow>
            <TableHead className="font-semibold text-gray-700 border-r">Product</TableHead>
            <TableHead className="font-semibold text-gray-700 border-r">Current Price</TableHead>
            <TableHead className="font-semibold text-gray-700 border-r">New Price</TableHead>
            <TableHead className="font-semibold text-gray-700 border-r">Change %</TableHead>
            <TableHead className="font-semibold text-gray-700 border-r">Unit</TableHead>
            <TableHead className="font-semibold text-gray-700 text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            console.log('Rendering product:', product);
            
            const currentPrice = editingPrices[product._id] ?? product.unitPrice;
            const change = ((currentPrice - product.unitPrice) / product.unitPrice) * 100;
            const displayChange = parseFloat(change.toFixed(2));

            const isEditing = editingPrices[product._id] !== undefined;
            const isChanged = isEditing && currentPrice !== product.unitPrice;
            const isValid = isEditing && !isNaN(currentPrice) && currentPrice > 0;

            return (
              <TableRow key={product._id}>
                <TableCell className="font-medium text-gray-800 border-r">
                  {product.name || 'Unnamed Product'}
                </TableCell>
                <TableCell className="text-gray-600 border-r">
                  ₦{(product.unitPrice || 0).toLocaleString()}
                </TableCell>
                <TableCell className="border-r">
                  <Input
                    type="number"
                    value={currentPrice}
                    onChange={(e) => onPriceChange(product._id, parseFloat(e.target.value))}
                    className="w-24 h-8"
                    disabled={loadingProductId === product._id || isReadOnly}
                  />
                </TableCell>
                <TableCell className="border-r bg-white">
  <span className={`inline-block px-2 py-1 border ${
    change >= 0 ? 'border-[#E2F3EB] bg-[#E2F3EB]' : 'border-[#FFF2CE] bg-[#FFF2CE]'
  } rounded text-[#444444] text-sm font-medium`}>
    {change > 0 ? '+' : ''}{displayChange}%
  </span>
</TableCell>
                <TableCell className="text-gray-600 border-r">
                  {product.unit || 'No unit specified'}
                </TableCell>
                <TableCell className="flex space-x-2 justify-center">
                  <Button
                    size="sm"
                    onClick={() => onUpdate(product._id, currentPrice)}
                    disabled={loadingProductId === product._id || !isChanged || !isValid || isReadOnly}
                    className="h-8"
                  >
                    {loadingProductId === product._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Update'
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onReset(product._id)}
                    disabled={loadingProductId === product._id || !isEditing || isReadOnly}
                    className="h-8"
                  >
                    Reset
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  </div>
);
};