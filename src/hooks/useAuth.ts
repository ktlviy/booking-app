import { useState, useEffect } from "react";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";

interface AuthState {
  user: User | null;
  role: string | null;
  loading: boolean;
}

export const useAuth = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        setRole(userDoc.exists() ? userDoc.data().role : null);
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { user, role, loading };
};
