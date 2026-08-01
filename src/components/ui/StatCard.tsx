'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type StatCardTone = 'brand' | 'success' | 'warning' | 'danger' | 'info';

const TONE_STYLES: Record<StatCardTone, { icon: string; iconBg: string; border: string; glow: string }> = {
  brand: {
    icon: 'text-brand-400',
    iconBg: 'bg-brand-500/10 border-brand-500/20',
    border: 'hover:border-brand-500/50',
    glow: 'hover:shadow-glow',
  },
  success: {
    icon: 'text-accent-success',
    iconBg: 'bg-accent-success/10 border-accent-success/20',
    border: 'hover:border-accent-success/50',
    glow: 'hover:shadow-[0_0_0_1px_rgba(16,185,129,0.15),0_8px_24px_-8px_rgba(16,185,129,0.35)]',
  },
  warning: {
    icon: 'text-accent-warning',
    iconBg: 'bg-accent-warning/10 border-accent-warning/20',
    border: 'hover:border-accent-warning/50',
    glow: 'hover:shadow-[0_0_0_1px_rgba(245,158,11,0.15),0_8px_24px_-8px_rgba(245,158,11,0.35)]',
  },
  danger: {
    icon: 'text-accent-danger',
    iconBg: 'bg-accent-danger/10 border-accent-danger/20',
    border: 'hover:border-accent-danger/50',
    glow: 'hover:shadow-[0_0_0_1px_rgba(239,68,68,0.15),0_8px_24px_-8px_rgba(239,68,68,0.35)]',
  },
  info: {
    icon: 'text-accent-info',
    iconBg: 'bg-accent-info/10 border-accent-info/20',
    border: 'hover:border-accent-info/50',
    glow: 'hover:shadow-[0_0_0_1px_rgba(6,182,212,0.15),0_8px_24px_-8px_rgba(6,182,212,0.35)]',
  },
};

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  icon?: LucideIcon;
  tone?: StatCardTone;
  loading?: boolean;
  onClick?: () => void;
  href?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  unit,
  subtext,
  icon: Icon,
  tone = 'brand',
  loading = false,
  onClick,
  className,
}: StatCardProps) {
  const styles = TONE_STYLES[tone];
  const isInteractive = Boolean(onClick);

  const content = (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={cn(
        'group bg-surface-raised/60 border border-surface-border rounded-card p-5 sm:p-6 transition-colors duration-200',
        styles.border,
        styles.glow,
        isInteractive && 'cursor-pointer',
        className
      )}
    >
      <div className="flex justify-between items-start gap-3">
        <div className="space-y-1.5 min-w-0">
          <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider truncate">{label}</p>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {loading ? '—' : value}
            </span>
            {unit && !loading && <span className="text-slate-400 text-sm font-medium">{unit}</span>}
          </div>
        </div>
        {Icon && (
          <div
            className={cn(
              'p-3 rounded-xl border shrink-0 transition-transform duration-300 group-hover:scale-110',
              styles.iconBg
            )}
          >
            <Icon className={cn('w-6 h-6', styles.icon)} />
          </div>
        )}
      </div>
      {subtext && (
        <div className="mt-4 pt-3 border-t border-surface-border/80">
          <p className={cn('text-xs font-medium', styles.icon)}>{loading ? 'Loading...' : subtext}</p>
        </div>
      )}
    </motion.div>
  );

  return content;
}
