import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Reflection = () => {
  const { transcript } = useLocalSearchParams<{ transcript?: string }>();
  const [reflection, setReflection] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!transcript) return;
    setTimeout(() => {
      const text = transcript.toLowerCase();
      if (text.includes("art") || text.includes("design") || text.includes("creative")) {
        setReflection("You seem imaginative and expressive.");
      } else if (
        text.includes("travel") ||
        text.includes("explore") ||
        text.includes("new experiences")
      ) {
        setReflection("You seem adventurous and open-minded.");
      } else {
        setReflection("You seem thoughtful and grounded.");
      }
      setLoading(false);
    }, 2000);
  }, [transcript]);

  return (
    <View style={styles.container}>
      {loading ? (
        <>
          <ActivityIndicator size="large" color="#ff4400" />
          <Text style={styles.loadingText}>Reflecting on your story...</Text>
        </>
      ) : (
        <>
          <Text style={styles.resultText}>{reflection}</Text>
          <TouchableOpacity
            style={styles.finishButton}
            onPress={() => router.back()}
          >
            <Text style={styles.finishText}>Finish</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default Reflection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fafafa",
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  resultText: {
    fontSize: 20,
    color: "#222",
    textAlign: "center",
    marginBottom: 32,
  },
  finishButton: {
    backgroundColor: "#ff4400",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  finishText: {
    color: "#fff",
    fontSize: 16,
  },
});
