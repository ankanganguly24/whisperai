import { firestoreDB } from "@/config/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  LayoutAnimation,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const { width } = Dimensions.get("window");
const CARD_GAP = 12;
const CARD_WIDTH = (width - 40 - CARD_GAP) / 2;

const Explore = () => {
  const { user } = useUser();
  const router = useRouter();

  const [agents, setAgents] = useState<any[]>([]);
  const [myAgents, setMyAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [agentName, setAgentName] = useState("");
  const [agentDesc, setAgentDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const filteredAgents = useMemo(() => {
    if (!searchQuery) return agents;
    return agents.filter((agent) =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [agents, searchQuery]);

  const fetchAgents = useCallback(
    async (reset = false) => {
      const isRefresh = reset && !loading;
      !isRefresh && setLoading(!reset);
      isRefresh && setRefreshing(true);
      setLoadingMore(!reset && !isRefresh);

      try {
        let q = query(
          collection(firestoreDB, "agents"),
          orderBy("createdAt", "desc"),
          limit(8)
        );

        if (!reset && lastDoc) {
          q = query(q, startAfter(lastDoc));
        }

        const snap = await getDocs(q);
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        if (reset) {
          setAgents(docs);
        } else {
          setAgents((prev) => [...prev, ...docs]);
        }

        setLastDoc(snap.docs[snap.docs.length - 1] || null);
      } catch (err) {
        console.error("Fetch Agents Error:", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [lastDoc, loading]
  );

  const fetchMyAgents = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;
    try {
      const q = query(
        collection(firestoreDB, "agents"),
        where("createdBy", "==", user.primaryEmailAddress.emailAddress),
        limit(6)
      );

      const snap = await getDocs(q);
      const data = snap.docs
        .map((d) => ({
          id: d.id,
          ...d.data(),
          createdAtDate: d.data().createdAt
            ? new Date(d.data().createdAt)
            : new Date(0),
        }))
        .sort((a, b) => b.createdAtDate.getTime() - a.createdAtDate.getTime());

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setMyAgents(data);
    } catch (err) {
      console.error("My Agents Error:", err);
    }
  };

  useEffect(() => {
    fetchMyAgents();
    fetchAgents(true);
  }, []);

  const onRefresh = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    fetchAgents(true);
    fetchMyAgents();
  };

  const handleLoadMore = () => {
    if (loadingMore || !lastDoc) return;
    fetchAgents();
  };

  const handleCreateAgent = async () => {
    if (!agentName.trim() || !agentDesc.trim()) return;
    setSubmitting(true);
    Haptics.selectionAsync();

    try {
      await addDoc(collection(firestoreDB, "agents"), {
        name: agentName.trim(),
        description: agentDesc.trim(),
        createdBy: user?.primaryEmailAddress?.emailAddress || "anonymous",
        createdAt: new Date().toISOString(),
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
          agentName
        )}`,
      });

      setAgentName("");
      setAgentDesc("");
      setModalVisible(false);
      await Promise.all([fetchMyAgents(), fetchAgents(true)]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      console.error(err);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setSubmitting(false);
    }
  };

  const SkeletonCard = () => (
    <Animated.View entering={FadeIn} style={styles.skeletonCard}>
      <View style={styles.skeletonAvatar} />
      <View style={styles.skeletonLine} />
      <View style={[styles.skeletonLine, { width: "70%" }]} />
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore Agents</Text>
        <Pressable
          onPress={() => setModalVisible(true)}
          style={styles.fab}
          android_ripple={{ color: "rgba(255,255,255,0.3)" }}
        >
          <Ionicons name="add" size={26} color="#fff" />
        </Pressable>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search agents by name..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <Pressable onPress={() => setSearchQuery("")} style={styles.clearBtn}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </Pressable>
        ) : null}
      </View>

      <FlatList
        data={filteredAgents}
        numColumns={2}
        keyExtractor={(item, index) => item.id ?? `agent-${index}`}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#ff4400"
          />
        }
        ListHeaderComponent={
          <>
            <Animated.View entering={FadeInDown}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>My Agents</Text>
                {myAgents.length > 0 && (
                  <TouchableOpacity onPress={() => router.push("/profile")}>
                    <Text style={styles.showAll}>Show All</Text>
                  </TouchableOpacity>
                )}
              </View>

              {myAgents.length === 0 ? (
                <View style={styles.emptyMyAgents}>
                  <Text style={styles.emptyText}>
                    No agents yet. Create one!
                  </Text>
                </View>
              ) : (
                <View style={styles.myAgentsGrid}>
                  {myAgents.map((a, i) => (
                    <Animated.View
                      key={a.id}
                      entering={FadeInDown.delay(i * 80)}
                    >
                      <AgentCard agent={a} isMine />
                    </Animated.View>
                  ))}
                </View>
              )}
            </Animated.View>

            <Text style={styles.worldTitle}>
              World Agents ({filteredAgents.length})
            </Text>
          </>
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 80)}>
            <AgentCard
              agent={item}
              onPress={() =>
                router.push({
                  pathname: "/chat",
                  params: {
                    id: item.id,
                    agentName: item.name,
                    agentDesc: item.description,
                    initialText: item.description,
                    agentPrompt: item.description,
                  },
                })
              }
            />
          </Animated.View>
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator
              size="small"
              color="#ff4400"
              style={{ marginVertical: 20 }}
            />
          ) : null
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.skeletonGrid}>
              {Array(6)
                .fill(null)
                .map((_, i) => (
                  <SkeletonCard key={`skeleton-${i}`} />
                ))}
            </View>
          ) : searchQuery ? (
            <Text style={styles.noAgentsText}>
              No agents match "{searchQuery}"
            </Text>
          ) : (
            <Text style={styles.noAgentsText}>No public agents found.</Text>
          )
        }
      />

      <Modal visible={modalVisible} transparent animationType="none">
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <BlurView
            intensity={90}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setModalVisible(false)}
          />
          <Animated.View
            entering={FadeInDown.springify().mass(0.8)}
            style={styles.modalCard}
          >
            <Text style={styles.modalTitle}>Create New Agent</Text>
            <TextInput
              placeholder="Agent Name"
              placeholderTextColor="#999"
              style={styles.input}
              value={agentName}
              onChangeText={setAgentName}
              autoFocus
            />
            <TextInput
              placeholder="What does this agent do?"
              placeholderTextColor="#999"
              style={[styles.input, styles.textArea]}
              value={agentDesc}
              onChangeText={setAgentDesc}
              multiline
              numberOfLines={3}
            />
            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={[styles.modalBtn, styles.cancelBtn]}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleCreateAgent}
                style={[
                  styles.modalBtn,
                  styles.createBtn,
                  submitting && { opacity: 0.7 },
                ]}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.createBtnText}>Create</Text>
                )}
              </Pressable>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const AgentCard = ({ agent, onPress, isMine = false }: any) => {
  const avatarUrl = agent.avatar;
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.agentCard}
    >
      <LinearGradient
        colors={["#ffffff", "#f8f9fa"]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.cardContent}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            {avatarUrl ? (
              <Image
                source={{ uri: avatarUrl }}
                style={styles.avatarImg}
                contentFit="cover"
              />
            ) : (
              <Ionicons name="musical-note-sharp" size={32} color="#ff4400" />
            )}
          </View>
          {isMine && (
            <View style={styles.mineBadge}>
              <Ionicons name="star" size={12} color="#FFD700" />
            </View>
          )}
        </View>
        <Text style={styles.agentName} numberOfLines={1}>
          {agent.name}
        </Text>
        <Text style={styles.agentDesc} numberOfLines={2}>
          {agent.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Explore;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111",
    letterSpacing: -0.3,
  },
  fab: {
    backgroundColor: "#ff4400",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#ff4400",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  // ── Search Bar ──
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  searchIcon: { marginRight: 12 },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111",
    paddingVertical: 4,
  },
  clearBtn: { padding: 4 },

  // ── List & Grid ──
  listContent: { paddingHorizontal: 20, paddingTop: 8 },
  columnWrapper: { justifyContent: "space-between", marginBottom: CARD_GAP },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#111" },
  showAll: { fontSize: 13, color: "#ff4400", fontWeight: "600" },
  worldTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 12,
    marginTop: 24,
  },
  myAgentsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: CARD_GAP,
    marginBottom: 20,
  },
  emptyMyAgents: { padding: 20, alignItems: "center" },
  emptyText: { fontSize: 14, color: "#888", fontStyle: "italic" },

  // ── Cards ──
  agentCard: {
    width: CARD_WIDTH,
    height: 150,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#eaeaea",
  },
  cardContent: { padding: 16, flex: 1 },
  avatarWrapper: { position: "relative", marginBottom: 10 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff2e6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2.5,
    borderColor: "#fff",
    overflow: "hidden",
  },
  avatarImg: { width: "100%", height: "100%" },
  mineBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#FFD700",
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  agentName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    marginBottom: 4,
  },
  agentDesc: { fontSize: 13, color: "#666", lineHeight: 18 },

  // ── Skeleton ──
  skeletonCard: {
    width: CARD_WIDTH,
    height: 150,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: CARD_GAP,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  skeletonAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#e5e5e5",
    marginBottom: 10,
  },
  skeletonLine: {
    height: 12,
    backgroundColor: "#e5e5e5",
    borderRadius: 6,
    marginBottom: 6,
  },
  skeletonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: CARD_GAP,
    justifyContent: "space-between",
    paddingHorizontal: 0,
  },

  // ── Modal ──
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  modalBackdrop: { flex: 1 },
  modalCard: {
    marginHorizontal: 24,
    marginBottom: 34,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: "#fafafa",
    marginBottom: 12,
  },
  textArea: { height: 90, textAlignVertical: "top" },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 8,
  },
  modalBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 80,
    alignItems: "center",
  },
  cancelBtn: { backgroundColor: "#f0f0f0" },
  cancelText: { color: "#666", fontWeight: "600" },
  createBtn: { backgroundColor: "#ff4400" },
  createBtnText: { color: "#fff", fontWeight: "700" },
  noAgentsText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 14,
    color: "#888",
  },
});
