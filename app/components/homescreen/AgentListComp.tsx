import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import Greetings from './Greetings';
import CreateHelperCard from './HelperBot';

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
  initialText: string;
  prompt: string;
};

const agents: Agent[] = [
  { 
    id: 'agent_1', 
    name: 'Sunny', 
    desc: 'Cheerful study buddy', 
    icon: '🌞', 
    featured: true,
    gradient: ['#FFF9E6', '#FFE5B4'],
    accentColor: '#FF6B6B',
    initialText: "Hey there! I’m Sunny ☀️ — ready to brighten up your study session! What subject are we tackling today?",
    prompt: "You are Sunny, a cheerful and energetic study buddy who motivates students with positivity and simple explanations. Always keep a friendly, supportive tone and use fun metaphors or emojis occasionally."
  },
  { 
    id: 'agent_2', 
    name: 'ChillBot', 
    desc: 'Mindfulness guide', 
    icon: '🧘‍♂️', 
    featured: true,
    gradient: ['#E8F5E9', '#B3E5FC'],
    accentColor: '#4ECDC4',
    initialText: "Hey friend 🌿, take a deep breath. Let’s relax and refocus — what’s on your mind today?",
    prompt: "You are ChillBot, a calm and mindful AI guide who helps users stay grounded and relaxed. You speak slowly, gently, and use mindfulness techniques like breathing exercises and reflection prompts."
  },
  { 
    id: 'agent_3', 
    name: 'Spark', 
    desc: 'Creative idea generator', 
    icon: '✨', 
    featured: true,
    gradient: ['#F3E5F5', '#E1BEE7'],
    accentColor: '#9C27B0',
    initialText: "✨ Hey dreamer! I’m Spark — ready to help you light up your imagination. What are we brainstorming today?",
    prompt: "You are Spark, a creative and imaginative AI who helps users generate original ideas, concepts, and inspiration. Use expressive language, metaphors, and enthusiasm to keep creativity flowing."
  },
  { 
    id: 'agent_4', 
    name: 'FocusFox', 
    desc: 'Productivity helper', 
    icon: '🦊', 
    featured: false,
    gradient: ['#FFE5D9', '#FFB399'],
    accentColor: '#FF6B35',
    initialText: "Hey, I’m FocusFox 🦊 — let’s crush your to-do list together! What task are we starting with?",
    prompt: "You are FocusFox, a productivity-focused assistant who helps users plan, prioritize, and complete tasks efficiently. You use short, action-driven sentences and a friendly coach-like tone."
  },
  { 
    id: 'agent_5', 
    name: 'Breezy', 
    desc: 'Fun learning buddy', 
    icon: '🍃', 
    featured: false,
    gradient: ['#C8E6C9', '#A5D6A7'],
    accentColor: '#66BB6A',
    initialText: "Hey hey! I’m Breezy 🍃 — let’s make learning light and fun. What should we explore first?",
    prompt: "You are Breezy, a playful and curious AI who turns learning into an engaging experience. Use humor, mini challenges, and light-hearted explanations to make topics enjoyable."
  },
];

type DataItem = Agent | { type: 'separator' };

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const AgentCard = ({ agent }: { agent: Agent }) => {
  const scale = useSharedValue(1);
  const router = useRouter()

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 8, mass: 0.5 });
    router.push({
      pathname: "/chat" as any,
      params: {
        agentId: agent.id ,
        agentName: agent.name,
        initialText: agent.initialText,
        agentPrompt: agent.prompt,
      }
    })
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
      <View style={styles.cardContent}  >
        <Text style={[styles.name, { color: agent.accentColor }]}>{agent.name}</Text>
        <Text style={styles.desc}>{agent.desc}</Text>
      </View>
    </AnimatedTouchableOpacity>
  );
};

const AgentListComp = () => {
  const dataWithSeparator: DataItem[] = [
    agents[0],
    agents[1],
    { type: 'separator' },
    ...agents.slice(2),
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={dataWithSeparator}
        keyExtractor={(item) => 
          'type' in item ? 'separator' : item.id
        }
        renderItem={({ item }) => {
          if ('type' in item && item.type === 'separator') {
            return (
              <View style={styles.fullWidth}>
                <CreateHelperCard />
              </View>
            );
          }
          return <AgentCard agent={item as Agent} />;
        }}
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
  fullWidth: {
    width: '100%',
    marginBottom: 16,
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