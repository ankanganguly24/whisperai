import { useUser } from "@clerk/clerk-expo";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const Profile = () => {
  const { user } = useUser();

  if (!user) return null;

  return (
    <View style={styles.container}>
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
          <Text style={styles.email}>{user.primaryEmailAddress?.emailAddress}</Text>
          <View style={styles.tag}>
            <Feather name="zap" size={12} color="#FFD700" />
            <Text style={styles.tagText}>Free Tier</Text>
          </View>
        </View>
      </View>

      {/* ---------- Pro Plan Card ---------- */}
      <View style={styles.planCardWrapper}>
        <LinearGradient
          colors={["#1a1a1a", "#000000"]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.planCard}>
          {/* Header */}
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
              <Feather name="arrow-right" size={16} color="#000" style={{ marginLeft: 6 }} />
            </LinearGradient>
          </Pressable>

          <View style={styles.features}>
            {["Create unlimited agents", "Faster Processing", "Image Generation", "Latest AI"].map((feat, i) => (
              <View key={i} style={styles.featureItem}>
                <Feather name="check" size={14} color="#4ADE80" />
                <Text style={styles.featureText}>{feat}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
    marginBottom: 24,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
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

  planCardWrapper: {
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 12,
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