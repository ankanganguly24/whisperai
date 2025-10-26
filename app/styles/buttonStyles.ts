import { theme } from '../constants/theme';

export const buttonStyles = {
  secondary: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    alignItems: 'center' as const,
  } as const,
  secondaryText: {
    color: theme.colors.text.primary,
    ...theme.typography.button,
  } as const,
  primary: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary,
    alignItems: 'center' as const,
  } as const,
  primaryText: {
    color: '#fff',
    ...theme.typography.button,
  } as const,
};