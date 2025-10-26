import { useUser } from '@clerk/clerk-expo';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// Caring messages that feel personal
const caringMessages = {
  morning: [
    "rise and shine! let's make today count 🌅",
    "a fresh start awaits you today",
    "i hope you had a restful night",
    "let's turn your dreams into reality today",
    "you've got this, make today yours!"
  ],
  afternoon: [
    "you're doing amazing so far! keep the momentum 💪",
    "take a moment to appreciate your progress",
    "you're halfway through and crushing it",
    "remember to breathe and enjoy the moment",
    "your hard work is inspiring"
  ],
  evening: [
    "you deserve some rest, you've earned it 🌅",
    "reflect on what you've accomplished today",
    "wind down and take care of yourself",
    "you made it through another day, be proud",
    "prepare for a peaceful night ahead"
  ],
  night: [
    "sleep is where magic happens 🌙",
    "rest well, you've done great today",
    "sweet dreams are coming your way",
    "recharge for tomorrow's adventures",
    "goodnight, may you dream of beautiful things"
  ]
};

const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
};

const getGreetingEmoji = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "🌅";
  if (hour >= 12 && hour < 17) return "☀️";
  if (hour >= 17 && hour < 21) return "🌆";
  return "🌙";
};

// Animated blinking star component
const BlinkingStar = ({ left, top, size, delay }: { left: number; top: number; size: number; delay: number }) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { 
        duration: 2000 + Math.random() * 1500, 
        easing: Easing.bezier(0.4, 0.0, 0.2, 1) 
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left,
          top,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: 'white',
          shadowColor: '#fff',
          shadowOpacity: 0.8,
          shadowRadius: 4,
        },
        animatedStyle,
      ]}
    />
  );
};

// Gentle floating animation component
const FloatingElement = ({ children, delay }: { children: React.ReactNode; delay: number }) => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(12, { 
        duration: 3000, 
        easing: Easing.bezier(0.4, 0.0, 0.2, 1) 
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
};

const Greetings = () => {
  const { user } = useUser();
  const [message, setMessage] = useState<string>("");
  const timeOfDay = getTimeOfDay();
  const emoji = getGreetingEmoji();

  useEffect(() => {
    const messages = caringMessages[timeOfDay as keyof typeof caringMessages];
    const randomIndex = Math.floor(Math.random() * messages.length);
    setMessage(messages[randomIndex]);
  }, [timeOfDay]);

  const name = user?.firstName || "Friend";

  const timeConfig = {
    morning: {
      colors: ['#FFF9E6', '#FFE5B4', '#FFDAB9'],
      accentColor: '#FF6B6B',
      darkText: '#2C3E50'
    },
    afternoon: {
      colors: ['#E0F7FF', '#B3E5FC', '#81D4FA'],
      accentColor: '#4ECDC4',
      darkText: '#263238'
    },
    evening: {
      colors: ['#FFE5D9', '#FFB399', '#FF8C42'],
      accentColor: '#FF6B35',
      darkText: '#2C1810'
    },
    night: {
      colors: ['#0A1428', '#1B3A5C', '#2D5A7B'],
      accentColor: '#64B5F6',
      darkText: '#E8F4FF'
    }
  };

  const config = timeConfig[timeOfDay as keyof typeof timeConfig];

  const renderNightStars = () => {
    if (timeOfDay !== 'night') return null;
    const stars = [];
    for (let i = 0; i < 25; i++) {
      stars.push(
        <BlinkingStar
          key={`star-${i}`}
          left={Math.random() * width}
          top={Math.random() * height * 0.5}
          size={Math.random() * 2.5 + 1}
          delay={Math.random() * 1000}
        />
      );
    }
    return stars;
  };

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={config.colors as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {renderNightStars()}
        
        <View style={styles.content}>
          <FloatingElement delay={0}>
            <View style={styles.header}>
              <Text style={styles.emoji}>{emoji}</Text>
              <Text style={[styles.greeting, { color: config.darkText }]}>
                Hey there, <Text style={[styles.name, { color: config.accentColor }]}>{name}</Text>
              </Text>
            </View>
          </FloatingElement>

          <View style={styles.messageBox}>
            <View 
              style={[
                styles.messageDot, 
                { backgroundColor: config.accentColor }
              ]} 
            />
            <Text style={[styles.message, { color: config.darkText }]}>
              {message}
            </Text>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: config.darkText }]}>
              You matter to me ✨
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default Greetings;

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  container: {
    width: '100%',
    minHeight: 220,
    borderRadius: 24,
    padding: 28,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  content: {
    zIndex: 2,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emoji: {
    fontSize: 40,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  name: {
    fontWeight: '900',
  },
  messageBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 8,
  },
  messageDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    opacity: 0.7,
  },
  message: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    flex: 1,
    letterSpacing: 0.3,
  },
  footer: {
    marginTop: 12,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.8,
    fontStyle: 'italic',
  },
});