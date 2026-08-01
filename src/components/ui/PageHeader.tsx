import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  icon?: LucideIcon;
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ icon: Icon, eyebrow, title, description, actions, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-border pb-5',
        className
      )}
    >
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="p-2 bg-brand-500/10 rounded-xl text-brand-400 border border-brand-500/20">
              <Icon className="w-6 h-6" />
            </div>
          )}
          <div>
            {eyebrow && (
              <p className="text-[11px] font-mono uppercase tracking-wider text-brand-400 mb-0.5">{eyebrow}</p>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{title}</h1>
          </div>
        </div>
        {description && <p className="text-sm text-slate-400 md:pl-[3.25rem]">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 self-start md:self-auto">{actions}</div>}
    </div>
  );
}
