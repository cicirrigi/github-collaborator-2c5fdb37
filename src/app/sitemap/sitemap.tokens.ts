/**
 * 🗺️ Sitemap Design Tokens
 * Orchestrated design system for sitemap page
 */

export const sitemapTokens = {
  // Page layout - theme compatible
  page: {
    background: 'var(--background-dark)', // Uses theme-aware background
    minHeight: '100vh',
  },

  // Header section - theme compatible
  header: {
    background: 'rgba(0, 0, 0, 0.2)', // Keep semi-transparent for backdrop
    backdropFilter: 'blur(16px)',
    borderColor: 'var(--border-subtle)',
    padding: '1rem 0',
  },

  // Logo
  logo: {
    color: 'var(--text-primary)',
    hoverColor: 'var(--brand-primary)',
    fontSize: '1.25rem',
    fontWeight: '300',
  },

  // Back button
  backButton: {
    color: 'var(--text-secondary)',
    hoverColor: 'var(--brand-primary)',
    padding: '0.5rem 1rem',
  },

  // Page title - bicolor like other site titles
  title: {
    fontSize: {
      mobile: '2.25rem',
      desktop: '3rem',
    },
    color: {
      primary: 'var(--brand-primary)', // VANTAGE in gold
      secondary: 'var(--text-primary)', // LANE in white/dark
    },
    fontWeight: '300',
    marginBottom: '1.5rem',
    letterSpacing: '0.05em',
  },

  // Subtitle
  subtitle: {
    fontSize: '1.25rem',
    color: 'var(--text-secondary)',
    maxWidth: '48rem',
    lineHeight: '1.6',
  },

  // Separator line
  separator: {
    width: '6rem',
    height: '1px',
    background: 'linear-gradient(to right, transparent, var(--brand-primary), transparent)',
    marginY: '2rem',
  },

  // Text effects - no hardcoded values
  effects: {
    goldShadow: '0 0 25px rgba(203, 178, 106, 0.7), 0 0 35px rgba(203, 178, 106, 0.4)',
    whiteShadow: '0 0 18px rgba(220, 220, 255, 0.5), 0 0 30px rgba(180, 180, 255, 0.3)',
    goldBrightness: 'brightness(1.2)',
    whiteBrightness: 'brightness(1.18)',
  },

  // Section card - theme compatible
  sectionCard: {
    background: 'var(--background-elevated)',
    backdropFilter: 'blur(16px)',
    borderColor: 'var(--border-subtle)',
    borderRadius: '1rem',
    padding: '1.5rem',
    hoverTransform: 'translateY(-2px)',
    hoverShadow: '0 8px 32px var(--brand-primary-alpha-10, rgba(203, 178, 106, 0.1)),',
    transition: 'all 0.3s ease',
  },

  // Section title with icon
  sectionTitle: {
    color: 'var(--brand-primary)',
    fontSize: '1.25rem',
    fontWeight: '500',
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },

  // Section icon
  sectionIcon: {
    color: 'var(--brand-primary)',
    size: '1.25rem',
  },

  // Link item - theme aware
  linkItem: {
    padding: '0.75rem',
    borderRadius: '0.5rem',
    hoverBackground: 'var(--background-subtle)',
    transition: 'all 0.2s ease',
  },

  // Link title
  linkTitle: {
    color: 'var(--text-primary)',
    hoverColor: 'var(--brand-primary)',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'color 0.2s ease',
  },

  // Link description
  linkDescription: {
    color: 'var(--text-muted)',
    fontSize: '0.75rem',
    lineHeight: '1.5',
    marginTop: '0.25rem',
  },

  // External icon
  externalIcon: {
    size: '0.875rem',
    color: 'var(--brand-primary)',
    opacity: '0',
    hoverOpacity: '1',
    transition: 'opacity 0.2s ease',
  },

  // Help section - theme compatible
  helpSection: {
    background:
      'linear-gradient(to right, var(--brand-primary-subtle), var(--brand-accent-subtle)),',
    borderColor: 'var(--brand-primary-20)',
    borderRadius: '1rem',
    padding: '2rem',
    marginTop: '4rem',
  },

  // Help title
  helpTitle: {
    color: 'var(--text-primary)',
    fontSize: '1.5rem',
    fontWeight: '300',
    marginBottom: '1rem',
  },

  // Help description
  helpDescription: {
    color: 'var(--text-secondary)',
    maxWidth: '32rem',
    lineHeight: '1.6',
    marginBottom: '1.5rem',
  },

  // CTA buttons
  ctaButton: {
    primary: {
      background: 'linear-gradient(to right, var(--brand-primary), var(--brand-accent))',
      color: 'var(--text-contrast)',
      padding: '0.75rem 2rem',
      borderRadius: '0.5rem',
      fontWeight: '500',
      hoverTransform: 'scale(1.05)',
      transition: 'all 0.3s ease',
    },
    secondary: {
      borderColor: 'var(--brand-primary)',
      color: 'var(--brand-primary)',
      padding: '0.75rem 2rem',
      borderRadius: '0.5rem',
      fontWeight: '500',
      hoverBackground: 'var(--brand-primary)',
      hoverColor: '#000000',
      transition: 'all 0.3s ease',
    },
  },

  // Last updated
  lastUpdated: {
    color: 'var(--text-muted)',
    fontSize: '0.875rem',
    textAlign: 'center',
    marginTop: '3rem',
  },
} as const;

export type SitemapTokens = typeof sitemapTokens;
