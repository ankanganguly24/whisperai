import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming
} from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const CreateHelperCard = () => {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const floatY = useSharedValue(0);
  const pressScale = useSharedValue(1);
  const router = useRouter()

  useEffect(() => {
    floatY.value = withRepeat(
      withTiming(20, { duration: 3000 }),
      -1,
      true
    );
  }, [floatY]);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 4000 }),
      -1,
      false
    );
  }, [rotation]);

  const handlePressIn = () => {
    pressScale.value = withSpring(0.95, { damping: 8, mass: 0.5 });
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(1, { damping: 8, mass: 0.5 });
  };

  const animatedRotation = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const animatedFloat = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  const animatedPress = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  return (
    <AnimatedTouchableOpacity
      onPress={()=> router.push("/explore")}
      activeOpacity={0.9}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.card, animatedPress]}
    >
      <AnimatedView
        style={[
          styles.banner,
          animatedFloat,
        ]}
      >
        <View
          style={[
            styles.decorCircle1,
          ]}
        />
        <View
          style={[
            styles.decorCircle2,
          ]}
        />

        <Animated.Text style={[styles.plusIcon, animatedRotation]}>
          ➕
        </Animated.Text>

        <Text style={styles.mainText}>Create Your Own Helper</Text>
        <Text style={styles.subText}>Tap me</Text>
      </AnimatedView>
    </AnimatedTouchableOpacity>
  );
};

export default CreateHelperCard;

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  banner: {
    paddingVertical: 24,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    gap: 12,
    backgroundColor: '#667eea',
  },
  decorCircle1: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    position: 'absolute',
    top: -40,
    right: -40,
  },
  decorCircle2: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    position: 'absolute',
    bottom: -30,
    left: -30,
  },
  plusIcon: {
    fontSize: 56,
    zIndex: 1,
  },
  mainText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: -0.4,
    zIndex: 1,
  },
  subText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    zIndex: 1,
  },
});