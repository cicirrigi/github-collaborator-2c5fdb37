'use client';

import { LucideIcon } from 'lucide-react';

export function CardHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className='flex items-center gap-3 mb-4'>
      <div className='w-8 h-8 rounded-xl bg-white/5 border border-amber-200/20 flex items-center justify-center'>
        <Icon className='w-4 h-4 text-amber-200/80' />
      </div>

      <div>
        <div className='text-amber-50 text-sm font-medium tracking-wide'>{title}</div>
        {subtitle && <div className='text-amber-200/50 text-xs font-light'>{subtitle}</div>}
      </div>
    </div>
  );
}
