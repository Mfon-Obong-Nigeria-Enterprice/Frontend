import * as React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type Product } from '@/types/types';
import { Loader2 } from 'lucide-react';

interface PriceUpdateTableSectionProps {
  products: Product[];
  editingPrices: { [key: string]: number };
  loadingProductId: string | null;
  onPriceChange: (id: string, value: number) => void;
  onUpdate: (product: Product) => void;
  onReset: (product: Product) => void;
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
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">Price Update Management</h2>
      <p className="text-sm text-gray-500 mb-4">Product: Price Update</p>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold text-gray-700">Product</TableHead>
              <TableHead className="font-semibold text-gray-700">Current Price</TableHead>
              <TableHead className="font-semibold text-gray-700">New Price</TableHead>
              <TableHead className="font-semibold text-gray-700">Change%</TableHead>
              <TableHead className="font-semibold text-gray-700">Unit</TableHead>
              <TableHead className="font-semibold text-gray-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const currentPrice = editingPrices[product._id] ?? product.unitPrice;
              const change = ((currentPrice - product.unitPrice) / product.unitPrice) * 100;
              const displayChange = parseFloat(change.toFixed(2));

              const isEditing = editingPrices[product._id] !== undefined;
              const isChanged = isEditing && currentPrice !== product.unitPrice;
              const isValid = isEditing && !isNaN(currentPrice) && currentPrice > 0;

              return (
                <TableRow key={product._id}>
                  <TableCell className="font-medium text-gray-800">{product.name}</TableCell>
                  <TableCell className="text-gray-600">₦{product.unitPrice.toLocaleString()}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={currentPrice}
                      onChange={(e) => onPriceChange(product._id, parseFloat(e.target.value))}
                      className="w-24 h-8"
                      disabled={loadingProductId === product._id || isReadOnly}
                    />
                  </TableCell>
                  <TableCell className={change >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {change > 0 ? '+' : ''}{displayChange}%
                  </TableCell>
                  <TableCell className="text-gray-600">{product.unit}</TableCell>
                  <TableCell className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => onUpdate(product)}
                      disabled={
                        loadingProductId === product._id || 
                        !isChanged ||
                        !isValid ||
                        isReadOnly
                      }
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
                      onClick={() => onReset(product)}
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