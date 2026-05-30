import { createContext, useContext, useState, useEffect } from 'react';

/* ══════════════════════════════════════════════════════════
   LibNova Theme Context
   - Reads from localStorage on mount
   - Applies data-theme attribute to <html> instantly
   - Provides useTheme() hook to all components
   ══════════════════════════════════════════════════════════ */

export const THEMES = [
  {
    id: 'default',
    name: 'Default',
    label: 'Deep Navy',
    description: 'LibNova signature dark theme',
    colors: ['#9D4EDD', '#00E5FF', '#090914'],
  },
  {
    id: 'deep-indigo',
    name: 'Deep Indigo',
    label: 'Indigo',
    description: 'Premium dark indigo dashboard',
    colors: ['#6366F1', '#818CF8', '#0D0D1A'],
  },
  {
    id: 'light',
    name: 'Light',
    label: 'Light',
    description: 'Professional SaaS light interface',
    colors: ['#6366F1', '#0EA5E9', '#F8FAFC'],
  },
  {
    id: 'ocean',
    name: 'Ocean',
    label: 'Ocean',
    description: 'Deep ocean professional theme',
    colors: ['#0EA5E9', '#22D3EE', '#040D18'],
  },
  {
    id: 'emerald',
    name: 'Emerald',
    label: 'Emerald',
    description: 'Green enterprise dashboard',
    colors: ['#10B981', '#34D399', '#030F0A'],
  },
];

const STORAGE_KEY = 'libNova-theme';
const DEFAULT_THEME = 'default';

const ThemeContext = createContext({
  theme: DEFAULT_THEME,
  setTheme: () => {},
  themes: THEMES,
});

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
    } catch {
      return DEFAULT_THEME;
    }
  });

  // Apply theme to <html> immediately on mount and change
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore storage errors
    }
  }, [theme]);

  // Apply stored theme before first render (SSR-safe)
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
    document.documentElement.setAttribute('data-theme', stored);
  }, []);

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
