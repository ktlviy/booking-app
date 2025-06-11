import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  getDocs,
  where,
  query,
  arrayUnion,
} from "firebase/firestore";
import { db } from "./firebase";
import type {
  AddUserToRoom,
  CreateRoom,
  DeleteRoom,
  UpdateRoom,
} from "../types";

export const createRoom: CreateRoom = async (
  name,
  description,
  imageUrl,
  userId
) => {
  try {
    const roomRef = await addDoc(collection(db, "rooms"), {
      name,
      description,
      imageUrl,
      createdBy: userId,
      members: [{ userId, role: "admin" }],
    });
    return roomRef.id;
  } catch (error) {
    console.error("Error creating room:", error);
    throw error;
  }
};

export const updateRoom: UpdateRoom = async (roomId, updates) => {
  try {
    const roomRef = doc(db, "rooms", roomId);
    await updateDoc(roomRef, updates);
  } catch (error) {
    console.error("Error updating room:", error);
    throw error;
  }
};

export const deleteRoom: DeleteRoom = async (roomId) => {
  try {
    await deleteDoc(doc(db, "rooms", roomId));
  } catch (error) {
    console.error("Error deleting room:", error);
    throw error;
  }
};

export const addUserToRoom: AddUserToRoom = async (roomId, email) => {
  try {
    const usersQuery = query(
      collection(db, "users"),
      where("email", "==", email.toLowerCase())
    );
    const userSnapshot = await getDocs(usersQuery);

    if (userSnapshot.empty) {
      throw new Error("User not found");
    }

    const userDoc = userSnapshot.docs[0];
    const userId = userDoc.id;
    const userRole = userDoc.data().role || "user";

    const roomRef = doc(db, "rooms", roomId);
    await updateDoc(roomRef, {
      members: arrayUnion({ userId, role: userRole }),
    });
  } catch (error) {
    console.error("Error adding user to room:", error);
    throw error;
  }
};
