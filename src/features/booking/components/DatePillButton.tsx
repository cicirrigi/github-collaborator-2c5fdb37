'use client';

import { cn } from '@/lib/utils/cn';
import { motion } from 'framer-motion';
import { datePillTokens as t } from '../tokens/datePill.tokens';

interface DatePillButtonProps {
  value: string;
  placeholder: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export function DatePillButton({ value, placeholder, icon, onClick }: DatePillButtonProps) {
  return (
    <div className={t.wrapper}>
      <motion.div onClick={onClick} whileTap={{ scale: 0.97 }} className={cn(t.container)}>
        <div className={t.innerGlass} />

        <div className={t.content}>
          <div className={t.iconWrap}>
            <div className={t.icon}>{icon}</div>
          </div>

          <span className='text-white/90'>{value ? value : placeholder}</span>
        </div>
      </motion.div>
    </div>
  );
}
