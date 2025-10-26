import React from 'react';
import Animated, { Extrapolate, interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';

interface IndicatorDotProps {
  readonly index: number;
  readonly progress: SharedValue<number>;
}

export const IndicatorDot: React.FC<IndicatorDotProps> = ({ index, progress }) => {
  const animStyle = useAnimatedStyle(() => {
    const inputRange = [index - 1, index, index + 1];
    
    const backgroundColor = interpolate(
      progress.value,
      inputRange,
      [0, 1, 0],
      Extrapolate.CLAMP
    );

    return {
      backgroundColor:
        backgroundColor > 0.5
          ? `rgba(0, 0, 0, ${backgroundColor})`
          : 'rgba(0, 0, 0, 0)',
    };
  });

  return <Animated.View style={[styles.indicator, animStyle]} />;
};

const styles = {
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 2,
    borderWidth: 1.5,
    borderColor: '#000000',
    backgroundColor: 'transparent',
  } as const,
};