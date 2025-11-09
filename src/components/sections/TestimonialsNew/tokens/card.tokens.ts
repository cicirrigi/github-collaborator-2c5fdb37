/**
 * 🎴 TestimonialCardNew - Card Design Tokens
 * Nivel atomic - design system layer pentru card-uri
 * Zero hardcoding, totul orchestrat prin tokens
 */

export const cardTokens = {
  // 🎯 Layout orchestration - CSS Grid pentru înălțimi egale
  layout: {
    display: 'grid',
    gridTemplateRows: 'auto 1fr auto', // Header / Content / Footer
    aspectRatio: '4/5', // Formă constantă pentru toate cardurile
    width: '100%',
    maxWidth: '320px',
    minHeight: '380px',
    gap: 'clamp(1rem, 2vw, 1.5rem)',
    position: 'relative' as const,
    overflow: 'hidden',
  },

  // 📏 Dimensions sistem - responsive scaling
  dimensions: {
    padding: 'clamp(1.25rem, 2.5vw, 2rem)',
    borderRadius: '1rem',
    borderWidth: '1px',
    minWidth: '280px',
    maxWidth: '320px',
  },

  // 📝 Typography tokens - responsive text
  text: {
    quote: {
      fontSize: 'clamp(0.9rem, 1vw + 0.5rem, 1.1rem)',
      lineHeight: '1.6',
      fontStyle: 'italic' as const,
      textAlign: 'center' as const,
      margin: '0',
      color: 'var(--testimonial-text)',
    },
    name: {
      fontSize: '1rem',
      fontWeight: '600' as const,
      color: 'var(--testimonial-text-primary)',
      margin: '0',
    },
    role: {
      fontSize: '0.875rem',
      fontWeight: '400' as const,
      color: 'var(--testimonial-text-secondary)',
      margin: '0',
    },
    company: {
      fontSize: '0.8125rem',
      fontWeight: '500' as const,
      color: 'var(--testimonial-accent)',
      margin: '0',
    },
  },

  // 🎭 Sections orchestration
  sections: {
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      flex: '0 0 auto',
    },
    content: {
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center' as const,
      flex: '1 1 auto',
      minHeight: '8rem', // Spațiu garantat pentru echilibrare
      gap: 'clamp(0.75rem, 1.5vw, 1.25rem)',
      padding: '0 0.5rem',
    },
    footer: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      flex: '0 0 auto',
      marginTop: 'auto',
    },
  },

  // 🌟 Effects pentru glassmorphism cu 3D border and diagonal gradient
  effects: {
    base: {
      background: 'linear-gradient(to bottom right, #171717, #0a0a0a, #171717)',
      // 3D beveled border - stronger contrast like Services cards
      borderWidth: '2px',
      borderStyle: 'solid',
      borderTopColor: 'rgba(255, 255, 255, 0.05)',
      borderLeftColor: 'rgba(255, 255, 255, 0.05)',
      borderBottomColor: '#000000',
      borderRightColor: '#000000',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.05) inset',
      willChange: 'transform, opacity, box-shadow',
    },
    hover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15), 0 1px 0 rgba(255, 255, 255, 0.1) inset',
      borderColor: 'var(--testimonial-border-hover)',
      willChange: 'transform, box-shadow',
    },
    glow: {
      background: 'linear-gradient(to bottom right, #171717, #0a0a0a, #171717)',
    },
  },

  // 📏 Content overflow protection pentru texte foarte lungi
  contentOverflow: {
    maxHeight: '480px',
    overflowY: 'auto' as const,
    scrollbarWidth: 'none' as const,
    msOverflowStyle: 'none' as const,
    // Hide scrollbar dar menține funcționalitatea
    WebkitScrollbar: {
      display: 'none',
    },
  },

  // ⛰️ Elevation presets pentru layering consistent
  elevations: {
    level1: '0 8px 32px rgba(0,0,0,0.1)',
    level2: '0 12px 48px rgba(0,0,0,0.15)',
    level3: '0 16px 64px rgba(0,0,0,0.2)',
    glow: '0 0 20px rgba(203, 178, 106, 0.2)',
    featured: '0 20px 80px rgba(0,0,0,0.25), 0 0 30px rgba(203, 178, 106, 0.3)',
  },

  // ⭐ Rating stars
  stars: {
    container: {
      display: 'flex',
      gap: '0.25rem',
      justifyContent: 'center',
      alignItems: 'center',
    },
    star: {
      width: '1.125rem',
      height: '1.125rem',
      color: 'var(--testimonial-accent)',
      filter: 'drop-shadow(0 1px 2px rgba(203, 178, 106, 0.3))',
    },
  },

  // 👤 Avatar styling
  avatar: {
    container: {
      width: '2.5rem',
      height: '2.5rem',
      borderRadius: '50%',
      overflow: 'hidden',
      border: '2px solid var(--testimonial-border)',
      flexShrink: 0,
      position: 'relative' as const,
    },
    image: {
      objectFit: 'cover' as const,
      width: '100%',
      height: '100%',
    },
  },

  // 🏷️ Badge pentru quote icon
  quoteIcon: {
    fontSize: '2.5rem',
    color: 'var(--testimonial-accent)',
    opacity: 0.3,
    fontFamily: 'serif',
    fontWeight: '600' as const,
    lineHeight: '1',
    userSelect: 'none' as const,
  },

  // 🎨 Variante pentru diferite contexte
  variants: {
    default: {
      padding: 'clamp(1.25rem, 2.5vw, 2rem)',
    },
    compact: {
      padding: 'clamp(1rem, 2vw, 1.5rem)',
      aspectRatio: '1/1',
    },
    featured: {
      padding: 'clamp(1.5rem, 3vw, 2.5rem)',
      aspectRatio: '5/6',
    },
  },
} as const;
