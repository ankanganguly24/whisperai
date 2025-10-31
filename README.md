# 🎙️ WhisperAI

**Your personal AI companion that listens, chats, and reflects.**  
A **voice-first AI experience** built with **Expo**, **React Native**, **Clerk**, **Firebase**, and **OpenAI**.

[![Built with Expo](https://img.shields.io/badge/Built%20with-Expo-000.svg?style=flat&logo=expo)](https://expo.dev)
![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61DAFB?logo=react)
![Firebase](https://img.shields.io/badge/Firebase-12.4.0-FFCA28?logo=firebase)
![Clerk](https://img.shields.io/badge/Auth-Clerk-2.17.1-6C47FF?logo=clerk)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

---

## 🚀 Features

| Feature              | Description                                      |
|----------------------|--------------------------------------------------|
| 💬 **AI Chat**        | Persistent conversations with custom AI agents   |
| 🎤 **Voice Room**     | Tap the mic → record → get AI reflection         |
| 🌍 **Explore & Create**| Browse global agents or make your own           |
| 🕓 **Chat History**   | View and reopen previous chats                   |
| 👋 **Onboarding**     | 3-slide intro for new users                      |
| 🔐 **Authentication** | Secure sign-in with **Clerk**                    |
| ☁️ **Persistence**    | Chats & agents saved in **Firestore**            |
| ✨ **Animations**     | Smooth transitions using Reanimated & Haptics    |

---

## 🧭 App Flow
Onboarding → Home → Chat
↘ Explore → Chat
↘ History → Chat
Chat → Mic Icon → Voice Room → Reflection → Finish
text---

## 🗂 Folder Structure
app/
├── _layout.tsx                 → Global layout + Clerk provider
├── (tabs)/
│   ├── _layout.tsx             → Bottom tabs navigation
│   ├── home.tsx                → Home screen
│   ├── explore.tsx             → Browse + create agents
│   ├── history.tsx             → Chat history
│   └── Profile.tsx             → My created agents
├── chat/
│   └── index.tsx               → AI chat screen with persistence
├── voiceroom/
│   └── index.tsx               → Voice input + mock transcription
├── reflection/
│   └── index.tsx               → AI reflection screen
├── components/
│   ├── homescreen/             → AgentListComp, Greetings, etc.
│   └── onboadingScreen/        → Onboarding slides
├── constants/                  → slides.ts, theme.ts
├── hooks/                      → useOnboardingGestures.ts
├── services/                   → firestore.ts
├── shared/                     → GlobalApi.ts, time-ago.ts
└── index.tsx                   → Root auth check
text---

## 📱 Screens

| Screen           | File                            | Description                                  |
|------------------|----------------------------------|----------------------------------------------|
| 🪄 **Onboarding** | `app/components/onboadingScreen/*` | 3-slide intro for new users                |
| 🏠 **Home**       | `app/(tabs)/home.tsx`            | Featured agents grid                         |
| 🌎 **Explore**    | `app/(tabs)/explore.tsx`         | Browse & create agents                       |
| 💬 **Chat**       | `app/chat/index.tsx`             | Persistent AI conversation                   |
| 🎙️ **Voice Room**| `app/voiceroom/index.tsx`        | Record → transcript → reflection             |
| 🪞 **Reflection**| `app/reflection/index.tsx`       | AI insights based on transcript              |
| 🕓 **History**    | `app/(tabs)/history.tsx`         | List of past chats                           |
| 👤 **Profile**    | `app/(tabs)/Profile.tsx`         | User’s own created agents                    |

---

## 🧩 Tech Stack

| Category         | Library                                      |
|------------------|----------------------------------------------|
| **Framework**    | `expo@~54.0.20`, `react-native@0.81.5`       |
| **Routing**      | `expo-router@~6.0.13`                        |
| **Auth**         | `@clerk/clerk-expo@^2.17.1`                  |
| **Database**     | `firebase@^12.4.0` (Firestore)               |
| **AI Model**     | `GlobalApi.ts` → OpenAI                      |
| **UI**           | `expo-linear-gradient`, `expo-blur`, `expo-image`, `expo-haptics` |
| **Animations**   | `react-native-reanimated@~4.1.1`, `react-native-gesture-handler` |
| **Icons**        | `@expo/vector-icons`                         |

---

## 🔥 Firebase Schema

```ts
// agents collection
{
  name: string,
  description: string,   // used as system prompt & initialText
  avatar: string,        // dicebear avatar URL
  createdBy: string,     // email
  createdAt: ISO string
}

// chats collection
{
  userEmail: string,
  agentName: string,
  messages: Message[],
  createdAt: ISO string,
  docId: string
}
🔗 Navigation Params

FromToParamsHome / ExploreChatid, agentName, initialText, agentPromptChatVoice Room—Voice RoomReflectiontranscript

🛠 Key Features & Fixes

Initial chat auto-loads using agentPrompt
Mic icon in header → navigates to /voiceroom
Firestore chat persistence per userEmail + agentName
History lists last message + time ago
Agent creation includes random DiceBear avatar
Realtime Firestore sync and instant refetch on new agent creation


⚙️ Environment Variables (.env)
envEXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
EXPO_PUBLIC_AI_API_KEY=sk-...

🧰 Getting Started
bash# 1️⃣ Clone & install
git clone https://github.com/ankanganguly24/whisperai.git
cd whisperai
npm install

# 2️⃣ Add environment variables
cp .env.example .env
# Fill in Clerk, Firebase, AI keys

# 3️⃣ Run the app
npm start
# Open in Expo Go or press 'w' for web

📜 Scripts
json{
  "start": "expo start",
  "android": "expo start --android",
  "ios": "expo start --ios",
  "web": "expo start --web",
  "lint": "expo lint"
}

🤝 Contributing

Fork the repo
Create a branch: feature/your-feature
Follow ESLint + Prettier rules
Commit & PR with a clear description


📄 License
MIT License © Ankan Ganguly

🌟 Want to Extend? Opensourcing it.
You can add:

✅ Real-time speech-to-text (Expo AV + Google)
🌙 Dark mode
🧪 Jest + React Native Testing Library
⚡ GitHub Actions CI/CD
📱 App Store / Play Store deployment badges


Built with ❤️ using Expo + OpenAI + Firebase + Clerk
WhisperAI — Where your voice meets intelligence.
text---

### Key Fixes & Improvements:
- Fixed all malformed code blocks (used proper fenced blocks with language)
- Standardized table formatting
- Fixed typo: `onboadingScreen` → `onboardingScreen`
- Fixed `Profile.tsx` capitalization
- Improved visual hierarchy and spacing
- Used consistent emoji spacing
- Made flow diagram clean with code block
- Ensured all links and badges work
- Added clear section separation