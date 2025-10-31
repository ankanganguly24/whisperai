import { firestoreDB } from "@/config/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";

import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import {
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Animated, {
  FadeInDown,
  Layout
} from "react-native-reanimated";
import { timeAgo } from "../shared/time-ago";

// ── Type ─────────────────────────────────────────────────────────────────────
type ChatDoc = {
  agentName: string;
  docId: string;
  createdAt: string | Timestamp;
  messages: { role: string; content: string }[];
  userEmail: string;
};

// ── Helper: Convert Firestore Timestamp or string to Date ───────────────────
const toDate = (value: any): Date => {
  if (!value) return new Date();
  if (value instanceof Timestamp) return value.toDate();
  if (typeof value === "string" || typeof value === "number")
    return new Date(value);
  return value;
};

// ── Main Component ───────────────────────────────────────────────────────────
const History = () => {
  const { user } = useUser();
  const router = useRouter();
  const [chats, setChats] = useState<ChatDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ── Fetch Chats ───────────────────────────────────────────────────────────
  const fetchChats = useCallback(
    async (isRefresh = false) => {
      if (!user?.primaryEmailAddress?.emailAddress) return;

      !isRefresh && setLoading(true);
      isRefresh && setRefreshing(true);

      try {
        const q = query(
          collection(firestoreDB, "chats"),
          where("userEmail", "==", user.primaryEmailAddress.emailAddress)
        );

        const snapshot = await getDocs(q);
        const data: ChatDoc[] = snapshot.docs.map((doc) => ({
          ...doc.data(),
          docId: doc.id,
        })) as ChatDoc[];

        // Sort by latest
        data.sort(
          (a, b) =>
            toDate(b.createdAt).getTime() - toDate(a.createdAt).getTime()
        );

        // Group by agentName → keep latest
        const unique: Record<string, ChatDoc> = {};
        for (const chat of data) {
          if (!unique[chat.agentName]) {
            unique[chat.agentName] = chat;
          }
        }

        setChats(Object.values(unique));
      } catch (err) {
        console.error("Error fetching chats:", err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user]
  );

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  // ── Navigation ───────────────────────────────────────────────────────────
  const handleChatPress = (chat: ChatDoc) => {
    router.push({
      pathname: "/chat",
      params: { id: chat.docId, agentName: chat.agentName },
    });
  };

  // ── UI ───────────────────────────────────────────────────────────────────
  if (loading) return <SkeletonLoader />;

  if (!chats.length) return <EmptyState onRefresh={() => fetchChats(true)} />;

  return (
    <View style={styles.container}>
      <Animated.Text entering={FadeInDown} style={styles.header}>
        Recent Bots
      </Animated.Text>

      <Animated.FlatList
        data={chats}
        keyExtractor={(i) => i.docId}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchChats(true)}
            tintColor="#ff4400"
          />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
        itemLayoutAnimation={Layout}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 80)}>
            <ChatCard chat={item} onPress={() => handleChatPress(item)} />
          </Animated.View>
        )}
      />
    </View>
  );
};

// ── COMPONENTS ───────────────────────────────────────────────────────────────

const ChatCard = ({
  chat,
  onPress,
}: {
  chat: ChatDoc;
  onPress: () => void;
}) => {
  const lastMsg =
    chat.messages?.[chat.messages.length - 1]?.content || "No messages yet";

  const timeAgoStr = timeAgo(toDate(chat.createdAt)); // ← Fixed!

  return (
    <TouchableOpacity activeOpacity={0.82} onPress={onPress}>
      <LinearGradient
        colors={["#ffffff", "#f8f9fa"]}
        style={styles.cardGradient}
      >
        <View style={styles.card}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {chat.agentName.charAt(0).toUpperCase()}
            </Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.agentName}>{chat.agentName}</Text>
            <Text style={styles.messagePreview} numberOfLines={1}>
              {lastMsg}
            </Text>
          </View>

          <Text style={styles.timeAgo}>{timeAgoStr}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const SkeletonLoader = () => (
  <View style={styles.center}>
    {[...Array(4)].map((_, i) => (
      <View key={i} style={styles.skeletonCard}>
        <View style={styles.skeletonAvatar} />
        <View style={styles.skeletonLines}>
          <View style={styles.skeletonLineShort} />
          <View style={styles.skeletonLineLong} />
        </View>
      </View>
    ))}
  </View>
);

const EmptyState = ({ onRefresh }: { onRefresh: () => void }) => (
  <View style={styles.center}>
    <View style={styles.lottiePlaceholder}>
      <Text style={styles.lottieEmoji}>No chats yet</Text>
    </View>
    <Text style={styles.emptyTitle}>Start a conversation!</Text>
    <Text style={styles.emptySubtitle}>
      Tap any bot below to begin whispering with AI.
    </Text>
    <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh}>
      <Text style={styles.refreshText}>Refresh</Text>
    </TouchableOpacity>
  </View>
);

export default History;

// ── STYLES ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111",
    marginBottom: 16,
    letterSpacing: -0.3,
  },

  cardGradient: {
    marginBottom: 12,
    borderRadius: 18,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ff4400",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  content: {
    flex: 1,
  },
  agentName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ff4400",
    marginBottom: 3,
  },
  messagePreview: {
    fontSize: 14,
    color: "#444",
    fontWeight: "500",
  },
  timeAgo: {
    fontSize: 12,
    color: "#888",
    fontWeight: "500",
  },

  // Skeleton
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  skeletonCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  skeletonAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e0e0e0",
    marginRight: 14,
  },
  skeletonLines: {
    flex: 1,
  },
  skeletonLineShort: {
    height: 14,
    width: "45%",
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonLineLong: {
    height: 12,
    width: "80%",
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
  },

  // Empty State
  lottiePlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: "#fff2e6",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#ff4400",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  lottieEmoji: {
    fontSize: 36,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  refreshBtn: {
    backgroundColor: "#ff4400",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
  },
  refreshText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});