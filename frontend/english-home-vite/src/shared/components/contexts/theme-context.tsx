import { createContext, useContext, useEffect, useState } from 'react';
import axiosClient from '@lib/axios-client';

type Theme = 'dark' | 'light' | 'system';

interface DynamicTheme {
  name: string;
  assets: {
    backgroundImage?: string;
    logo?: string;
  };
  styles: {
    primaryColor?: string;
    secondaryColor?: string;
  };
}

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  dynamicTheme: DynamicTheme | null;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  dynamicTheme: null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  const [dynamicTheme, setDynamicTheme] = useState<DynamicTheme | null>(null);

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const { data } = await axiosClient.get<DynamicTheme>('/themes/current');
        if (data) {
          setDynamicTheme(data);
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      }
    };

    fetchTheme();
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Apply dynamic styles
  useEffect(() => {
    if (!dynamicTheme?.styles) return;

    const root = window.document.documentElement;
    if (dynamicTheme.styles.primaryColor) {
      root.style.setProperty('--primary', dynamicTheme.styles.primaryColor);
    }
    if (dynamicTheme.styles.secondaryColor) {
      root.style.setProperty('--secondary', dynamicTheme.styles.secondaryColor);
    }
  }, [dynamicTheme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    dynamicTheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
