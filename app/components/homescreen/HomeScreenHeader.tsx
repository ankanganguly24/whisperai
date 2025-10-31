import { useAuth, useUser } from "@clerk/clerk-expo";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import * as Updates from "expo-updates";
import React from "react";
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const HomeScreenHeader = () => {
  const { user, isSignedIn } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const handleProPress = () => {
    router.push("/profile");
  };

  const handleLogoutPress = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut();
              router.replace("/");

              setTimeout(async () => {
                if (Platform.OS === "web") {
                  window.location.reload();
                } else {
                  await Updates.reloadAsync();
                }
              }, 300);
            } catch (err) {
              console.error("Logout error:", err);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        {/* ---------- Left ---------- */}
        <View style={styles.leftContent}>
          <Image
            source={require("../../../assets/images/icon.png")}
            style={styles.logo}
          />
          <Text style={styles.logoText}>WhisperAI</Text>
        </View>

        {/* ---------- Right ---------- */}
        <View style={styles.rightContent}>
          <Pressable
            style={styles.proButton}
            onPress={handleProPress}
            android_ripple={{ color: "rgba(0, 0, 0, 0.1)" }}
            hitSlop={8}
          >
            <Text style={styles.proText}>Pro</Text>
            <Feather
              name="codepen"
              size={14}
              color="#000"
              style={styles.crownIcon}
            />
          </Pressable>

          {isSignedIn && (
            <Pressable
              style={({ pressed }) => [
                styles.iconButton,
                pressed && { opacity: 0.5 },
              ]}
              onPress={handleLogoutPress}
              hitSlop={12}
              android_ripple={{ color: "rgba(255, 0, 0, 0.1)" }}
            >
              <Feather name="log-out" size={20} color="#e63946" />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

export default HomeScreenHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderRadius: 12,
    borderBottomColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  logoText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  proButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 6,
  },
  proText: {
    color: "#000",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  crownIcon: {
    marginTop: 1,
    marginLeft: 4,
  },
  iconButton: {
    padding: 8,
    marginHorizontal: 2,
    borderRadius: 8,
  },
});
