/**
 * 🎬 MOTION TOKENS SECTIONS - Vantage Lane Design System
 * Section-level orchestration pentru header, scroll reveal
 * Layout-wide animation coordination
 */

import { defaultTransition } from './motion.base';

export const motionSections = {
  // 🌟 Section header animations
  header: {
    title: {
      initial: {
        opacity: 0,
        y: 30,
      },
      animate: {
        opacity: 1,
        y: 0,
        transition: {
          ...defaultTransition,
          stiffness: 300,
        },
      },
    },
    subtitle: {
      initial: {
        opacity: 0,
        y: 20,
      },
      animate: {
        opacity: 1,
        y: 0,
        transition: {
          delay: 0.2,
          ...defaultTransition,
          stiffness: 300,
        },
      },
    },
  },

  // 🎨 Animation timing pentru grid items și section flow
  timing: {
    stagger: 0.1, // Delay între item-uri pentru stagger effect
    duration: 0.6, // Durata animației pentru fiecare item
    ease: [0.4, 0, 0.2, 1] as const, // Cubic bezier pentru smooth motion
    sectionDelay: 0.3, // Delay între secțiuni diferite
  },

  // 🌊 Container orchestration pentru section-wide effects
  container: {
    // Pentru section wrapper cu reveal global
    reveal: {
      initial: {
        opacity: 0,
      },
      animate: {
        opacity: 1,
        transition: {
          duration: 0.8,
          staggerChildren: 0.2,
          delayChildren: 0.1,
        },
      },
    },
    // Pentru grid container cu coordonare item-uri
    grid: {
      initial: {},
      animate: {
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.3,
        },
      },
    },
    // Pentru trust indicators cu timing separat
    trustIndicators: {
      initial: { opacity: 0, y: 30 },
      animate: {
        opacity: 1,
        y: 0,
        transition: {
          delay: 0.6,
          duration: 0.8,
          staggerChildren: 0.1,
        },
      },
    },
  },

  // 🎯 Page transition effects (pentru future extensii)
  pageTransitions: {
    // Slide in from right
    slideInRight: {
      initial: { x: '100%', opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: '-100%', opacity: 0 },
      transition: defaultTransition,
    },
    // Fade transition
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.5 },
    },
  },
} as const;
