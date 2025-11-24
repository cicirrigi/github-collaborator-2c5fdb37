import React from 'react';

// 📊 Reusable Stat Card Component
export interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  subtext: string;
}

export function StatCard({ icon: Icon, label, value, subtext }: StatCardProps) {
  return (
    <div
      className='p-3 rounded-lg'
      style={{
        backgroundColor: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className='flex items-center gap-3'>
        <div
          className='w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0'
          style={{
            backgroundColor: 'rgba(60,60,60,0.8)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
        >
          <Icon className='w-5 h-5 text-amber-400' />
        </div>
        <div className='flex-1 min-w-0'>
          <div className='text-white font-medium text-lg'>{value}</div>
          <div className='text-white/60 text-xs'>{label}</div>
          <div className='text-white/40 text-xs'>{subtext}</div>
        </div>
      </div>
    </div>
  );
}
