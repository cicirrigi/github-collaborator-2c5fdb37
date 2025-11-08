/**
 * 🎞️ MOTION TOKENS SYSTEM - Vantage Lane Design System
 * Unified orchestration for all Framer Motion interactions
 * ---------------------------------------------------------
 * Structure:
 * - base: default transitions and global variants
 * - elements: cards, avatars, badges, stars
 * - sections: scroll reveal and headers
 */

import { motionBase } from './motion.base';
import { motionElements } from './motion.elements';
import { motionSections } from './motion.sections';

// 🧱 Merged motion tokens - toate tipurile de animații unified
export const motionTokens = {
  // Base motion system
  ...motionBase,

  // Element-level animations
  ...motionElements,

  // Section-level orchestration
  ...motionSections,
} as const;

// 📦 Individual exports pentru granular imports
export { motionBase } from './motion.base';
export { motionElements } from './motion.elements';
export { motionSections } from './motion.sections';
export { defaultTransition } from './motion.base';

// 🔧 Type exports pentru TypeScript safety
export type MotionVariant = keyof typeof motionTokens;
export type TransitionPreset = keyof typeof motionBase.transitions;
