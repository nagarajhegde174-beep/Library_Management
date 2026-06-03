import { createContext, useContext } from 'react';

export const THEMES = [
  {
    id: 'default',
    name: 'Default',
    label: 'Deep Navy',
    description: 'AVB Library signature dark theme',
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

const DEFAULT_THEME = 'default';

export const ThemeContext = createContext({
  theme: DEFAULT_THEME,
  setTheme: () => {},
  themes: THEMES,
});

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
