/**
 * Theme Configuration
 * Centralized theme variables for consistent UI styling
 */

export const theme = {
  colors: {
    // Background Colors
    bgPrimary: '#0a0a0a',
    bgSecondary: '#0f0f0f',
    bgTertiary: '#1a1a1a',
    bgCard: '#1a1a1a',
    bgOverlay: 'rgba(0, 0, 0, 0.5)',
    
    // Text Colors
    textPrimary: '#ffffff',
    textSecondary: '#ededed',
    textTertiary: '#a0a0a0',
    textMuted: '#6b7280',
    
    // Accent Colors (Gaming Theme - Yellow/Gold)
    accentPrimary: 'red', // yellow-400
    accentSecondary: 'green', // yellow-500
    accentTertiary: 'pink', // yellow-600
    accentHover: 'purple', // yellow-300
    
    // Border Colors
    borderPrimary: 'rgba(255, 255, 255, 0.1)',
    borderSecondary: 'rgba(255, 255, 255, 0.05)',
    borderAccent: 'rgba(251, 191, 36, 0.3)', // yellow-400/30
    borderAccentHover: 'rgba(251, 191, 36, 0.5)', // yellow-400/50
    
    // Status Colors
    success: '#10b981', // emerald-500
    successLight: 'rgba(16, 185, 129, 0.1)',
    error: '#ef4444', // red-500
    errorLight: 'rgba(239, 68, 68, 0.1)',
    warning: '#f59e0b', // yellow-500
    info: '#3b82f6', // blue-500
  },
  
  spacing: {
    headerHeight: '4rem', // 64px
    sidebarWidth: '16rem', // 256px
  },
  
  transitions: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    accent: '0 0 20px rgba(251, 191, 36, 0.1)',
  },
} as const;

/**
 * Tailwind class utilities for common theme patterns
 */
export const themeClasses = {
  // Backgrounds
  bgPrimary: 'bg-[#0a0a0a]',
  bgSecondary: 'bg-[#0f0f0f]',
  bgTertiary: 'bg-[#1a1a1a]',
  bgCard: 'bg-[#1a1a1a]',
  
  // Text
  textPrimary: 'text-white',
  textSecondary: 'text-gray-200',
  textTertiary: 'text-gray-400',
  textMuted: 'text-gray-500',
  
  // Accents
  accentPrimary: 'text-yellow-400',
  accentSecondary: 'text-yellow-500',
  accentGradient: 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600',
  accentGradientText: 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent',
  
  // Borders
  borderPrimary: 'border-white/10',
  borderSecondary: 'border-white/5',
  borderAccent: 'border-yellow-400/30',
  borderAccentHover: 'border-yellow-400/50',
  
  // Hover states
  hoverBg: 'hover:bg-white/5',
  hoverAccent: 'hover:text-yellow-400',
  hoverBorderAccent: 'hover:border-yellow-400/30',
  
  // Transitions
  transitionBase: 'transition-all duration-200',
  transitionFast: 'transition-all duration-150',
  transitionSlow: 'transition-all duration-300',
} as const;

