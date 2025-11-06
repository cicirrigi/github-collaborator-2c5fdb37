/**
 * 🎨 TestimonialCard Design Tokens - Complete Orchestration
 *
 * Zero hardcoded values - pure design system approach
 * All styling centralized for consistency and scalability
 */

export const testimonialCardTokens = {
  // Container styles (background handled by CSS module for theme responsiveness)
  container: {
    // background removed - handled by CSS module for light/dark responsiveness
    borderDefault: '1px solid rgba(203, 178, 106, 0.2)', // Golden border
    borderHover: '1px solid rgba(203, 178, 106, 0.4)', // Brighter golden on hover
    borderRadius: '1rem',
    padding: '2rem',
    backdropFilter: 'blur(12px)', // More blur for floating effect
    position: 'relative' as const,
    overflow: 'hidden' as const,
    minHeight: '22rem', // Optimized minimum height for text consistency
    display: 'flex' as const,
    flexDirection: 'column' as const,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(203, 178, 106, 0.1)', // Floating shadow + inner glow
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Spacing system
  spacing: {
    container: '2rem',
    containerCompact: '1.5rem',
    containerLarge: '2.5rem',
    elements: '1.5rem',
    elementsSmall: '1rem',
    avatar: '1rem',
  },

  // Typography tokens
  text: {
    quote: {
      color: 'var(--color-neutral-300)',
      fontSize: '1rem',
      lineHeight: '1.625',
      fontStyle: 'italic' as const,
      marginBottom: '1.5rem',
      flex: '1', // Takes available space for uniform height
    },
    name: {
      color: 'var(--color-white)',
      fontSize: '0.875rem',
      fontWeight: '500' as const,
      marginBottom: '0.25rem',
    },
    role: {
      color: 'var(--color-neutral-400)',
      fontSize: '0.75rem',
      lineHeight: '1.4',
    },
    quoteIcon: {
      color: 'var(--color-brand-primary)',
      fontSize: '3rem', // Slightly larger for prominence
      fontFamily: 'serif',
      opacity: 0.6, // More visible - was 0.2
      position: 'absolute' as const,
      top: '1.5rem',
      right: '1.5rem',
      fontWeight: '600' as const, // Bolder for emphasis
      textShadow: '0 2px 8px rgba(203, 178, 106, 0.3)', // Golden glow
      transition: 'all 0.3s ease',
    },
  },

  // Service badge tokens (pill shape, responsive light/dark)
  badge: {
    background: 'var(--color-brand-primary)', // Golden background
    color: 'var(--color-black)', // Black text on golden background
    border: 'none',
    borderRadius: '9999px', // Perfect pill shape
    padding: '0.5rem 1rem', // More horizontal padding for pill
    fontSize: '0.75rem',
    fontWeight: '600' as const, // Bolder for better contrast
    marginBottom: '1.5rem',
    display: 'inline-block' as const,
    letterSpacing: '0.025em', // Slight letter spacing for elegance
    textTransform: 'uppercase' as const, // Uppercase for premium look
    boxShadow: '0 2px 8px rgba(203, 178, 106, 0.3)', // Subtle golden glow
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    // Dark mode responsive (via CSS custom properties)
    '--badge-bg-dark': 'rgba(203, 178, 106, 0.9)',
    '--badge-color-dark': 'var(--color-black)',
  },

  // Rating stars tokens
  stars: {
    container: {
      display: 'flex' as const,
      gap: '0.25rem',
      marginBottom: '1rem',
    },
    star: {
      width: '1.25rem',
      height: '1.25rem',
      color: '#CBB26A', // Golden stars matching site color
      filter: 'drop-shadow(0 1px 2px rgba(203, 178, 106, 0.3))', // Subtle glow
      transition: 'all 0.2s ease',
    },
  },

  // Avatar tokens
  avatar: {
    container: {
      position: 'relative' as const,
      width: '3rem',
      height: '3rem',
      borderRadius: '50%',
      overflow: 'hidden' as const,
      border: '2px solid var(--color-brand-primary-alpha-20)',
      flexShrink: 0,
    },
    image: {
      objectFit: 'cover' as const,
    },
  },

  // Separator line between text and client info (fade effect like fleet section)
  separator: {
    container: {
      position: 'relative' as const,
      width: '100%',
      height: '1px',
      margin: '1.5rem 0',
      overflow: 'hidden' as const,
    },
    line: {
      position: 'absolute' as const,
      inset: '0',
      background: 'linear-gradient(to right, transparent, rgba(203, 178, 106, 0.4), transparent)',
    },
    glow: {
      position: 'absolute' as const,
      left: '50%',
      top: '0',
      transform: 'translateX(-50%)',
      width: '12rem',
      height: '1px',
      background: 'linear-gradient(to right, transparent, rgba(229, 212, 133, 0.6), transparent)',
      filter: 'blur(0.5px)',
    },
  },

  // Client info section
  clientInfo: {
    container: {
      display: 'flex' as const,
      alignItems: 'center' as const,
      gap: '1rem',
      paddingTop: '0', // Remove padding since we have separator
      marginTop: 'auto', // Pushes to bottom for uniform layout
    },
  },

  // Hover glow effect
  hoverGlow: {
    background:
      'linear-gradient(135deg, rgba(203, 178, 106, 0.1), rgba(229, 212, 133, 0.05), transparent)',
    opacity: 0,
    opacityHover: 1,
    position: 'absolute' as const,
    inset: '0',
    borderRadius: '1rem',
    pointerEvents: 'none' as const,
    boxShadow: '0 12px 48px rgba(203, 178, 106, 0.15)', // Enhanced glow on hover
  },

  // Animation tokens
  animations: {
    // Card entrance animation
    cardEntrance: {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
    },
    // Hover scale animation
    hoverScale: {
      scale: 1.02,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    // Glow transition
    glowTransition: {
      transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    // Border transition
    borderTransition: {
      transition: 'border-color 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },

  // Variants for different use cases
  variants: {
    default: {
      padding: '2rem',
      minHeight: '22rem', // Optimized for text consistency
    },
    compact: {
      padding: '1.5rem',
      minHeight: '18rem',
    },
    large: {
      padding: '2.5rem',
      minHeight: '26rem',
    },
    carousel: {
      padding: '2rem',
      minHeight: '22rem',
      maxWidth: '24rem',
    },
  },
} as const;

// Export individual token categories for easier imports
export const containerTokens = testimonialCardTokens.container;
export const textTokens = testimonialCardTokens.text;
export const badgeTokens = testimonialCardTokens.badge;
export const starsTokens = testimonialCardTokens.stars;
export const avatarTokens = testimonialCardTokens.avatar;
export const animationTokens = testimonialCardTokens.animations;
