export interface Item {
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discount: number;
  subtotal: number;
}

export interface Transaction {
  _id: string;
  invoiceNumber: string;
  type: string;
  walkInClient?: {
    name: string;
    phone: string;
  };
  clientId?: {
    _id: string;
    name: string;
    phone: string;
  };
  items: Item[];
  subtotal: number;
  discount: number;
  total: number;
  amountPaid: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
}
