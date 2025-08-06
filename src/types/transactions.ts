import type { Client, TransactionType } from "./types";

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

export interface BaseUser {
  name: string;
  phone: string;
}

export interface BaseUserWithId extends BaseUser {
  _id: string;
}

export interface ClientWithBalance extends BaseUserWithId {
  balance: number | string;
}

export interface Transaction {
  _id: string;
  invoiceNumber?: string;
  type: TransactionType;
  client: Client | null;
  walkInClient?: BaseUser;
  clientId?: ClientWithBalance;
  clientName?: string;
  walkInClientName?: string;
  userId: {
    _id: string;
    name: string;
  };
  userName?: string;
  items: Item[];
  subtotal?: number;
  discount?: number;
  total: number;
  amountPaid?: number;
  paymentMethod?: string;
  status: string;
  createdAt: string;
  notes?: string;
  waybillNumber?: string;
  amount?: number;
  description?: string;
  reference?: string;
}

export type MergedTransaction = Transaction & {
  client: Client | null;
};
