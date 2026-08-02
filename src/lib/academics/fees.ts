import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  getCountFromServer,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Invoice, InvoiceLineItem, PaymentRecord, InvoiceStatus } from '@/types/fees';

const INVOICES_COLLECTION = 'invoices';

function generateLineItemId(): string {
  return `li_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function generatePaymentId(): string {
  return `pay_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export async function createInvoice(
  institutionId: string,
  studentUid: string,
  studentName: string,
  className: string,
  title: string,
  lineItems: Omit<InvoiceLineItem, 'id'>[],
  dueDate: string
): Promise<Invoice> {
  const invoicesRef = collection(db, INVOICES_COLLECTION);
  const newDocRef = doc(invoicesRef);

  const itemsWithIds: InvoiceLineItem[] = lineItems.map((item) => ({
    ...item,
    id: generateLineItemId(),
  }));
  const totalAmount = itemsWithIds.reduce((sum, item) => sum + item.amount, 0);

  const invoice: Invoice = {
    id: newDocRef.id,
    institutionId,
    studentUid,
    studentName,
    className,
    lineItems: itemsWithIds,
    totalAmount,
    amountPaid: 0,
    status: 'UNPAID',
    dueDate,
    payments: [],
    title,
  };

  await setDoc(newDocRef, { ...invoice, createdAt: serverTimestamp() });
  return invoice;
}

export async function recordPayment(
  invoiceId: string,
  amount: number,
  method: string,
  note?: string
): Promise<void> {
  const invoiceRef = doc(db, INVOICES_COLLECTION, invoiceId);
  const snap = await getDoc(invoiceRef);
  if (!snap.exists()) throw new Error('Invoice not found');

  const invoice = snap.data() as Invoice;
  const newPayment: PaymentRecord = {
    id: generatePaymentId(),
    amount,
    method,
    recordedAt: new Date().toISOString(),
    note: note || undefined,
  };

  const newAmountPaid = invoice.amountPaid + amount;
  let newStatus: InvoiceStatus = 'PARTIALLY_PAID';
  if (newAmountPaid >= invoice.totalAmount) newStatus = 'PAID';
  else if (newAmountPaid <= 0) newStatus = 'UNPAID';

  await updateDoc(invoiceRef, {
    payments: [...invoice.payments, newPayment],
    amountPaid: newAmountPaid,
    status: newStatus,
  });
}

export async function getInvoicesForStudent(studentUid: string): Promise<Invoice[]> {
  const invoicesRef = collection(db, INVOICES_COLLECTION);
  const q = query(invoicesRef, where('studentUid', '==', studentUid), orderBy('dueDate', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data() as Invoice);
}

export async function getInvoicesForInstitution(institutionId: string): Promise<Invoice[]> {
  const invoicesRef = collection(db, INVOICES_COLLECTION);
  const q = query(invoicesRef, where('institutionId', '==', institutionId), orderBy('dueDate', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data() as Invoice);
}

export interface LedgerStats {
  totalInvoiced: number;
  totalCollected: number;
  totalOutstanding: number;
  overdueCount: number;
}

export function calculateLedgerStats(invoices: Invoice[]): LedgerStats {
  const today = new Date().toISOString().split('T')[0];
  let totalInvoiced = 0;
  let totalCollected = 0;
  let overdueCount = 0;

  invoices.forEach((inv) => {
    totalInvoiced += inv.totalAmount;
    totalCollected += inv.amountPaid;
    if (inv.status !== 'PAID' && inv.dueDate < today) overdueCount += 1;
  });

  return {
    totalInvoiced,
    totalCollected,
    totalOutstanding: totalInvoiced - totalCollected,
    overdueCount,
  };
}

export function isInvoiceOverdue(invoice: Invoice): boolean {
  const today = new Date().toISOString().split('T')[0];
  return invoice.status !== 'PAID' && invoice.dueDate < today;
}
