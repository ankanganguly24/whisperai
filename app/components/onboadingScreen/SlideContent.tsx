import { ANIMATION, OnboardingSlide } from '@/app/constants/slides';
import React from 'react';
import { Dimensions, Image, Text, View } from 'react-native';
import Animated, { interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface SlideContentProps {
  readonly slide: OnboardingSlide;
  readonly index: number;
  readonly progress: SharedValue<number>;
  readonly isActive: boolean;
}

export const SlideContent: React.FC<SlideContentProps> = ({ slide, index, progress }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [index - 1, index, index + 1], [0.8, 1, 0.8]);
    const opacity = interpolate(progress.value, [index - 0.5, index, index + 0.5], [0, 1, 0]);
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.slide, animatedStyle]}>
      <View style={styles.iconContainer}>
        <Image source={slide.icon} style={styles.icon} resizeMode="contain" />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.description}>{slide.description}</Text>
      </View>
    </Animated.View>
  );
};

const styles = {
  slide: {
    width,
    height: height * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  } as const,
  iconContainer: {
    width: ANIMATION.ICON_SIZE,
    height: ANIMATION.ICON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  } as const,
  icon: {
    width: '100%',
    height: '100%',
  } as const,
  contentContainer: {
    width: '100%',
    alignItems: 'flex-start' as const,
    marginBottom: 20,
  } as const,
  title: {
    fontSize: 36,
    fontWeight: '800' as const,
    textAlign: 'left' as const,
    marginBottom: 12,
    color: '#000000',
    letterSpacing: -0.8,
  } as const,
  description: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: '#666666',
    textAlign: 'left' as const,
    lineHeight: 22,
  } as const,
};
