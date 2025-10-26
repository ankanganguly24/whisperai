import React from 'react';
import { View } from 'react-native';
import { SharedValue } from 'react-native-reanimated';

import { IndicatorDot } from './IndicatorDot';

interface ProgressIndicatorsProps {
  readonly progress: SharedValue<number>;
  readonly totalSlides: number;
}

export const ProgressIndicators: React.FC<ProgressIndicatorsProps> = ({
  progress,
  totalSlides,
}) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSlides }).map((_, index) => (
        <IndicatorDot key={index} index={index} progress={progress} />
      ))}
    </View>
  );
};

const styles = {
  container: {
    flexDirection: 'row' as const,
    justifyContent: 'center',
    gap: 6,
    flex: 1,
  } as const,
};
