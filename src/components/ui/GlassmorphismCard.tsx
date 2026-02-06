import { ReactNode } from 'react';

interface GlassmorphismCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassmorphismCard({ children, className = '' }: GlassmorphismCardProps) {
  return (
    <div
      className={`relative rounded-2xl p-6 overflow-hidden ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 193, 7, 0.15)',
        boxShadow: `
          inset 0 1px 0 rgba(255, 255, 255, 0.05),
          0 8px 32px rgba(0, 0, 0, 0.3),
          0 1px 0 rgba(255, 193, 7, 0.1)
        `,
      }}
    >
      {children}
    </div>
  );
}
