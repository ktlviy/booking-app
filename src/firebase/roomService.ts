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
  getDoc,
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

export const addUserToRoom: AddUserToRoom = async (
  roomId,
  email,
  requesterId
) => {
  try {
    // Validate requester
    if (!requesterId) {
      throw new Error("Requester ID is required");
    }

    // Get requester's user document
    const requesterDocRef = doc(db, "users", requesterId);
    const requesterDoc = await getDoc(requesterDocRef);
    if (!requesterDoc.exists()) {
      throw new Error("Requester not found");
    }
    const requesterData = requesterDoc.data();
    const isAdmin = requesterData.role === "admin";
    const requesterEmail = requesterData.email.toLowerCase();

    // Check if requester is a participant in any booking for the room (if not admin)
    let isParticipant = false;
    if (!isAdmin) {
      const bookingsQuery = query(
        collection(db, "bookings"),
        where("roomId", "==", roomId)
      );
      const bookingsSnapshot = await getDocs(bookingsQuery);
      bookingsSnapshot.forEach((doc) => {
        const participants = doc.data().participants || [];
        if (participants.includes(requesterEmail)) {
          isParticipant = true;
        }
      });
    }

    // Verify authorization
    if (!isAdmin && !isParticipant) {
      throw new Error(
        "You must be an admin or a meeting participant to add users to this room"
      );
    }

    // Find user to add by email
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

    // Add user to room's members
    const roomRef = doc(db, "rooms", roomId);
    await updateDoc(roomRef, {
      members: arrayUnion({ userId, role: userRole }),
    });

    console.log(`User ${email} added to room ${roomId}`);
  } catch (error) {
    console.error("Error adding user to room:", error);
    throw error;
  }
};
