import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    ListRenderItem,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// ✅ Define message type
type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
};

const initialMessages: Message[] = [
  { id: '1', role: 'user', text: 'Hiii! How are you?' },
  { id: '2', role: 'assistant', text: 'I am good! How can I help you today?' },
  { id: '3', role: 'user', text: 'Tell me a joke 😄' },
  { id: '4', role: 'assistant', text: 'Why did the math book look sad? Because it had too many problems.' },
  { id: '5', role: 'user', text: 'Haha that was funny 😂' },
  { id: '6', role: 'assistant', text: 'Glad you liked it! Want another one?' },
  { id: '7', role: 'user', text: 'Sure! Hit me with your best one.' },
  { id: '8', role: 'assistant', text: 'Why can’t your nose be 12 inches long? Because then it would be a foot!' },
  { id: '9', role: 'user', text: 'That’s actually clever 😄' },
  { id: '10', role: 'assistant', text: 'Thanks! I’ve got plenty more where that came from.' },
  { id: '11', role: 'user', text: 'Okay, but can you tell me something motivational?' },
  { id: '12', role: 'assistant', text: 'Every day is a new chance to become a better version of yourself.' },
  { id: '13', role: 'user', text: 'That’s nice. I needed that today.' },
  { id: '14', role: 'assistant', text: 'I’m happy to hear that 😊 Always here to cheer you up.' },
  { id: '15', role: 'user', text: 'What’s your favorite color?' },
  { id: '16', role: 'assistant', text: 'I’d say orange — it’s bright and creative! What about you?' },
  { id: '17', role: 'user', text: 'Mine’s blue. It’s calm and peaceful.' },
  { id: '18', role: 'assistant', text: 'A perfect choice! Blue gives off serene vibes.' },
  { id: '19', role: 'user', text: 'You sound like a color psychologist 😂' },
  { id: '20', role: 'assistant', text: 'Haha maybe I am! I’ve got shades of wisdom all over me 🎨' },
];

const ChatSection: React.FC = () => {
  const navigation = useNavigation<any>(); // 👈 you can type your stack params if you have them
  const { agentName } = useLocalSearchParams<{ agentName?: string }>();

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      title: agentName || 'Chat',
      headerRight: () => (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => console.log('Add new chat')}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={22} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, agentName]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input.trim(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage: ListRenderItem<Message> = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.role === 'user' ? styles.userBubble : styles.assistantBubble,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          item.role === 'user' ? styles.userText : styles.assistantText,
        ]}
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 20}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatContainer}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />

      <View style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={input}
            onChangeText={setInput}
            placeholderTextColor="#999"
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            activeOpacity={0.7}
          >
            <Ionicons name="send" size={20} color="#fff" />
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
    backgroundColor: '#fafafa',
  },
  chatContainer: {
    padding: 12,
    paddingBottom: 100,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
  userBubble: {
    backgroundColor: '#ff4400',
    alignSelf: 'flex-end',
  },
  assistantBubble: {
    backgroundColor: '#E6E6E6',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userText: {
    color: '#fff',
  },
  assistantText: {
    color: '#222',
  },
  iconButton: {
    marginRight: 14,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputWrapper: {
    paddingHorizontal: 10,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    backgroundColor: 'transparent',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingVertical: 6,
    paddingHorizontal: 10,
    shadowColor: '#000',
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
    backgroundColor: '#f4f4f4',
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#ff4400',
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
