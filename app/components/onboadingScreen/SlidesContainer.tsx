import { OnboardingSlide } from '@/app/constants/slides';
import React from 'react';
import { Dimensions, View } from 'react-native';
import { SharedValue } from 'react-native-reanimated';
import { SlideContent } from './SlideContent';

const { width, height } = Dimensions.get('window');

interface SlidesContainerProps {
  readonly progress: SharedValue<number>;
  readonly slides: readonly OnboardingSlide[];
  readonly currentSlide: number;
}

export const SlidesContainer: React.FC<SlidesContainerProps> = ({ progress, slides, currentSlide }) => {
  return (
    <View style={styles.container}>
      {slides.map((slide, index) => (
        <SlideContent
          key={slide.id}
          slide={slide}
          index={index}
          progress={progress}
          isActive={index === currentSlide}
        />
      ))}
    </View>
  );
};

const styles = {
  container: {
    width: width,
    height: height * 0.7,
    overflow: 'hidden' as const,
  } as const,
};
