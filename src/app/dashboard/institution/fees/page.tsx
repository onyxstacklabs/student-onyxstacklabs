'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { getStudentsForInstitution, InstitutionStudent } from '@/lib/academics/institutionStudents';
import { createInvoice, getInvoicesForInstitution, recordPayment, calculateLedgerStats, isInvoiceOverdue } from '@/lib/academics/fees';
import { Invoice, InvoiceLineItem, FeeChargeType } from '@/types/fees';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { Receipt, Plus, Trash2, DollarSign, Wallet, AlertTriangle, TrendingUp } from 'lucide-react';

const CHARGE_TYPES: { value: FeeChargeType; label: string }[] = [
  { value: 'TUITION', label: 'Tuition Fee' },
  { value: 'ADMISSION', label: 'Admission Fee' },
  { value: 'BOOKS', label: 'Books/Materials' },
  { value: 'FINE', label: 'Fine' },
  { value: 'OTHER', label: 'Other' },
];

function InstitutionFees() {
  const { user, profile } = useAuth();

  const [students, setStudents] = useState<InstitutionStudent[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Create invoice form
  const [selectedStudentUid, setSelectedStudentUid] = useState('');
  const [invoiceTitle, setInvoiceTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [lineItems, setLineItems] = useState<Omit<InvoiceLineItem, 'id'>[]>([
    { type: 'TUITION', label: 'Monthly Tuition', amount: 0 },
  ]);
  const [saving, setSaving] = useState(false);

  const loadData = () => {
    if (!user?.uid) return;
    setLoading(true);
    Promise.all([getStudentsForInstitution(user.uid), getInvoicesForInstitution(user.uid)])
      .then(([studentsData, invoicesData]) => {
        setStudents(studentsData);
        setInvoices(invoicesData);
      })
      .catch(() => setError('Could not load fee data.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [user?.uid]);

  const stats = calculateLedgerStats(invoices);

  const addLineItem = () => {
    setLineItems((prev) => [...prev, { type: 'OTHER', label: '', amount: 0 }]);
  };

  const removeLineItem = (index: number) => {
    setLineItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateLineItem = (index: number, field: keyof Omit<InvoiceLineItem, 'id'>, value: string | number) => {
    setLineItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const totalAmount = lineItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const student = students.find((s) => s.uid === selectedStudentUid);
    if (!user?.uid || !student || !invoiceTitle.trim() || !dueDate || lineItems.some((i) => !i.label.trim() || i.amount <= 0)) {
      setError('Please fill all fields — every line item needs a label and amount greater than 0.');
      return;
    }

    setSaving(true);
    try {
      await createInvoice(user.uid, student.uid, student.displayName, student.className, invoiceTitle.trim(), lineItems, dueDate);
      setSuccessMsg('Invoice created successfully.');
      setSelectedStudentUid('');
      setInvoiceTitle('');
      setDueDate('');
      setLineItems([{ type: 'TUITION', label: 'Monthly Tuition', amount: 0 }]);
      loadData();
    } catch (err) {
      setError('Failed to create invoice. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleRecordPayment = async (invoiceId: string, remaining: number) => {
    const amountStr = prompt(`Enter amount received (remaining: ${remaining}):`);
    if (!amountStr) return;
    const amount = Number(amountStr);
    if (!amount || amount <= 0) return;

    try {
      await recordPayment(invoiceId, amount, 'Manual Entry');
      loadData();
    } catch (err) {
      setError('Failed to record payment.');
    }
  };

  const inputClass =
    'w-full bg-surface-base border border-surface-border rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-500';
  const labelClass = 'block text-xs font-mono text-slate-400 uppercase mb-1.5';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <PageHeader icon={Receipt} title="Fee Management" description="Create invoices and track your institution's ledger." />

      {error && <div className="p-3 bg-accent-danger/10 border border-accent-danger text-accent-danger text-sm rounded-lg">{error}</div>}
      {successMsg && <div className="p-3 bg-accent-success/10 border border-accent-success text-accent-success text-sm rounded-lg">{successMsg}</div>}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total Invoiced" value={`$${stats.totalInvoiced.toLocaleString()}`} icon={DollarSign} tone="brand" loading={loading} />
        <StatCard label="Collected" value={`$${stats.totalCollected.toLocaleString()}`} icon={Wallet} tone="success" loading={loading} />
        <StatCard label="Outstanding" value={`$${stats.totalOutstanding.toLocaleString()}`} icon={TrendingUp} tone="warning" loading={loading} />
        <StatCard label="Overdue" value={stats.overdueCount} icon={AlertTriangle} tone="danger" loading={loading} />
      </div>

      <form onSubmit={handleCreateInvoice} className="bg-surface-raised/60 border border-surface-border rounded-card p-6 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-brand-400" /> Create Invoice
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Student</label>
            <select value={selectedStudentUid} onChange={(e) => setSelectedStudentUid(e.target.value)} className={inputClass}>
              <option value="">Select student</option>
              {students.map((s) => (
                <option key={s.uid} value={s.uid}>
                  {s.displayName} ({s.rollNumber}) — {s.className}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Invoice Title</label>
            <input
              type="text"
              value={invoiceTitle}
              onChange={(e) => setInvoiceTitle(e.target.value)}
              className={inputClass}
              placeholder="e.g., January 2026 Fee"
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Due Date</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputClass} />
        </div>

        <div className="space-y-2">
          <label className={labelClass}>Charges</label>
          {lineItems.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-center">
              <select
                value={item.type}
                onChange={(e) => updateLineItem(index, 'type', e.target.value)}
                className={`${inputClass} col-span-3`}
              >
                {CHARGE_TYPES.map((ct) => (
                  <option key={ct.value} value={ct.value}>
                    {ct.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={item.label}
                onChange={(e) => updateLineItem(index, 'label', e.target.value)}
                className={`${inputClass} col-span-5`}
                placeholder="Description"
              />
              <input
                type="number"
                min="0"
                value={item.amount || ''}
                onChange={(e) => updateLineItem(index, 'amount', Number(e.target.value))}
                className={`${inputClass} col-span-3`}
                placeholder="Amount"
              />
              <button
                type="button"
                onClick={() => removeLineItem(index)}
                disabled={lineItems.length === 1}
                className="col-span-1 text-slate-500 hover:text-accent-danger p-1 disabled:opacity-30"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button type="button" onClick={addLineItem} className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Add another charge
          </button>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-surface-border">
          <span className="text-sm text-slate-400">Total</span>
          <span className="text-lg font-bold text-white">${totalAmount.toLocaleString()}</span>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm rounded-xl transition disabled:opacity-50"
        >
          {saving ? 'Creating...' : 'Create Invoice'}
        </button>
      </form>

      <div className="bg-surface-raised/60 border border-surface-border rounded-card p-6 space-y-3">
        <h2 className="text-sm font-bold text-white">All Invoices ({invoices.length})</h2>
        {loading ? (
          <p className="text-xs text-slate-500 py-4 text-center">Loading...</p>
        ) : invoices.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">No invoices created yet.</p>
        ) : (
          <div className="space-y-2">
            {invoices.map((inv) => {
              const overdue = isInvoiceOverdue(inv);
              const remaining = inv.totalAmount - inv.amountPaid;
              return (
                <div key={inv.id} className="p-3.5 bg-surface-base border border-surface-border rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {inv.studentName} — {inv.title}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Due {inv.dueDate} · {inv.className}
                      </p>
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
                      {overdue && inv.status !== 'PAID' ? 'OVERDUE' : inv.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      ${inv.amountPaid} / ${inv.totalAmount}
                    </span>
                    {inv.status !== 'PAID' && (
                      <button
                        onClick={() => handleRecordPayment(inv.id, remaining)}
                        className="px-3 py-1 bg-brand-600 hover:bg-brand-500 text-white text-xs font-medium rounded-lg transition"
                      >
                        Record Payment
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function InstitutionFeesPage() {
  return (
    <ProtectedRoute allowedRoles={['INSTITUTION']}>
      <InstitutionFees />
    </ProtectedRoute>
  );
}
