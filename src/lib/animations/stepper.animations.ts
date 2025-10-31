/**
 * 🎭 Stepper Animation Library
 * Reutilizabile animations pentru progress indicators
 */

import { designTokens } from '@/config/theme.config';

// Animation keyframes pentru CSS-in-JS
export const stepperKeyframes = {
  pulse: `
    @keyframes stepperPulse {
      0%, 100% {
        transform: scale(1);
        opacity: 1;
        box-shadow: 0 0 0 0 rgba(203, 178, 106, 0.4);
      }
      50% {
        transform: scale(1.05);
        opacity: 0.9;
        box-shadow: 0 0 0 8px rgba(203, 178, 106, 0.1);
      }
    }
  `,

  slideIn: `
    @keyframes stepperSlideIn {
      from {
        transform: translateX(-20px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `,

  progress: `
    @keyframes stepperProgress {
      from {
        width: 0%;
      }
      to {
        width: 100%;
      }
    }
  `,

  fillProgress: `
    @keyframes fillProgress {
      from {
        transform: scaleX(0);
      }
      to {
        transform: scaleX(1);
      }
    }
  `,

  ripple: `
    @keyframes stepperRipple {
      0% {
        transform: scale(0);
        opacity: 1;
      }
      100% {
        transform: scale(2);
        opacity: 0;
      }
    }
  `,
} as const;

// Animation variants cu design tokens
export const stepperAnimations = {
  pulse: {
    animation: `stepperPulse 2.5s ${designTokens.animations.easing.css.ease} infinite`,
  },

  slideIn: {
    animation: `stepperSlideIn ${designTokens.animations.duration.slow} ${designTokens.animations.easing.css.ease}`,
  },

  progress: {
    animation: `stepperProgress 1s ${designTokens.animations.easing.css.ease}`,
  },

  ripple: {
    animation: `stepperRipple 0.8s ${designTokens.animations.easing.css.ease}`,
  },

  // Transition presets
  smooth: {
    transition: `all ${designTokens.animations.duration.slow} ${designTokens.animations.easing.css.ease}`,
  },

  gentle: {
    transition: `all 0.6s ${designTokens.animations.easing.css.ease}`,
  },
} as const;

// Helper pentru injectarea keyframes în CSS
export const injectStepperStyles = () => {
  if (typeof document === 'undefined') return;

  const styleId = 'stepper-animations';
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = Object.values(stepperKeyframes).join('\n');
  document.head.appendChild(style);
};
