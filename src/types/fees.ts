export type FeeChargeType = 'TUITION' | 'ADMISSION' | 'BOOKS' | 'FINE' | 'OTHER';

export type InvoiceStatus = 'UNPAID' | 'PARTIALLY_PAID' | 'PAID';

export interface InvoiceLineItem {
  id: string;
  type: FeeChargeType;
  label: string;
  amount: number;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  method: string; // e.g., "Cash", "Bank Transfer", "Card"
  recordedAt: string;
  note?: string;
}

export interface Invoice {
  id: string;
  institutionId: string;
  studentUid: string;
  studentName: string;
  className: string;
  lineItems: InvoiceLineItem[];
  totalAmount: number;
  amountPaid: number;
  status: InvoiceStatus;
  dueDate: string; // 'YYYY-MM-DD'
  createdAt?: unknown;
  payments: PaymentRecord[];
  title: string; // e.g., "January 2026 Fee"
}
