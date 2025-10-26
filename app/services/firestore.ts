import { firestoreDB } from "@/config/FirebaseConfig";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

export type UserData = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  credits?: number;
};

// Save new user to Firestore
export const saveNewUser = async (user: UserData) => {
  try {
    const userRef = doc(firestoreDB, "users", user.id); 
    await setDoc(userRef, {
      email: user.email,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      joinedAt: serverTimestamp(),
      credits: user.credits ?? 20,
    }, { merge: true });

    console.log("✅ User saved to Firestore");
  } catch (err) {
    console.error("❌ Firestore error:", err);
  }
};
