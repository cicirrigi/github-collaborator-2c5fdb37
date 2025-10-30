/**
 * 🎨 UI Surfaces Tokens - Prebuilt style objects
 *
 * Elimină repetițiile de style objects:
 * În loc de: style={{ backgroundColor: 'var(--background-elevated)', borderColor: 'var(--border-subtle)' }}
 * Folosește: style={uiSurfaces.elevated}
 *
 * Consistent, maintainable, type-safe
 */

export const uiSurfaces = {
  // Background surfaces
  elevated: {
    backgroundColor: 'var(--background-elevated)',
    borderColor: 'var(--border-subtle)',
  },

  card: {
    backgroundColor: 'var(--background-elevated)',
    borderColor: 'var(--border-subtle)',
    border: '1px solid var(--border-subtle)',
  },

  overlay: {
    backgroundColor: 'var(--background-dark)',
    backdropFilter: 'blur(12px)',
  },

  // Interactive surfaces
  button: {
    backgroundColor: 'var(--background-elevated)',
    borderColor: 'var(--border-subtle)',
    color: 'var(--text-primary)',
  },

  input: {
    backgroundColor: 'var(--background-elevated)',
    borderColor: 'var(--border-subtle)',
    color: 'var(--text-primary)',
  },

  // Dropdown & Menu surfaces
  dropdown: {
    backgroundColor: 'var(--background-elevated)',
    borderColor: 'var(--border-subtle)',
    border: '1px solid var(--border-subtle)',
    backdropFilter: 'blur(16px)',
  },

  // Status surfaces
  success: {
    backgroundColor: 'var(--status-success)',
    color: 'var(--background-dark)',
  },

  warning: {
    backgroundColor: 'var(--status-warning)',
    color: 'var(--background-dark)',
  },

  error: {
    backgroundColor: 'var(--status-error)',
    color: 'var(--background-light)',
  },
} as const;

export const uiColors = {
  // Text colors
  text: {
    primary: 'var(--text-primary)',
    secondary: 'var(--text-secondary)',
    muted: 'var(--text-muted)',
  },

  // Brand colors
  brand: {
    primary: 'var(--brand-primary)',
    secondary: 'var(--brand-secondary)',
    accent: 'var(--brand-accent)',
  },

  // Interactive states
  hover: {
    text: 'var(--brand-primary)',
    background: 'var(--brand-primary)/10',
  },

  focus: {
    ring: 'var(--brand-primary)/40',
    offset: 'var(--background-dark)',
  },
} as const;

export type UiSurfaces = typeof uiSurfaces;
export type UiColors = typeof uiColors;
