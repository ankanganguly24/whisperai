import { Dimensions } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import { SharedValue } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface UseOnboardingGesturesProps {
  progress: SharedValue<number>;
  currentSlide: SharedValue<number>;
  onGoToSlide: (index: number) => void;
  totalSlides: number;
}

export const useOnboardingGestures = ({
  progress,
  currentSlide,
  onGoToSlide,
  totalSlides,
}: UseOnboardingGesturesProps) => {
  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      const newProgress = currentSlide.value - e.translationX / width;
      progress.value = Math.max(0, Math.min(newProgress, totalSlides - 1));
    })
    .onEnd(() => {
      const nextSlide = Math.round(progress.value);
      onGoToSlide(nextSlide);
    });

  return { gesture };
};