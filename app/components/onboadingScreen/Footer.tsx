import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SharedValue } from 'react-native-reanimated';

import { theme } from '@/app/constants/theme';
import { ProgressIndicators } from './ProgressIndicators';

interface FooterProps {
  readonly progress: SharedValue<number>;
  readonly totalSlides: number;
  readonly onPrevious: () => void;
  readonly onNext: () => void;
  readonly onGetStarted: () => void;
  readonly isLastSlide: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  progress,
  totalSlides,
  onPrevious,
  onNext,
  onGetStarted,
  isLastSlide,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Left Side - Back Button */}
        <Pressable
          onPress={onPrevious}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go to previous slide"
        >
          <ProgressIndicators progress={progress} totalSlides={totalSlides} />
        </Pressable>

        {/* Center - Indicators */}

        {/* Right Side - Next/Get Started Button */}
        <Pressable
          onPress={isLastSlide ? onGetStarted : onNext}
          style={styles.nextButton}
          accessibilityRole="button"
          accessibilityLabel={isLastSlide ? 'Get started' : 'Go to next slide'}
        >
          <Text style={styles.nextButtonText}>
            {isLastSlide ? 'GET STARTED' : 'NEXT'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = {
  container: {
    flex: 0.3,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    justifyContent: 'flex-end',
    backgroundColor: '#fff',
  } as const,
  content: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  } as const,
  backButton: {
    flex: 0,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center' as const,
  } as const,
  backButtonText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
  } as const,
  nextButton: {
    flex: 0,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: theme.radius.sm,
    backgroundColor: '#000000',
    alignItems: 'center' as const,
  } as const,
  nextButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
  } as const,
};