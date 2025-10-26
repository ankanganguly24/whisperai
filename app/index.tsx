import React, { useCallback, useState } from 'react';
import { Dimensions, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { Footer } from './components/onboadingScreen/Footer';
import { SlidesContainer } from './components/onboadingScreen/SlidesContainer';
import { ONBOARDING_SLIDES, SLIDE_ANIMATION_DURATION } from './constants/slides';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const progress = useSharedValue(0);

  const goToSlide = useCallback(
    (index: number) => {
      const constrainedIndex = Math.max(0, Math.min(index, ONBOARDING_SLIDES.length - 1));
      setCurrentSlideIndex(constrainedIndex);
      progress.value = withTiming(constrainedIndex, { duration: SLIDE_ANIMATION_DURATION });
    },
    [progress]
  );

  const handlePrevious = useCallback(() => {
    goToSlide(currentSlideIndex - 1);
  }, [currentSlideIndex, goToSlide]);

  const handleNext = useCallback(() => {
    goToSlide(currentSlideIndex + 1);
  }, [currentSlideIndex, goToSlide]);

  const handleGetStarted = useCallback(() => {
    console.log('Starting WhisperAI');
  }, []);

  const isLastSlide = currentSlideIndex === ONBOARDING_SLIDES.length - 1;

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      const newIndex = currentSlideIndex - Math.round(e.translationX / width);
      const constrainedIndex = Math.max(0, Math.min(newIndex, ONBOARDING_SLIDES.length - 1));
      if (constrainedIndex !== currentSlideIndex) {
        setCurrentSlideIndex(constrainedIndex);
        progress.value = constrainedIndex;
      }
    });

  return (
    <View style={[styles.container, { backgroundColor: '#fff' }]}>
      <GestureHandlerRootView style={styles.gestureRoot}>
        <GestureDetector gesture={gesture}>
          <View style={styles.wrapper}>
            <SlidesContainer progress={progress} slides={ONBOARDING_SLIDES} currentSlide={currentSlideIndex} />
            <Footer
              progress={progress}
              totalSlides={ONBOARDING_SLIDES.length}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onGetStarted={handleGetStarted}
              isLastSlide={isLastSlide}
            />
          </View>
        </GestureDetector>
      </GestureHandlerRootView>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
  } as const,
  gestureRoot: {
    flex: 1,
  } as const,
  wrapper: {
    flex: 1,
  } as const,
};