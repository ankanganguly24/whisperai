import { Feather } from '@expo/vector-icons';
import { Stack, useRouter, useSegments } from 'expo-router';
import React, { JSX } from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const HORIZONTAL_MARGIN = 16; 

interface TabItem {
  name: string;
  label: string;
  icon: string;
}

const ROUTES: Record<any, any> = {
  home: '/(tabs)/Home',
  explore: '/(tabs)/Explore',
  history: '/(tabs)/History',
  profile: '/(tabs)/Profile',
};


const TABS: TabItem[] = [
  { name: 'Home', label: 'Home', icon: 'home' },
  { name: 'Explore', label: 'Explore', icon: 'search' },
  { name: 'History', label: 'History', icon: 'clock' },
  { name: 'Profile', label: 'Profile', icon: 'user' },
];

const ICON_MAP: Record<string, JSX.Element> = {
  home: <Feather name="home" size={22} color="#000" />,
  search: <Feather name="search" size={22} color="#000" />,
  clock: <Feather name="clock" size={22} color="#000" />,
  user: <Feather name="user" size={22} color="#000" />,
};

const TAB_WIDTH = (width - HORIZONTAL_MARGIN * 2) / TABS.length;

function CustomTabBar() {
  const router = useRouter();
  const segments = useSegments();
  const insets = useSafeAreaInsets();

  const activeIndex = TABS.findIndex(
    tab => tab.name === (segments[segments.length - 1] || 'home')
  );

  const translateX = useSharedValue(activeIndex * TAB_WIDTH);

  const handleTabPress = (tabName: string, index: number) => {
  const route = ROUTES[tabName.toLowerCase()];
  if (route) {
    router.replace(route);
    translateX.value = withSpring(index * TAB_WIDTH);
  }
};


  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(translateX.value + 8) }],
  }));

  return (
    <View style={[styles.tabBarContainer, { paddingBottom: insets.bottom + 8 }]}>
      <View style={styles.tabBar}>
        <Animated.View
          style={[
            styles.activeIndicator,
            indicatorStyle,
            { width: TAB_WIDTH - 14 }, 
          ]}
        />
        {TABS.map((tab, index) => (
          <TabBarItem
            key={tab.name}
            tab={tab}
            isActive={activeIndex === index}
            onPress={() => handleTabPress(tab.name, index)}
          />
        ))}
      </View>
    </View>
  );
}

interface TabBarItemProps {
  tab: TabItem;
  isActive: boolean;
  onPress: () => void;
}

function TabBarItem({ tab, isActive, onPress }: TabBarItemProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(isActive ? 1.1 : 1) }],
  }));

  return (
    <Pressable onPress={onPress} style={[styles.tabItem, { width: TAB_WIDTH }]}>
      <Animated.View style={[styles.iconWrapper, animatedStyle]}>
        {ICON_MAP[tab.icon]}
      </Animated.View>
      <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
    </Pressable>
  );
}

export default function TabsLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="home" />
        <Stack.Screen name="explore" />
        <Stack.Screen name="history" />
        <Stack.Screen name="profile" />
      </Stack>
      <CustomTabBar />
    </>
  );
}

const styles = {
  tabBarContainer: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  } as const,
  tabBar: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: HORIZONTAL_MARGIN,
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 0,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  } as const,
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  } as const,
  iconWrapper: {
    marginBottom: 2,
  } as const,
  label: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  } as const,
  labelActive: {
    color: '#000',
    fontWeight: '600' as const,
  } as const,
  activeIndicator: {
    position: 'absolute' as const,
    height: 4,
    bottom: 0,
    left: 0,
    backgroundColor: '#000',
    borderRadius: 2,
  } as const,
};
