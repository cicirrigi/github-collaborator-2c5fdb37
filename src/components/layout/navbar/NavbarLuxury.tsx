'use client';

import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useRef } from 'react';

import { navigation } from '@/config/site.config';
import { cn } from '@/lib/utils/cn';

import { useNavbarState } from './hooks';
import { Logo } from './Logo';
import { NavbarActions } from './NavbarActions';
import { NavbarDesktop } from './NavbarDesktop';
import { NavbarMobile } from './NavbarMobile';

/**
 * 💎 NavbarLuxury v6 — Vantage Lane Signature Edition
 *
 * Perfect Flow:
 * - Start: full-width, luxury dark glass
 * - Scroll: compact, centered, floating oval
 * - Natural Y movement (navbar slides down)
 * - Integrated with design system
 * - Logo shrink + fade effect
 * - Buttery smooth spring physics
 */

export interface NavbarLuxuryProps {
  className?: string;
  hideThemeToggle?: boolean;
  hideUserMenu?: boolean;
  dockedThreshold?: number;
  customNavItems?: readonly {
    href: string;
    label: string;
    external?: boolean;
  }[];
}

export function NavbarLuxury({
  className,
  hideThemeToggle = false,
  hideUserMenu = false,
  dockedThreshold = 120,
  customNavItems,
}: NavbarLuxuryProps): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const { mobileOpen, setMobileOpen, panelRef } = useNavbarState();
  const prefersReducedMotion = useReducedMotion();
  const navItems = customNavItems || navigation.main;

  // 💎 physics config
  const springConfig = prefersReducedMotion
    ? { duration: 0 }
    : { stiffness: 180, damping: 18, mass: 0.35 };

  // 🧠 transforms - ALL with consistent spring physics
  const scale = useSpring(useTransform(scrollY, [0, dockedThreshold], [1, 0.94]), springConfig);
  const y = useSpring(useTransform(scrollY, [0, dockedThreshold], [0, 14]), springConfig);
  const opacity = useSpring(useTransform(scrollY, [0, dockedThreshold], [1, 0.96]), springConfig);
  const borderRadius = useSpring(
    useTransform(scrollY, [0, dockedThreshold], [0, 24]),
    springConfig
  );
  const top = useSpring(useTransform(scrollY, [0, dockedThreshold], [0, 12]), springConfig);
  const bgOpacity = useTransform(scrollY, [0, dockedThreshold], [0.85, 0.65]);
  const paddingY = useSpring(useTransform(scrollY, [0, dockedThreshold], [12, 8]), springConfig);
  // Width shrinking handled by scale only - Motion width conflicts with CSS centering

  const accentOpacity = useSpring(
    useTransform(scrollY, [0, dockedThreshold], [0.25, 0.08]),
    springConfig
  );
  const glowOpacity = useSpring(
    useTransform(scrollY, [0, dockedThreshold], [0, 0.1]),
    springConfig
  );
  const logoScale = useSpring(useTransform(scrollY, [0, dockedThreshold], [1, 0.88]), springConfig);
  const logoOpacity = useSpring(
    useTransform(scrollY, [0, dockedThreshold], [1, 0.85]),
    springConfig
  );

  // 🎨 dynamic background
  const background = useMotionTemplate`
    color-mix(in srgb, var(--background-elevated) ${bgOpacity}%, transparent)
  `;

  return (
    <motion.header
      ref={ref}
      layout
      style={{
        top,
        scale,
        y,
        opacity,
        borderRadius,
        background,
        borderColor: 'transparent',
        willChange: 'transform, opacity, border-radius, padding',
      }}
      transition={{ duration: 0.8 }}
      className={cn(
        // 🔍 DEBUG: Centrare clasică
        'fixed left-0 right-0 z-50',
        'backdrop-blur-3xl dark:saturate-110 saturate-150 contrast-125',
        'shadow-lg',
        'supports-[backdrop-filter]:bg-[var(--background-elevated)]/70',
        'dark:supports-[backdrop-filter]:bg-[var(--background-dark)]/70',
        className
      )}
    >
      {/* 🧱 Inner fluid container */}
      <motion.div
        layout
        className='flex items-center justify-between w-full px-6 md:px-10 lg:px-12'
        style={{
          paddingTop: paddingY,
          paddingBottom: paddingY,
          width: '100%', // ✅ Fix width - nu Motion
          margin: '0 auto', // ✅ ensures centered proportional layout
        }}
      >
        <motion.div style={{ scale: logoScale, opacity: logoOpacity }}>
          <Logo />
        </motion.div>

        <NavbarDesktop />
        <NavbarActions
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          hideThemeToggle={hideThemeToggle}
          hideUserMenu={hideUserMenu}
        />
      </motion.div>

      <motion.div
        className='absolute bottom-0 left-0 h-[1px] w-full'
        style={{
          background: 'linear-gradient(90deg, transparent, var(--brand-primary), transparent)',
          opacity: accentOpacity,
        }}
      />

      <motion.div
        className='pointer-events-none absolute inset-x-0 bottom-[-2px] h-[2px] rounded-full blur-md'
        style={{
          opacity: glowOpacity,
          background:
            'radial-gradient(ellipse at center, var(--brand-primary) 0%, transparent 70%)',
        }}
      />

      <NavbarMobile
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        items={navItems}
        containerRef={panelRef}
      />
    </motion.header>
  );
}
