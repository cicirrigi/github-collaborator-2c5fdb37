'use client';
import { useEffect, useState } from 'react';
import { dockTokens } from '../design-tokens';

export function useDockTheme() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Detect initial theme
    const html = document.documentElement;
    setIsDarkMode(html.classList.contains('dark'));

    // Watch for theme changes
    const observer = new MutationObserver(() => {
      setIsDarkMode(html.classList.contains('dark'));
    });

    observer.observe(html, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  // Return theme-aware tokens
  const theme = isDarkMode ? 'dark' : 'light';

  return {
    isDarkMode,
    theme,
    tokens: {
      glass: {
        from: dockTokens.theme.glass[theme].from,
        to: dockTokens.theme.glass[theme].to,
        iconFrom: dockTokens.theme.glass[theme].iconFrom,
        iconTo: dockTokens.theme.glass[theme].iconTo,
      },
      border: dockTokens.theme.border[theme],
      text: dockTokens.theme.text[theme],
      background: dockTokens.theme.background[theme],
      shadow: dockTokens.theme.shadow[theme],
      ring: isDarkMode ? dockTokens.theme.ring.dark : dockTokens.theme.ring.light,
      // Static tokens that don't change
      primary: dockTokens.theme.primary,
      gold: dockTokens.theme.gold,
    },
  };
}
