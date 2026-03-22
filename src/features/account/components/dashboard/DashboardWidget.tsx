/**
 * 🎨 DashboardWidget - Reusable Base Component
 *
 * Glassmorphism container for all dashboard widgets
 * Responsive padding, consistent styling
 */

import type { ReactNode } from 'react';

interface DashboardWidgetProps {
  readonly children: ReactNode;
  readonly className?: string;
}

export function DashboardWidget({ children, className = '' }: DashboardWidgetProps) {
  return (
    <div
      className={`
        bg-white/10
        backdrop-blur-lg
        border border-white/20
        rounded-xl
        p-4 md:p-6
        shadow-2xl
        transition-all duration-300
        ${className}
      `}
    >
      {children}
    </div>
  );
}
