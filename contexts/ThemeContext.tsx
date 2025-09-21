import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Design Tokens
export const designTokens = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    accent: {
      purple: '#8b5cf6',
      pink: '#ec4899',
      cyan: '#06b6d4',
      emerald: '#10b981',
      amber: '#f59e0b',
      rose: '#f43f5e',
    },
    semantic: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
    glass: {
      light: 'rgba(255, 255, 255, 0.25)',
      dark: 'rgba(0, 0, 0, 0.25)',
      border: 'rgba(255, 255, 255, 0.18)',
    }
  },
  spacing: {
    xs: '0.5rem',    // 8px
    sm: '0.75rem',   // 12px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
    '4xl': '6rem',   // 96px
  },
  typography: {
    fontSize: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    }
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    glow: '0 0 20px rgb(59 130 246 / 0.5)',
  },
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      linear: 'linear',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    }
  }
};

// Theme Types
export type ThemeMode = 'light' | 'dark' | 'auto';
export type ColorScheme = 'blue' | 'purple' | 'emerald' | 'rose';
export type ReducedMotion = boolean;

interface ThemeState {
  mode: ThemeMode;
  colorScheme: ColorScheme;
  reducedMotion: ReducedMotion;
  sidebarCollapsed: boolean;
  compactMode: boolean;
}

type ThemeAction =
  | { type: 'SET_MODE'; payload: ThemeMode }
  | { type: 'SET_COLOR_SCHEME'; payload: ColorScheme }
  | { type: 'TOGGLE_REDUCED_MOTION' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'TOGGLE_COMPACT_MODE' }
  | { type: 'LOAD_STATE'; payload: Partial<ThemeState> };

const initialState: ThemeState = {
  mode: 'auto',
  colorScheme: 'blue',
  reducedMotion: false,
  sidebarCollapsed: false,
  compactMode: false,
};

function themeReducer(state: ThemeState, action: ThemeAction): ThemeState {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.payload };
    case 'SET_COLOR_SCHEME':
      return { ...state, colorScheme: action.payload };
    case 'TOGGLE_REDUCED_MOTION':
      return { ...state, reducedMotion: !state.reducedMotion };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case 'TOGGLE_COMPACT_MODE':
      return { ...state, compactMode: !state.compactMode };
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

interface ThemeContextValue {
  state: ThemeState;
  tokens: typeof designTokens;
  setMode: (mode: ThemeMode) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  toggleReducedMotion: () => void;
  toggleSidebar: () => void;
  toggleCompactMode: () => void;
  isDark: boolean;
  currentColors: any;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme_preferences');
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        dispatch({ type: 'LOAD_STATE', payload: parsedTheme });
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    }

    // Detect system preferences
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (reducedMotionQuery.matches) {
      dispatch({ type: 'TOGGLE_REDUCED_MOTION' });
    }

    // Listen for system theme changes
    const handleChange = (e: MediaQueryListEvent) => {
      if (state.mode === 'auto') {
        // Force re-render when system theme changes
        dispatch({ type: 'SET_MODE', payload: 'auto' });
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [state.mode]);

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem('theme_preferences', JSON.stringify(state));
  }, [state]);

  // Determine if dark mode is active
  const isDark = state.mode === 'dark' || 
    (state.mode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  // Get current color scheme
  const currentColors = {
    primary: designTokens.colors.primary,
    accent: designTokens.colors.accent[state.colorScheme] || designTokens.colors.accent.purple,
    semantic: designTokens.colors.semantic,
    glass: designTokens.colors.glass,
  };

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Set CSS custom properties
    Object.entries(designTokens.colors.primary).forEach(([key, value]) => {
      root.style.setProperty(`--color-primary-${key}`, value);
    });

    Object.entries(designTokens.colors.secondary).forEach(([key, value]) => {
      root.style.setProperty(`--color-secondary-${key}`, value);
    });

    root.style.setProperty('--color-accent', currentColors.accent);
    
    // Set theme class
    root.className = isDark ? 'dark' : 'light';
    
    // Set reduced motion
    if (state.reducedMotion) {
      root.style.setProperty('--animation-duration', '0.01ms');
    } else {
      root.style.removeProperty('--animation-duration');
    }
  }, [isDark, state.colorScheme, state.reducedMotion, currentColors.accent]);

  const contextValue: ThemeContextValue = {
    state,
    tokens: designTokens,
    setMode: (mode) => dispatch({ type: 'SET_MODE', payload: mode }),
    setColorScheme: (scheme) => dispatch({ type: 'SET_COLOR_SCHEME', payload: scheme }),
    toggleReducedMotion: () => dispatch({ type: 'TOGGLE_REDUCED_MOTION' }),
    toggleSidebar: () => dispatch({ type: 'TOGGLE_SIDEBAR' }),
    toggleCompactMode: () => dispatch({ type: 'TOGGLE_COMPACT_MODE' }),
    isDark,
    currentColors,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};