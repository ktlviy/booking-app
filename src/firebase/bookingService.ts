import {
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import type {
  AddUserToRoom,
  CancelBooking,
  CreateBooking,
  UpdateBooking,
} from "../types";
import { db } from "./firebase";

export const createBooking: CreateBooking = async (input) => {
  try {
    const {
      roomId,
      userId,
      email,
      startDate,
      endDate,
      description = "",
    } = input;

    // Convert string dates to Timestamps
    const startTime = Timestamp.fromDate(new Date(startDate));
    const endTime = Timestamp.fromDate(new Date(endDate));

    // Validate time
    if (startTime.toDate() >= endTime.toDate()) {
      throw new Error("End time must be after start time");
    }

    // Check for time conflicts
    const bookingsQuery = query(
      collection(db, "bookings"),
      where("roomId", "==", roomId),
      where("startTime", "<", endTime),
      where("endTime", ">", startTime)
    );
    console.log("Checking for overlapping bookings:", {
      roomId,
      startTime,
      endTime,
    });
    const existingBookings = await getDocs(bookingsQuery);
    if (!existingBookings.empty) {
      throw new Error("Time conflict detected");
    }

    // Create booking document
    const bookingRef = doc(collection(db, "bookings"));
    await setDoc(bookingRef, {
      roomId,
      userId,
      startTime,
      endTime,
      description,
      participants: [email.toLowerCase()],
    });
    console.log(`Booking created with ID: ${bookingRef.id}`);
    return bookingRef.id;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

export const updateBooking: UpdateBooking = async (bookingId, updates) => {
  try {
    const bookingRef = doc(db, "bookings", bookingId);
    const formattedUpdates: any = { ...updates };

    // Convert date strings to Timestamps if provided
    if (updates.startDate) {
      formattedUpdates.startTime = Timestamp.fromDate(
        new Date(updates.startDate)
      );
      delete formattedUpdates.startDate;
    }
    if (updates.endDate) {
      formattedUpdates.endTime = Timestamp.fromDate(new Date(updates.endDate));
      delete formattedUpdates.endDate;
    }

    await updateDoc(bookingRef, formattedUpdates);
  } catch (error) {
    console.error("Error updating booking:", error);
    throw error;
  }
};

export const cancelBooking: CancelBooking = async (bookingId) => {
  try {
    await deleteDoc(doc(db, "bookings", bookingId));
  } catch (error) {
    console.error("Error canceling booking:", error);
    throw error;
  }
};

export const addUserToRoom: AddUserToRoom = async (roomId, email) => {
  try {
    // Find user by email
    const usersQuery = query(
      collection(db, "users"),
      where("email", "==", email)
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
