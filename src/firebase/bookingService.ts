import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
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

    // Add booking ID to user's bookings array
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      bookings: arrayUnion(bookingRef.id),
    });

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
    // 1. Get the booking document
    const bookingRef = doc(db, "bookings", bookingId);
    const bookingSnap = await getDoc(bookingRef);

    if (!bookingSnap.exists()) {
      throw new Error("Booking not found");
    }

    const bookingData = bookingSnap.data();
    const participants: string[] = bookingData.participants || [];

    // 2. For each participant email, remove bookingId from their user doc
    for (const email of participants) {
      const usersQuery = query(
        collection(db, "users"),
        where("email", "==", email)
      );
      const userSnap = await getDocs(usersQuery);
      userSnap.forEach(async (userDoc) => {
        const userRef = doc(db, "users", userDoc.id);
        await updateDoc(userRef, {
          bookings: arrayRemove(bookingId),
        });
      });
    }

    // 3. Delete the booking document
    await deleteDoc(bookingRef);
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
