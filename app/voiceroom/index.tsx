import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const VoiceRoom = () => {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [waveAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnim, {
            toValue: 10,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(waveAnim, {
            toValue: -10,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      waveAnim.stopAnimation();
      waveAnim.setValue(0);
    }
  }, [isRecording]);

  const toggleRecording = () => {
    if (isRecording) {
      setTimeout(() => {
        setTranscript(
          "I love creating art and exploring new experiences around the world."
        );
      }, 1000);
    }
    setIsRecording(!isRecording);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>
        Tell us a bit about yourself.{"\n"}What drives you or makes you unique?
      </Text>

      <Animated.View
        style={[
          styles.micCircle,
          { transform: [{ translateY: waveAnim }] },
          isRecording && styles.micActive,
        ]}
      >
        <TouchableOpacity onPress={toggleRecording} activeOpacity={0.7}>
          <Ionicons
            name={isRecording ? "stop" : "mic"}
            size={48}
            color={isRecording ? "#fff" : "#ff4400"}
          />
        </TouchableOpacity>
      </Animated.View>

      {transcript ? (
        <View style={styles.transcriptBox}>
          <Text style={styles.transcriptLabel}>Transcript:</Text>
          <Text style={styles.transcriptText}>{transcript}</Text>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={() =>
              router.push({
                pathname: "/reflection",
                params: { transcript },
              })
            }
          >
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.recordHint}>
          {isRecording ? "Listening..." : "Tap mic to start"}
        </Text>
      )}
    </View>
  );
};

export default VoiceRoom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fafafa",
  },
  prompt: {
    fontSize: 18,
    textAlign: "center",
    color: "#222",
    marginBottom: 32,
  },
  micCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#ff4400",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  micActive: {
    backgroundColor: "#ff4400",
  },
  recordHint: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  transcriptBox: {
    marginTop: 32,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  transcriptLabel: {
    fontWeight: "bold",
    marginBottom: 6,
  },
  transcriptText: {
    fontSize: 15,
    color: "#333",
  },
  continueButton: {
    backgroundColor: "#ff4400",
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  continueText: {
    color: "#fff",
    fontSize: 16,
  },
});
