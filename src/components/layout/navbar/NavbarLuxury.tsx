'use client';

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';

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
  dockedThreshold = 120, // 👈 Faster response
  customNavItems,
}: NavbarLuxuryProps): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const { mobileOpen, setMobileOpen, panelRef } = useNavbarState();
  const prefersReducedMotion = useReducedMotion();

  const [isDocked, setIsDocked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navItems = customNavItems || navigation.main;

  // 🔍 Detect when to dock
  useEffect(() => {
    const unsub = scrollY.on('change', v => setIsDocked(v > dockedThreshold));
    return () => unsub();
  }, [scrollY, dockedThreshold]);

  // 🧠 Motion transforms — totul controlat de Framer Motion
  const width = useTransform(scrollY, [0, dockedThreshold], ['100%', '90%']);
  const borderRadius = useTransform(scrollY, [0, dockedThreshold], [0, 24]);
  const top = useTransform(scrollY, [0, dockedThreshold], [0, 12]);
  const rawScale = useTransform(scrollY, [0, dockedThreshold], [1, 0.94]);
  const rawY = useTransform(scrollY, [0, dockedThreshold], [0, 14]);
  const rawOpacity = useTransform(scrollY, [0, dockedThreshold], [1, 0.96]);
  const bgOpacity = useTransform(scrollY, [0, dockedThreshold], [0.85, 0.65]);
  const logoScale = useTransform(scrollY, [0, dockedThreshold], [1, 0.88]);
  const logoOpacity = useTransform(scrollY, [0, dockedThreshold], [1, 0.85]);

  // 💎 Luxury spring physics
  const springConfig = prefersReducedMotion
    ? { duration: 0 }
    : { stiffness: 180, damping: 18, mass: 0.35 };

  // 🎨 Premium smooth easing
  const premiumEase = [0.25, 0.46, 0.45, 0.94] as const;

  const scale = useSpring(rawScale, springConfig);
  const y = useSpring(rawY, springConfig);
  const opacity = useSpring(rawOpacity, springConfig);
  const accentOpacity = useSpring(
    useTransform(scrollY, [0, dockedThreshold], [0.25, 0.08]),
    springConfig
  );

  return (
    <motion.header
      ref={ref}
      style={{
        // 🎯 Perfect centering with Motion
        left: '50%',
        translateX: '-50%',
        // 🧠 All transforms controlled by Motion
        width,
        top,
        scale,
        y,
        opacity,
        borderRadius,
        // 🎨 Background with design tokens
        background: `color-mix(in srgb, var(--background-elevated) ${Math.round(
          bgOpacity.get() * 100
        )}%, transparent)`,
        borderColor: 'transparent',
        // ⚡ Performance optimization
        willChange: 'transform, opacity, width, border-radius',
      }}
      transition={{ ease: premiumEase, duration: 0.8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        'fixed z-50',
        'backdrop-blur-3xl dark:saturate-110 saturate-150 contrast-125',
        'shadow-lg',
        // Clean static classes only
        'supports-[backdrop-filter]:bg-[var(--background-elevated)]/70',
        'dark:supports-[backdrop-filter]:bg-[var(--background-dark)]/70',
        className
      )}
    >
      <div
        className={cn(
          'flex items-center justify-between w-full mx-auto',
          'px-6 md:px-10 lg:px-12',
          'transition-all duration-500',
          isDocked ? 'py-3 max-w-6xl' : 'py-1 max-w-7xl'
        )}
      >
        {/* ✨ Logo with separate animations */}
        <motion.div
          style={{ scale: logoScale, opacity: logoOpacity }}
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <Logo size={isDocked ? 'sm' : 'md'} />
        </motion.div>

        <NavbarDesktop />

        <NavbarActions
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          hideThemeToggle={hideThemeToggle}
          hideUserMenu={hideUserMenu}
        />
      </div>

      {/* ✨ Subtle golden accent line */}
      <motion.div
        className='absolute bottom-0 left-0 h-[1px] w-full'
        style={{
          background: 'linear-gradient(90deg, transparent, var(--brand-primary), transparent)',
          opacity: accentOpacity,
        }}
      />

      {/* 🌟 Gentle glow when docked */}
      {isDocked && (
        <motion.div
          className='pointer-events-none absolute inset-x-0 bottom-[-2px] h-[2px] rounded-full blur-md'
          animate={{ opacity: isHovered ? 0.15 : 0.08 }}
          transition={{ duration: 0.5 }}
          style={{
            background: `radial-gradient(ellipse at center, var(--brand-primary) 0%, transparent 70%)`,
          }}
        />
      )}

      {/* 📱 Mobile Menu */}
      <NavbarMobile
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        items={navItems}
        containerRef={panelRef}
      />
    </motion.header>
  );
}
