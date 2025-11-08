/**
 * 🏗️ TestimonialsNew - Grid Layout Tokens
 * Responsive grid orchestration pentru testimoniale
 * Auto-fit grid care se adaptează la orice screen size
 */

export const gridTokens = {
  // 📐 Container principal - responsive grid automat
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 'clamp(1.5rem, 3vw, 2.5rem)',
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 clamp(1rem, 3vw, 2rem)',
    justifyItems: 'center',
    alignItems: 'stretch', // Consistență la înălțimi
    justifyContent: 'center', // Centrare pentru grid items
  },

  // 📱 Responsive breakpoints pentru grid behavior
  responsive: {
    mobile: {
      gridTemplateColumns: '1fr',
      gap: '1.25rem',
      padding: '0 1rem',
    },
    tablet: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: '1.75rem',
      padding: '0 1.5rem',
    },
    desktop: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: 'clamp(1.5rem, 3vw, 2.5rem)',
      padding: '0 2rem',
    },
    wide: {
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '2.5rem',
      maxWidth: '1400px',
    },
  },

  // 📏 Spacing pentru secțiuni
  sections: {
    wrapper: {
      padding: 'clamp(3rem, 6vw, 5rem) 0',
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: 'clamp(2rem, 4vw, 3.5rem)',
      maxWidth: '600px',
      margin: '0 auto clamp(2rem, 4vw, 3.5rem) auto',
    },
    grid: {
      marginBottom: 'clamp(2rem, 4vw, 3rem)',
    },
  },

  // 🎭 Layout variants pentru diferite contexte
  variants: {
    // Grid standard pentru homepage
    default: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: 'clamp(1.5rem, 3vw, 2.5rem)',
      maxItems: 6,
    },
    // Grid compact pentru sidebar sau mici secțiuni
    compact: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: 'clamp(1rem, 2vw, 1.75rem)',
      maxItems: 4,
    },
    // Grid carousel pentru scroll orizontal
    carousel: {
      display: 'flex',
      flexDirection: 'row' as const,
      overflowX: 'auto',
      scrollBehavior: 'smooth' as const,
      gap: 'clamp(1.25rem, 2.5vw, 2rem)',
      padding: '0 clamp(1rem, 3vw, 2rem)',
      scrollSnapType: 'x mandatory',
      scrollSnapStop: 'always' as const,
      // Premium scrollbar styling
      scrollbarWidth: 'none' as const,
      msOverflowStyle: 'none' as const,
      WebkitScrollbar: {
        display: 'none',
      },
    },
    // Grid featured pentru highlight special
    featured: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: 'clamp(2rem, 4vw, 3rem)',
      maxItems: 3,
    },
  },

  // 🎨 Animation timing pentru grid items
  timing: {
    stagger: 0.1, // Delay între item-uri pentru stagger effect
    duration: 0.6, // Durata animației pentru fiecare item
    ease: [0.4, 0, 0.2, 1] as const, // Cubic bezier pentru smooth motion
  },

  // 📱 Media queries CSS pentru responsive behavior
  mediaQueries: {
    mobile: '(max-width: 640px)',
    tablet: '(min-width: 641px) and (max-width: 1024px)',
    desktop: '(min-width: 1025px)',
    wide: '(min-width: 1400px)',
  },
} as const;
