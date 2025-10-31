import { firestoreDB } from "@/config/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 12;
const COLUMN_WIDTH = (width - 40 - CARD_MARGIN) / 2; 

const AI_QUOTES = [
  "Your next whisper will go viral.",
  "The bots are listening... carefully.",
  "AI doesn’t sleep. Neither should your ideas.",
  "Whisper once, impact forever.",
  "Your voice is the future.",
  "Silence is golden. Whispers are platinum.",
  "Every whisper trains the AI.",
  "Speak softly, change the world.",
];

const getDailyQuote = () => {
  const today = new Date().toISOString().split("T")[0];
  const seed = today.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
  return AI_QUOTES[seed % AI_QUOTES.length];
};

const Profile = () => {
  const { user } = useUser();
  const [streak, setStreak] = useState(0);
  const [quote] = useState(getDailyQuote());
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;

  if (!user) return null;

  useEffect(() => {
    const updateStreak = async () => {
      if (!user?.id) return;

      const streakRef = doc(firestoreDB, "streaks", user.id);
      const snap = await getDoc(streakRef);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (snap.exists()) {
        const data = snap.data();
        const lastActive = data.lastActive?.toDate();
        const lastStreak = data.streak || 0;

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        let newStreak = lastStreak;

        if (lastActive) {
          const lastDate = new Date(lastActive);
          lastDate.setHours(0, 0, 0, 0);

          if (lastDate.getTime() === today.getTime()) {
            newStreak = lastStreak;
          } else if (lastDate.getTime() === yesterday.getTime()) {
            newStreak = lastStreak + 1;
          } else {
            newStreak = 1;
          }
        } else {
          newStreak = 1;
        }

        await setDoc(streakRef, {
          streak: newStreak,
          lastActive: serverTimestamp(),
        });

        setStreak(newStreak);
      } else {
        await setDoc(streakRef, {
          streak: 1,
          lastActive: serverTimestamp(),
        });
        setStreak(1);
      }
    };

    updateStreak();
  }, [user?.id]);

  useEffect(() => {
    if (streak > 0) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.15,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(rotationAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(rotationAnim, {
            toValue: -1,
            duration: 1600,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(rotationAnim, {
            toValue: 0,
            duration: 800,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [streak]);

  const rotation = rotationAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-4deg", "4deg"],
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: user?.imageUrl }}
            style={styles.avatar}
            contentFit="cover"
            transition={1000}
          />
          <View style={styles.onlineIndicator} />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.name}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={styles.email}>
            {user.primaryEmailAddress?.emailAddress}
          </Text>
          <View style={styles.tag}>
            <Feather name="zap" size={12} color="#FFD700" />
            <Text style={styles.tagText}>Free Tier</Text>
          </View>
        </View>
      </View>

      <View style={styles.bentoGrid}>
        <Animated.View
          style={[
            styles.streakCard,
            {
              transform: [{ scale: scaleAnim }, { rotate: rotation }],
            },
          ]}
        >
          <LinearGradient
            colors={["#FF6B6B", "#FF8E53"]}
            style={styles.streakGradient}
          >
            <Feather name="zap" size={36} color="#FFF" />
          </LinearGradient>
          <View style={styles.streakText}>
            <Text style={styles.streakCount}>{streak}</Text>
            <Text style={styles.streakLabel}>
              {streak === 1 ? "Day" : "Days"}
            </Text>
          </View>
          <Feather
            name="chevron-right"
            size={20}
            color="#FF8E53"
            style={styles.streakArrow}
          />
        </Animated.View>

        <View style={styles.quoteCard}>
          <LinearGradient
            colors={["#6366F1", "#8B5CF6"]}
            style={styles.quoteGradient}
          >
            <Feather name="message-circle" size={28} color="#FFF" />
          </LinearGradient>
          <Text style={styles.quoteText} numberOfLines={3}>
            "{quote}"
          </Text>
        </View>
      </View>

      <View style={styles.planCardWrapper}>
        <LinearGradient
          colors={["#1a1a1a", "#000000"]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.planCard}>
          <View style={styles.planHeader}>
            <LinearGradient
              colors={["#FFD700", "#FFC107"]}
              style={styles.starGradient}
            >
              <Feather name="star" size={20} color="#000" />
            </LinearGradient>
            <Text style={styles.planTitle}>WhisperAI Pro</Text>
          </View>

          <Text style={styles.planSubtitle}>
            Unlimited transcriptions • Real-time AI • Priority support
          </Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>$12.99</Text>
            <Text style={styles.perMonth}>/month</Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.subscribeButton,
              pressed && styles.subscribeButtonPressed,
            ]}
            onPress={() => console.log("Subscribe pressed")}
          >
            <LinearGradient
              colors={["#FFFFFF", "#F0F0F0"]}
              style={styles.buttonGradient}
            >
              <Text style={styles.subscribeText}>Upgrade Now</Text>
              <Feather
                name="arrow-right"
                size={16}
                color="#000"
                style={{ marginLeft: 6 }}
              />
            </LinearGradient>
          </Pressable>

          <View style={styles.features}>
            {[
              "Create unlimited agents",
              "Faster Processing",
              "Image Generation",
              "Latest AI",
            ].map((feat, i) => (
              <View key={i} style={styles.featureItem}>
                <Feather name="check" size={14} color="#4ADE80" />
                <Text style={styles.featureText}>{feat}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 3,
    borderColor: "#fff",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 6,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#4ADE80",
    borderWidth: 2.5,
    borderColor: "#fff",
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 19,
    fontWeight: "800",
    color: "#111",
    letterSpacing: -0.3,
  },
  email: {
    fontSize: 14,
    color: "#666",
    marginTop: 3,
    fontWeight: "500",
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: "#FFF8E1",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#B8860B",
  },

  bentoGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 20,
    gap: CARD_MARGIN,
  },

  streakCard: {
    width: COLUMN_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#ffe0e0",
  },
  streakGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  streakText: {
    flex: 1,
  },
  streakCount: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FF6B6B",
    letterSpacing: -0.5,
  },
  streakLabel: {
    fontSize: 11,
    color: "#FF8E53",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  streakArrow: {
    marginLeft: 4,
  },

  quoteCard: {
    width: COLUMN_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    justifyContent: "center",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#e0d6ff",
  },
  quoteGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  quoteText: {
    fontSize: 13.5,
    color: "#444",
    fontStyle: "italic",
    lineHeight: 19,
    fontWeight: "500",
  },

  planCardWrapper: {
    marginHorizontal: 20,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 12,
    marginBottom: 20,
  },
  planCard: {
    padding: 26,
    alignItems: "center",
  },
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  starGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  planTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  planSubtitle: {
    color: "#aaa",
    fontSize: 13.5,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 16,
    fontWeight: "500",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 20,
  },
  price: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "900",
    letterSpacing: -1,
  },
  perMonth: {
    color: "#999",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 6,
    marginBottom: 6,
  },
  subscribeButton: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  subscribeButtonPressed: {
    transform: [{ scale: 0.97 }],
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  subscribeText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  features: {
    width: "100%",
    gap: 10,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  featureText: {
    color: "#ccc",
    fontSize: 13.5,
    fontWeight: "500",
  },
});