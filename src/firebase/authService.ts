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
      name: name.trim(),
      email: email.trim(),
      role: role,
    });

    return { success: true, data: user };
  } catch (error) {
    const authError = error as AuthError;
    let errorMessage = "Registration failed.";
    switch (authError.code) {
      case "auth/email-already-in-use":
        errorMessage = "Email already registered.";
        break;
      case "auth/invalid-email":
        errorMessage = "Invalid email format.";
        break;
      case "auth/weak-password":
        errorMessage = "Password is too weak.";
        break;
      case "permission-denied":
        errorMessage = "Insufficient permissions to save user data.";
        break;
    }
    console.error("Error registering user:", authError);
    return { success: false, error: errorMessage };
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
