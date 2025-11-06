/**
 * 🎨 TestimonialsHorizontal Design Tokens - Complete Orchestration
 *
 * Zero hardcoded values - pure design system approach
 * Horizontal layout with smooth scroll
 */

export const testimonialsHorizontalTokens = {
  // Container layout
  container: {
    position: 'relative' as const,
    width: '100%',
    overflow: 'visible' as const, // ✅ Permite vizibilitatea tuturor cardurilor
  },

  // Track wrapper - optimized pentru Chrome smoothness
  trackWrapper: {
    display: 'flex' as const,
    gap: '2rem',
    padding: '0 4rem', // Space for arrows
    willChange: 'transform' as const,
    width: 'fit-content' as const,
    backfaceVisibility: 'hidden' as const, // ✅ Chrome smoothness
    transform: 'translateZ(0)', // ✅ Force GPU acceleration
  },

  // Individual card wrapper
  cardWrapper: {
    minWidth: '24rem', // Fixed width to prevent shrinking
    maxWidth: '24rem',
    flexShrink: 0,
    scrollSnapAlign: 'start' as const,
  },

  // Navigation arrows - frumoase și elegante
  arrows: {
    container: {
      position: 'absolute' as const,
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 30,
      width: '3rem',
      height: '3rem',
      borderRadius: '50%',
      background: 'rgba(26, 29, 33, 0.9)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(203, 178, 106, 0.3)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    left: {
      left: '1rem',
    },
    right: {
      right: '1rem',
    },
    hover: {
      background: 'rgba(203, 178, 106, 0.2)',
      borderColor: 'rgba(203, 178, 106, 0.6)',
      transform: 'translateY(-50%) scale(1.1)',
      boxShadow: '0 8px 24px rgba(203, 178, 106, 0.3)',
    },
    icon: {
      width: '1.5rem',
      height: '1.5rem',
      color: '#CBB26A',
      transition: 'all 0.3s ease',
    },
  },

  // Responsive breakpoints
  responsive: {
    mobile: {
      cardWrapper: {
        minWidth: '18rem',
        maxWidth: '18rem',
      },
      scrollWrapper: {
        gap: '1rem',
        padding: '0 1rem',
      },
    },
    tablet: {
      cardWrapper: {
        minWidth: '20rem',
        maxWidth: '20rem',
      },
      scrollWrapper: {
        gap: '1.5rem',
        padding: '0 1.5rem',
      },
    },
    desktop: {
      cardWrapper: {
        minWidth: '24rem',
        maxWidth: '24rem',
      },
      scrollWrapper: {
        gap: '2rem',
        padding: '0 2rem',
      },
    },
  },

  // Animations
  animations: {
    // Entrance animation
    containerEntrance: {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6, ease: 'easeOut' },
    },

    // Card stagger animation
    cardStagger: {
      initial: { opacity: 0, x: 30 },
      animate: { opacity: 1, x: 0 },
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },

    // Track movement - ultra fine spring
    trackTransition: {
      type: 'spring' as const,
      stiffness: 100, // ✅ Foarte soft
      damping: 25, // ✅ Perfect damped
      mass: 0.5, // ✅ Lightweight pentru rapiditate
      bounce: 0, // ✅ Zero bounce pentru smoothness
    },
  },

  // Custom scrollbar tokens
  scrollbar: {
    width: '8px',
    height: '8px',
    track: {
      background: 'rgba(203, 178, 106, 0.1)',
      borderRadius: '4px',
    },
    thumb: {
      background: 'rgba(203, 178, 106, 0.4)',
      borderRadius: '4px',
      '&:hover': {
        background: 'rgba(203, 178, 106, 0.6)',
      },
    },
  },
} as const;
