import { doc, setDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type AuthError,
} from "firebase/auth";
import { auth, db } from "./firebase";
import type { AuthProps, RegisterProps } from "../types";

interface Response {
  success: boolean;
  data?: any;
  error?: string;
}

export async function registerUser({
  name,
  email,
  password,
  role,
}: RegisterProps): Promise<Response> {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      role,
    });
    return { success: true };
  } catch (error: any) {
    console.error("Error registering user:", error);
    return { success: false, error: error.message };
  }
}

export async function loginUser({
  email,
  password,
}: AuthProps): Promise<Response> {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { success: true, data: userCredential.user };
  } catch (error) {
    const authError = error as AuthError;
    let errorMessage = "Login failed.";
    switch (authError.code) {
      case "auth/user-not-found":
      case "auth/wrong-password":
        errorMessage = "Invalid email or password.";
        break;
      case "auth/invalid-email":
        errorMessage = "Invalid email format.";
        break;
      case "auth/too-many-requests":
        errorMessage = "Too many attempts. Please try again later.";
        break;
    }
    console.error("Error logging in:", authError);
    return { success: false, error: errorMessage };
  }
}

export async function logoutUser(): Promise<Response> {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Error logging out:", error);
    return { success: false, error: "Failed to log out." };
  }
}
