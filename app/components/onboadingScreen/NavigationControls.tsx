import { theme } from '@/app/constants/theme';
import React from 'react';
import { Pressable, Text, View } from 'react-native';


interface NavigationControlsProps {
  readonly onPrevious: () => void;
  readonly onNext: () => void;
  readonly onGetStarted: () => void;
  readonly isLastSlide: boolean;
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({
  onPrevious,
  onNext,
  onGetStarted,
  isLastSlide,
}) => {
  return (
    <View style={[styles.container, { gap: theme.spacing.md }]}>
      <Pressable
        onPress={isLastSlide ? onGetStarted : onNext}
        style={styles.primaryButton}
        accessibilityRole="button"
        accessibilityLabel={isLastSlide ? 'Get started' : 'Go to next slide'}
      >
        <Text style={styles.primaryButtonText}>
          {isLastSlide ? 'GET STARTED' : 'NEXT'}
        </Text>
      </Pressable>

      {!isLastSlide && (
        <Pressable
          onPress={onPrevious}
          style={styles.secondaryButton}
          accessibilityRole="button"
          accessibilityLabel="Go to previous slide"
        >
          <Text style={styles.secondaryButtonText}>BACK</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = {
  container: {
    marginBottom: theme.spacing.lg,
  } as const,
  primaryButton: {
    paddingVertical: 16,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.sm,
    backgroundColor: '#000000',
    alignItems: 'center' as const,
  } as const,
  primaryButtonText: {
    color: '#ffffff',
    ...theme.typography.button,
  } as const,
  secondaryButton: {
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center' as const,
  } as const,
  secondaryButtonText: {
    color: '#000000',
    ...theme.typography.button,
  } as const,
};
