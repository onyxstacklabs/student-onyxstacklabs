import React from 'react';
import { cn } from '@/lib/utils';

type BadgeTone = 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const TONE_CLASSES: Record<BadgeTone, string> = {
  brand: 'bg-brand-500/10 text-brand-400 border-brand-500/20',
  success: 'bg-accent-success/10 text-accent-success border-accent-success/20',
  warning: 'bg-accent-warning/10 text-accent-warning border-accent-warning/20',
  danger: 'bg-accent-danger/10 text-accent-danger border-accent-danger/20',
  info: 'bg-accent-info/10 text-accent-info border-accent-info/20',
  neutral: 'bg-slate-800 text-slate-300 border-slate-700',
};

interface BadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
  icon?: React.ReactNode;
  className?: string;
}

export function Badge({ children, tone = 'neutral', icon, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill border text-[11px] font-mono font-semibold uppercase tracking-wide',
        TONE_CLASSES[tone],
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
}
