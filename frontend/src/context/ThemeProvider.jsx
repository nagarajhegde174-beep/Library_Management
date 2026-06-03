import { useState, useEffect } from 'react';
import { ThemeContext, THEMES } from './ThemeContext';

const STORAGE_KEY = 'avbLibrary-theme';
const DEFAULT_THEME = 'default';   

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
    } catch {
      return DEFAULT_THEME;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // errors
    }
  }, [theme]);

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
