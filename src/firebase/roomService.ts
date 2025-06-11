import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "./firebase";
import type { CreateRoom, DeleteRoom, UpdateRoom } from "../types";

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

export const addUserToBooking = async (
  bookingId: string,
  participantEmail: string
) => {
  try {
    // Get the booking document
    const bookingRef = doc(db, "bookings", bookingId);

    // Add the new participant by email
    await updateDoc(bookingRef, {
      participants: arrayUnion(participantEmail),
    });
  } catch (error) {
    console.error("Error adding participant to booking:", error);
    throw error;
  }
};
