'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { triggerSOS } from '@/lib/academics/emergency';
import { AlertTriangle, X, Send } from 'lucide-react';

export default function EmergencySOSButton() {
  const { user, profile, role } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  if (role !== 'STUDENT') return null;

  const institutionId = profile?.studentDetails?.institutionId;
  const className = profile?.studentDetails?.className || '';
  const rollNumber = profile?.studentDetails?.rollNumber || '';

  if (!institutionId) return null;

  const handleSend = async () => {
    if (!user?.uid) return;
    setSending(true);
    setError('');
    try {
      await triggerSOS(
        institutionId,
        user.uid,
        profile?.displayName || 'Student',
        className,
        rollNumber,
        message.trim() || undefined
      );
      setSent(true);
    } catch (e) {
      setError('Failed to send alert. Please try calling your institution directly.');
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSent(false);
    setMessage('');
    setError('');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/50 flex items-center justify-center transition active:scale-95"
        title="Emergency SOS"
      >
        <AlertTriangle className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-red-500/30 rounded-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                Emergency Alert
              </h3>
              <button onClick={handleClose} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {sent ? (
              <div className="text-center py-4 space-y-2">
                <p className="text-emerald-400 font-semibold">Alert sent to your institution.</p>
                <p className="text-xs text-slate-400">
                  If this is a life-threatening emergency, also call local emergency services immediately.
                </p>
                <button
                  onClick={handleClose}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition mt-2"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-400">
                  This will immediately notify your institution's admin with your name, class, and roll number.
                </p>
                {error && (
                  <div className="p-2.5 bg-red-500/10 border border-red-500 text-red-400 text-xs rounded-lg">
                    {error}
                  </div>
                )}
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Optional: briefly describe the situation..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-red-500"
                />
                <button
                  onClick={handleSend}
                  disabled={sending}
                  className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-semibold text-sm rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> {sending ? 'Sending...' : 'Send Emergency Alert'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
