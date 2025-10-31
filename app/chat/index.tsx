import { firestoreDB } from "@/config/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  FlatList,
  KeyboardAvoidingView,
  ListRenderItem,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AIChatModel } from "../shared/GlobalApi";

type Message = {
  role: string;
  content: string;
};

const TypingIndicator = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDot = (dot: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot, {
            toValue: -4,
            duration: 250,
            delay,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 250,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateDot(dot1, 0);
    animateDot(dot2, 150);
    animateDot(dot3, 300);
  }, []);

  return (
    <View style={styles.typingContainer}>
      <Animated.View style={[styles.dot, { transform: [{ translateY: dot1 }] }]} />
      <Animated.View style={[styles.dot, { transform: [{ translateY: dot2 }] }]} />
      <Animated.View style={[styles.dot, { transform: [{ translateY: dot3 }] }]} />
    </View>
  );
};

const ChatSection: React.FC = () => {
  const navigation = useNavigation<any>();
  const { agentName, agentPrompt } = useLocalSearchParams<{
    agentName?: string;
    agentPrompt?: string;
  }>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [systemPrompt, setSystemPrompt] = useState<string>("");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList<Message>>(null);
  const [docId, setDocId] = useState<string>("");
  const { user } = useUser();
  const router = useRouter();



  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      title: agentName || "Chat",
      headerRight: () => (
    <TouchableOpacity
  style={styles.iconButton}
  onPress={() =>
    router.push({
      pathname: '/voiceroom',
    })
  }
  activeOpacity={0.7}
>
  <Ionicons name="mic-outline" size={22} color="#000" />
</TouchableOpacity>

      ),
    });
  }, [navigation, agentName]);

  useEffect(() => {
    if (!user?.primaryEmailAddress?.emailAddress || !agentName) return;
    const userEmail = user.primaryEmailAddress.emailAddress;

    const fetchOrCreateChat = async () => {
      try {
        const chatsRef = collection(firestoreDB, "chats");
        const q = query(
          chatsRef,
          where("userEmail", "==", userEmail),
          where("agentName", "==", agentName)
        );
        const querySnap = await getDocs(q);

        if (!querySnap.empty) {
          // ✅ Existing chat found
          const existingChat = querySnap.docs[0];
          const data = existingChat.data();
          setDocId(existingChat.id);
          if (Array.isArray(data.messages)) {
            setMessages(data.messages);
          }
          console.log("✅ Loaded existing chat:", existingChat.id);
        } else {
          // 🆕 No existing chat — create new
          const newDocId = Date.now().toString();
          setDocId(newDocId);
          setSystemPrompt(agentPrompt || "");
          await getInitialMessage(agentPrompt || "");
          console.log("🆕 Created new chat:", newDocId);
        }
      } catch (err) {
        console.error("Error loading chat:", err);
      }
    };

    fetchOrCreateChat();
  }, [user, agentName, agentPrompt]);

  const getInitialMessage = async (prompt: string) => {
    if (!prompt) return;
    try {
      setIsLoading(true);
      const result = await AIChatModel([
        { role: "system", content: prompt },
        { role: "user", content: "Hello, start by introducing yourself." },
      ]);
      if (result) {
        setMessages([result]);
      }
    } catch (error) {
      console.error("Error getting initial message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const newMessage: Message = {
      role: "user",
      content: input.trim(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
      setIsLoading(true);
      const messagesToSend = [
        { role: "system", content: systemPrompt },
        ...messages,
        newMessage,
      ];
      const result = await AIChatModel(messagesToSend);
      if (result) {
        setMessages((prev) => [...prev, result]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  useEffect(() => {
    if (!docId || !user?.primaryEmailAddress?.emailAddress) return;

    const saveMessages = async () => {
      if (messages.length > 0) {
        try {
          await setDoc(
            doc(firestoreDB, "chats", docId),
            {
              userEmail: user?.primaryEmailAddress?.emailAddress,
              messages,
              agentName,
              createdAt: new Date().toISOString(),
              docId,
            },
            { merge: true }
          );
          console.log("💾 Messages saved to Firestore:", docId);
        } catch (error) {
          console.error("Error saving messages:", error);
        }
      }
    };
    saveMessages();
  }, [messages]);

  const displayMessages = messages.filter((msg) => msg.role !== "system");

  const renderMessage: ListRenderItem<Message> = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.role === "user" ? styles.userBubble : styles.assistantBubble,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          item.role === "user" ? styles.userText : styles.assistantText,
        ]}
      >
        {item.content}
      </Text>
    </View>
  );

  return (
    
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 20}
    >
      <FlatList
        ref={flatListRef}
        data={displayMessages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatContainer}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        ListFooterComponent={isLoading ? <TypingIndicator /> : null}
      />

      <View style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={input}
            onChangeText={setInput}
            placeholderTextColor="#999"
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
            onPress={handleSend}
            activeOpacity={0.7}
            disabled={isLoading}
          >
            <Ionicons
              name={isLoading ? "hourglass" : "send"}
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatSection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  chatContainer: {
    padding: 12,
    paddingBottom: 100,
  },
  messageBubble: {
    maxWidth: "75%",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
  userBubble: {
    backgroundColor: "#ff4400",
    alignSelf: "flex-end",
  },
  assistantBubble: {
    backgroundColor: "#E6E6E6",
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userText: {
    color: "#fff",
  },
  assistantText: {
    color: "#222",
  },
  iconButton: {
    marginRight: 14,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  inputWrapper: {
    paddingHorizontal: 10,
    paddingBottom: Platform.OS === "ios" ? 25 : 10,
    backgroundColor: "transparent",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingVertical: 6,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#f4f4f4",
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: "#ff4400",
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#ffaa99",
  },
  typingContainer: {
    flexDirection: "row",
    alignSelf: "flex-start",
    backgroundColor: "#E6E6E6",
    borderRadius: 16,
    padding: 10,
    marginTop: 4,
    marginBottom: 12,
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: "#888",
    borderRadius: 4,
    marginHorizontal: 3,
  },
});
