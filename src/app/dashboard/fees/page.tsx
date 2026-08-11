'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { getInvoicesForStudent, isInvoiceOverdue } from '@/lib/academics/fees';
import { Invoice } from '@/types/fees';
import { PageHeader } from '@/components/ui/PageHeader';
import { Receipt, Printer, MessageCircle, AlertTriangle } from 'lucide-react';

function MyFees() {
  const { user, profile, role } = useAuth();

  const isParent = role === 'PARENT';
  const targetUid = isParent ? profile?.parentDetails?.linkedStudentUid : user?.uid;
  const displayName = isParent ? profile?.parentDetails?.linkedStudentName : 'Your';
  const parentContactNumber = profile?.studentDetails?.parentContactNumber;

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [printingInvoice, setPrintingInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    if (!targetUid) {
      setLoading(false);
      return;
    }
    let mounted = true;
    getInvoicesForStudent(targetUid)
      .then((data) => {
        if (mounted) setInvoices(data);
      })
      .catch(() => {
        if (mounted) setError('Could not load fee records.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [targetUid]);

  const totalOutstanding = invoices.reduce((sum, inv) => sum + (inv.totalAmount - inv.amountPaid), 0);

  const handlePrint = (invoice: Invoice) => {
    setPrintingInvoice(invoice);
    setTimeout(() => {
      window.print();
      setPrintingInvoice(null);
    }, 100);
  };

  const handleWhatsAppShare = (invoice: Invoice) => {
    const remaining = invoice.totalAmount - invoice.amountPaid;
    const message = `Fee Reminder: ${invoice.title} for ${invoice.studentName}\nTotal: $${invoice.totalAmount}\nPaid: $${invoice.amountPaid}\nRemaining: $${remaining}\nDue: ${invoice.dueDate}`;
    const number = parentContactNumber?.replace(/[^\d]/g, '') || '';
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div className="print:hidden">
        <PageHeader
          icon={Receipt}
          title={isParent ? `${displayName}'s Fees` : 'My Fees'}
          description="Fee invoices, payment status, and receipts."
        />
      </div>

      {error && (
        <div className="p-3 bg-accent-danger/10 border border-accent-danger text-accent-danger text-sm rounded-lg print:hidden">{error}</div>
      )}

      {loading ? (
        <div className="bg-surface-raised/40 border border-surface-border/80 rounded-card p-12 text-center print:hidden">
          <p className="text-slate-500 text-sm">Loading fee records...</p>
        </div>
      ) : invoices.length === 0 ? (
        <div className="bg-surface-raised/40 border border-surface-border/80 rounded-card p-12 text-center space-y-2 print:hidden">
          <Receipt className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-slate-300 font-semibold text-base">No fee records yet.</h3>
          <p className="text-slate-500 text-xs">The institution hasn't issued any invoices yet.</p>
        </div>
      ) : (
        <div className="space-y-4 print:hidden">
          {totalOutstanding > 0 && (
            <div className="p-4 bg-accent-warning/10 border border-accent-warning/20 rounded-card flex items-center justify-between">
              <span className="text-sm font-semibold text-accent-warning">Total Outstanding</span>
              <span className="text-xl font-bold text-accent-warning">${totalOutstanding.toLocaleString()}</span>
            </div>
          )}

          {invoices.map((inv) => {
            const overdue = isInvoiceOverdue(inv);
            const remaining = inv.totalAmount - inv.amountPaid;
            return (
              <div key={inv.id} className="bg-surface-raised border border-surface-border rounded-card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{inv.title}</h3>
                    <p className="text-[11px] text-slate-500">Due {inv.dueDate}</p>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-1 rounded-full uppercase ${
                      inv.status === 'PAID'
                        ? 'bg-accent-success/10 text-accent-success'
                        : overdue
                        ? 'bg-accent-danger/10 text-accent-danger'
                        : 'bg-accent-warning/10 text-accent-warning'
                    }`}
                  >
                    {overdue && inv.status !== 'PAID' ? (
                      <span className="flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> OVERDUE
                      </span>
                    ) : (
                      inv.status.replace('_', ' ')
                    )}
                  </span>
                </div>

                <div className="space-y-1">
                  {inv.lineItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs text-slate-400">
                      <span>{item.label}</span>
                      <span>${item.amount}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-surface-border text-sm">
                  <span className="text-slate-300">
                    Paid ${inv.amountPaid} / ${inv.totalAmount}
                  </span>
                  <span className={remaining > 0 ? 'text-accent-warning font-semibold' : 'text-accent-success font-semibold'}>
                    {remaining > 0 ? `$${remaining} remaining` : 'Fully Paid'}
                  </span>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handlePrint(inv)}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg transition flex items-center justify-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print / Save PDF
                  </button>
                  {parentContactNumber && (
                    <button
                      onClick={() => handleWhatsAppShare(inv)}
                      className="flex-1 py-2 bg-accent-success/10 hover:bg-accent-success/20 text-accent-success border border-accent-success/20 text-xs font-medium rounded-lg transition flex items-center justify-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> Share via WhatsApp
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Print-only receipt */}
      {printingInvoice && (
        <div className="hidden print:block text-black p-8">
          <h1 className="text-xl font-bold mb-1">Fee Receipt</h1>
          <p className="text-sm text-gray-600 mb-4">Generated on {new Date().toLocaleDateString()}</p>
          <div className="border border-gray-300 rounded-lg p-4 space-y-2">
            <p>
              <strong>Student:</strong> {printingInvoice.studentName}
            </p>
            <p>
              <strong>Class:</strong> {printingInvoice.className}
            </p>
            <p>
              <strong>Invoice:</strong> {printingInvoice.title}
            </p>
            <p>
              <strong>Due Date:</strong> {printingInvoice.dueDate}
            </p>
            <table className="w-full mt-4 text-sm">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-1">Description</th>
                  <th className="text-right py-1">Amount</th>
                </tr>
              </thead>
              <tbody>
                {printingInvoice.lineItems.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="py-1">{item.label}</td>
                    <td className="text-right py-1">${item.amount}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-bold border-t-2 border-gray-400">
                  <td className="py-2">Total</td>
                  <td className="text-right py-2">${printingInvoice.totalAmount}</td>
                </tr>
                <tr>
                  <td className="py-1">Paid</td>
                  <td className="text-right py-1">${printingInvoice.amountPaid}</td>
                </tr>
                <tr className="font-bold">
                  <td className="py-1">Remaining</td>
                  <td className="text-right py-1">${printingInvoice.totalAmount - printingInvoice.amountPaid}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FeesPage() {
  return (
    <ProtectedRoute allowedRoles={['STUDENT', 'PARENT']}>
      <MyFees />
    </ProtectedRoute>
  );
}
