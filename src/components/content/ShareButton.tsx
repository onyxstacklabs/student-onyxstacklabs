'use client';

import React from 'react';
import { Share2 } from 'lucide-react';

interface ShareButtonProps {
  title: string;
}

export function ShareButton({ title }: ShareButtonProps) {
  const handleShare = () => {
    if (typeof window !== 'undefined') {
      if (navigator.share) {
        navigator.share({
          title,
          url: window.location.href,
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert('Article link copied to clipboard!');
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors"
    >
      <Share2 className="w-3.5 h-3.5" />
      <span>Share Article</span>
    </button>
  );
}
