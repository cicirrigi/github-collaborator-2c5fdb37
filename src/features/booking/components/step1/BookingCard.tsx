'use client';

import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';
import { CardHeader } from './CardHeader';

interface BookingCardProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  children: ReactNode;
}

export function BookingCard({ title, subtitle, icon, children }: BookingCardProps) {
  return (
    <div className='vl-card-flex'>
      <CardHeader icon={icon} title={title} subtitle={subtitle} />
      <div className='vl-card-inner'>{children}</div>
    </div>
  );
}
