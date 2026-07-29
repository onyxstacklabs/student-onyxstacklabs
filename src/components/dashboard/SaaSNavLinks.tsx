'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CreditCard, Building2, ShieldAlert, Sparkles, Users } from 'lucide-react';

interface SaaSNavLinkItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  roleRequired?: string;
}

const SAAS_NAV_ITEMS: SaaSNavLinkItem[] = [
  {
    label: 'Subscription & Plans',
    href: '/dashboard/subscription',
    icon: CreditCard,
  },
  {
    label: 'Institution Portal',
    href: '/dashboard/institution',
    icon: Building2,
    badge: 'Enterprise',
  },
  {
    label: 'Super-Admin Console',
    href: '/dashboard/admin',
    icon: ShieldAlert,
    badge: 'Admin',
  },
];

export function SaaSNavLinks() {
  const pathname = usePathname();

  return (
    <div className="space-y-1">
      <div className="px-3 py-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
        SaaS & Governance
      </div>
      <nav className="space-y-1">
        {SAAS_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`px-1.5 py-0.5 text-[9px] font-bold uppercase rounded ${
                    item.badge === 'Admin'
                      ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                      : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
