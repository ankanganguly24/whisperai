import { Dimensions } from 'react-native';
import { ANIMATION } from '../constants/slides';
import { theme } from '../constants/theme';

const { width } = Dimensions.get('window');

export const slideStyles = {
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  } as const,
  icon: {
    fontSize: ANIMATION.ICON_SIZE,
    marginBottom: theme.spacing.lg,
  } as const,
  glowBackground: {
    position: 'absolute' as const,
    width: ANIMATION.GLOW_SIZE,
    height: ANIMATION.GLOW_SIZE,
    borderRadius: theme.radius.lg,
    opacity: 0.1,
    zIndex: -1,
  } as const,
  title: {
    ...theme.typography.title,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center' as const,
  } as const,
  description: {
    ...theme.typography.subtitle,
    color: theme.colors.text.secondary,
    textAlign: 'center' as const,
  } as const,
  accentLine: {
    width: 60,
    height: 4,
    borderRadius: 2,
    marginTop: theme.spacing.md,
  } as const,
};