'use client';

import { cn } from '@/lib/utils/cn';
import { visionInputTokens as t } from '../tokens/visionInput.tokens';

interface VisionInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon?: React.ReactNode;
}

export function VisionInput({ value, onChange, placeholder, icon }: VisionInputProps) {
  const isFloating = value.length > 0;

  return (
    <div className={t.wrapper}>
      {icon && <div className={t.icon}>{icon}</div>}

      <input className={t.inputBox} value={value} onChange={e => onChange(e.target.value)} />

      <label className={cn(t.label, isFloating ? t.labelFloating : t.labelResting)}>
        {placeholder}
      </label>
    </div>
  );
}
