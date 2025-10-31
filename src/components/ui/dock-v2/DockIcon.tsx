'use client';
import { motion, useSpring } from 'framer-motion';
import { useEffect, useId, useRef, useState } from 'react';
import { useDockCtx } from './context';
import { dockTokens } from './design-tokens';
import { useDockTheme } from './hooks/useDockTheme';
import { useMagnify } from './hooks/useMagnify';

export function DockIcon({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  const id = useId();
  const ref = useRef<HTMLButtonElement>(null);
  const ctx = useDockCtx();
  const [isHovered, setIsHovered] = useState(false);
  const { tokens } = useDockTheme();

  useEffect(() => {
    const getCenter = () => {
      const r = ref.current?.getBoundingClientRect();
      return {
        x: (r?.left ?? 0) + (r?.width ?? 0) / 2,
        y: (r?.top ?? 0) + (r?.height ?? 0) / 2,
      };
    };
    ctx.register(id, getCenter);
    return () => ctx.unregister(id);
  }, [ctx, id]);

  const { getScale, getLensInfluence } = useMagnify(id);
  const scale = useSpring(1, {
    stiffness: dockTokens.motion.stiffness,
    damping: dockTokens.motion.damping,
  });
  const y = useSpring(0, {
    stiffness: dockTokens.motion.stiffness,
    damping: dockTokens.motion.damping,
  });
  const x = useSpring(0, {
    stiffness: dockTokens.motion.lensStiffness,
    damping: dockTokens.motion.lensDamping,
  }); // Enhanced horizontal spring for realistic lens effect

  useEffect(() => {
    const s = getScale();
    const lensInfluence = getLensInfluence();

    scale.set(s);
    y.set(-((s - 1) * 10)); // Subtil Y movement pentru efectul mai mic

    // Advanced lens spacing - iconurile se distanțează realist
    if (ctx.orientation === 'horizontal') {
      // Calculez total shift - combinație de scale și direcție
      const scaleShift = (s - 1) * (dockTokens.size.baseIcon / 3); // Base expansion
      const lensShift = lensInfluence * dockTokens.size.baseIcon; // Directional push

      x.set(scaleShift + lensShift);
    } else {
      x.set(0);
    }
  });

  const base = dockTokens.size.baseIcon;

  return (
    <motion.button
      ref={ref}
      aria-label={label}
      onClick={onClick}
      type='button'
      role='button'
      className='group relative grid place-items-center rounded-full outline-none'
      style={{
        width: base,
        height: base,
        translateY: y,
        translateX: x, // 👈 Applied lens shift pentru distanțarea laterală
        scale,
        background: `linear-gradient(135deg, ${tokens.glass.iconFrom}, ${tokens.glass.iconTo})`,
        boxShadow: `${tokens.shadow.low}, 0 0 20px ${tokens.gold}15`,
        // Focus ring styling via style for consistency
        outlineWidth: 0,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      <div className='z-10' style={{ color: tokens.gold }}>
        {children}
      </div>
      <div
        className='absolute -top-10 left-1/2 -translate-x-1/2 transition-all duration-200 ease-out pointer-events-none'
        style={{
          transform: isHovered
            ? 'translateX(-50%) translateY(0) scale(1)'
            : 'translateX(-50%) translateY(8px) scale(0.95)',
          opacity: isHovered ? 1 : 0,
        }}
      >
        <div className='relative'>
          <span
            className='rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap block'
            style={{
              backgroundColor: tokens.background.tooltip,
              color: tokens.text.tooltip,
              boxShadow: tokens.shadow.high,
            }}
          >
            {label}
          </span>
          {/* Săgeata care indică către icon */}
          <div
            className='absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 rotate-45'
            style={{
              backgroundColor: tokens.background.tooltip,
              marginTop: '-4px',
            }}
          />
        </div>
      </div>
    </motion.button>
  );
}
