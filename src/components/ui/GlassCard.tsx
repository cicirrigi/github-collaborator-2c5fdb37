'use client';

import { cn } from '@/lib/utils/cn';
import type { ReactNode, HTMLAttributes } from 'react';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  strong?: boolean;
}

const GlassCard = ({
  children,
  hover = true,
  strong = false,
  className,
  ...props
}: GlassCardProps) => {
  return (
    <div
      className={cn(
        'rounded-xl',
        strong ? 'glass-strong' : 'glass',
        hover && 'glass-hover',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
