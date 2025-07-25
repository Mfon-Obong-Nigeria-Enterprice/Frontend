export interface Item {
  productName: string;
  productId: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discount: number;
  subtotal: number;
  createdAt: string;
}

export interface Transaction {
  _id: string;
  invoiceNumber: string;
  type: string;
  clientBalance?: string;
  walkInClient?: {
    name: string;
    phone: string;
  };
  clientId?: {
    _id: string;
    name: string;
    phone: string;
  };
  userId?: string;
  items: Item[];
  subtotal: number;
  discount: number;
  total: number;
  amountPaid: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  notes?: string;
  waybillNumber?: string;
}
