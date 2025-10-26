import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={process.env.CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </ClerkProvider>
  );
}
