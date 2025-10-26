import { OnboardingSlide } from '@/app/constants/slides';
import React from 'react';
import { Dimensions } from 'react-native';
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { SlideContent } from './SlideContent';

const { width, height } = Dimensions.get('window');

interface SlidesContainerProps {
  readonly progress: SharedValue<number>;
  readonly slides: readonly OnboardingSlide[];
  readonly currentSlide: number;
}

export const SlidesContainer: React.FC<SlidesContainerProps> = ({
  progress,
  slides,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(progress.value, [0, slides.length - 1], [0, -(slides.length - 1) * width]),
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {slides.map((slide, index) => (
        <SlideContent
          key={slide.id}
          slide={slide}
          index={index}
          isActive={false} 
          progress={progress}
        />
      ))}
    </Animated.View>
  );
};

const styles = {
  container: {
    flexDirection: 'row' as const,
    width: width * 3, 
    height: height * 0.7,
  } as const,
};
