'use client';

import { cn } from '@/lib/utils/cn';
import { useState } from 'react';
import { pillInputTokens as t } from '../tokens/pillInput.tokens';

interface PillInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon?: React.ReactNode;
}

export function PillInput({ value, onChange, placeholder, icon }: PillInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={t.wrapper}>
      <div className={cn(t.container, focused && t.containerFocused)}>
        {/* INNER GLASS LAYER */}
        <div className={t.innerGlass} />

        {/* ICON IN ITS OWN GLASS PILL */}
        {icon && (
          <div className={t.iconWrap}>
            <div className={t.icon}>{icon}</div>
          </div>
        )}

        {/* INPUT */}
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className={t.inputBox}
        />
      </div>
    </div>
  );
}
