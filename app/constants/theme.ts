export const theme = {
  colors: {
    background: '#ffffff',
    text: {
      primary: '#000000',
      secondary: '#666666',
    },
    border: '#e5e5e5',
    accent: '#000000',
  },
  spacing: {
    xs: 8,
    sm: 12,
    md: 20,
    lg: 24,
    xl: 32,
  },
  typography: {
    title: {
      fontSize: 28,
      fontWeight: '700' as const,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
    },
    button: {
      fontSize: 14,
      fontWeight: '600' as const,
      letterSpacing: 0.5,
    },
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 120,
  },
} as const;
