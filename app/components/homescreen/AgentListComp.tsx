import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import Greetings from './Greetings';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

type Agent = {
  id: string;
  name: string;
  desc: string;
  icon: string;
  featured: boolean;
  gradient: string[];
  accentColor: string;
};

const agents: Agent[] = [
  { 
    id: 'agent_1', 
    name: 'Sunny', 
    desc: 'Cheerful study buddy', 
    icon: '🌞', 
    featured: true,
    gradient: ['#FFF9E6', '#FFE5B4'],
    accentColor: '#FF6B6B'
  },
  { 
    id: 'agent_2', 
    name: 'ChillBot', 
    desc: 'Mindfulness guide', 
    icon: '🧘‍♂️', 
    featured: true,
    gradient: ['#E8F5E9', '#B3E5FC'],
    accentColor: '#4ECDC4'
  },
  { 
    id: 'agent_3', 
    name: 'Spark', 
    desc: 'Creative idea generator', 
    icon: '✨', 
    featured: true,
    gradient: ['#F3E5F5', '#E1BEE7'],
    accentColor: '#9C27B0'
  },
  { 
    id: 'agent_4', 
    name: 'FocusFox', 
    desc: 'Productivity helper', 
    icon: '🦊', 
    featured: false,
    gradient: ['#FFE5D9', '#FFB399'],
    accentColor: '#FF6B35'
  },
  { 
    id: 'agent_5', 
    name: 'Breezy', 
    desc: 'Fun learning buddy', 
    icon: '🍃', 
    featured: false,
    gradient: ['#C8E6C9', '#A5D6A7'],
    accentColor: '#66BB6A'
  },
  { 
    id: 'agent_6', 
    name: 'Nova', 
    desc: 'Self-improvement guide', 
    icon: '🌟', 
    featured: true,
    gradient: ['#E0F2F1', '#B2DFDB'],
    accentColor: '#00897B'
  },
];

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const AgentCard = ({ agent }: { agent: Agent }) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 8, mass: 0.5 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 8, mass: 0.5 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedTouchableOpacity
      activeOpacity={0.8}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.card,
        agent.featured && styles.featuredCard,
        animatedStyle,
      ]}
    >
      {/* Gradient background with icon */}
      <View 
        style={[
          styles.gradientBg,
          {
            backgroundColor: agent.gradient[0],
            borderBottomWidth: 1,
            borderBottomColor: agent.accentColor + '30',
          }
        ]}
      >
        {/* Decorative circles */}
        <View
          style={[
            styles.decorCircle1,
            { backgroundColor: agent.accentColor }
          ]}
        />
        <View
          style={[
            styles.decorCircle2,
            { backgroundColor: agent.accentColor }
          ]}
        />
        
        {/* Featured badge on image */}
        {agent.featured && (
          <View 
            style={[
              styles.badge,
              { backgroundColor: agent.accentColor }
            ]}
          >
            <Text style={styles.badgeText}>✨ Featured</Text>
          </View>
        )}
        
        {/* Icon in the gradient area */}
        <Text style={styles.headerIcon}>{agent.icon}</Text>
      </View>

      {/* Content */}
      <View style={styles.cardContent}>
        <Text style={[styles.name, { color: agent.accentColor }]}>{agent.name}</Text>
        <Text style={styles.desc}>{agent.desc}</Text>
      </View>
    </AnimatedTouchableOpacity>
  );
};

const AgentListComp = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={agents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AgentCard agent={item} />}
        numColumns={2}
        style={{ marginBottom: 260 }}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        ListHeaderComponent={
          <View style={{ marginBottom: 24 }}>
            <Greetings />
          </View>
        }
      />
    </View>
  );
};

export default AgentListComp;

const styles = StyleSheet.create({
  container: {
    
  },
  listContent: {
    paddingBottom: 24,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  card: {
    width: cardWidth,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  featuredCard: {
    shadowOpacity: 0.15,
    elevation: 6,
  },
  gradientBg: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  decorCircle1: {
    width: 60,
    height: 60,
    borderRadius: 30,
    opacity: 0.1,
    position: 'absolute',
    top: -15,
    right: -15,
  },
  decorCircle2: {
    width: 40,
    height: 40,
    borderRadius: 20,
    opacity: 0.08,
    position: 'absolute',
    bottom: -10,
    left: -10,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  headerIcon: {
    fontSize: 48,
    zIndex: 1,
  },
  cardContent: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  desc: {
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 14,
  },
});