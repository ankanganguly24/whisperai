import { useAuth, useSSO, useUser } from "@clerk/clerk-expo";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, Platform, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { Footer } from "./components/onboadingScreen/Footer";
import { SlidesContainer } from "./components/onboadingScreen/SlidesContainer";
import {
  ONBOARDING_SLIDES,
  SLIDE_ANIMATION_DURATION,
} from "./constants/slides";
import { saveNewUser } from "./services/firestore";

const { width } = Dimensions.get("window");

export const useWarmUpBrowser = () => {
  useEffect(() => {
    if (Platform.OS !== "android") return;
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function OnboardingScreen() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const progress = useSharedValue(0);
  const { isSignedIn } = useAuth();
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  useWarmUpBrowser();

  useEffect(() => {
    if (isSignedIn) {
      router.replace("/(tabs)/home");
    }
  }, [isSignedIn]);

  const goToSlide = useCallback(
    (index: number) => {
      const constrainedIndex = Math.max(
        0,
        Math.min(index, ONBOARDING_SLIDES.length - 1)
      );
      setCurrentSlideIndex(constrainedIndex);
      progress.value = withTiming(constrainedIndex, {
        duration: SLIDE_ANIMATION_DURATION,
      });
    },
    [progress]
  );

  const handlePrevious = useCallback(() => {
    goToSlide(currentSlideIndex - 1);
  }, [currentSlideIndex, goToSlide]);

  const handleNext = useCallback(() => {
    goToSlide(currentSlideIndex + 1);
  }, [currentSlideIndex, goToSlide]);

  const handleGetStarted = useCallback(async () => {
    try {
      setLoading(true);

      const redirectUrl = AuthSession.makeRedirectUri({
        scheme: "whisperai",
      });

      console.log("Redirect URL:", redirectUrl);

      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl,
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        console.log("✅ Google login successful");

        if (user) {
          await saveNewUser({
            id: user.id,
            email: user.emailAddresses[0]?.emailAddress || "",
            firstName: user.firstName || "",
            lastName: user.lastName || "",
          });
        }

        router.replace("/(tabs)/home");
      } else {
        console.warn("⚠️ No session created, user may have cancelled sign-in");
      }
    } catch (err) {
      console.error("❌ Google SSO Error:", JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  }, [startSSOFlow, router]);

  const isLastSlide = currentSlideIndex === ONBOARDING_SLIDES.length - 1;

  const gesture = Gesture.Pan().onUpdate((e) => {
    const newIndex = currentSlideIndex - Math.round(e.translationX / width);
    const constrainedIndex = Math.max(
      0,
      Math.min(newIndex, ONBOARDING_SLIDES.length - 1)
    );
    if (constrainedIndex !== currentSlideIndex) {
      setCurrentSlideIndex(constrainedIndex);
      progress.value = constrainedIndex;
    }
  });

  return (
    <View style={[styles.container, { backgroundColor: "#fff" }]}>
      <GestureHandlerRootView style={styles.gestureRoot}>
        <GestureDetector gesture={gesture}>
          <View style={styles.wrapper}>
            <SlidesContainer
              progress={progress}
              slides={ONBOARDING_SLIDES}
              currentSlide={currentSlideIndex}
            />
            <Footer
              progress={progress}
              totalSlides={ONBOARDING_SLIDES.length}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onGetStarted={handleGetStarted}
              isLastSlide={isLastSlide}
            />
          </View>
        </GestureDetector>
      </GestureHandlerRootView>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
  } as const,
  gestureRoot: {
    flex: 1,
  } as const,
  wrapper: {
    flex: 1,
  } as const,
};
