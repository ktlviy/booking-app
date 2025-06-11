import { Timestamp } from "firebase/firestore";

export interface Booking {
  id: string;
  roomId: string;
  userId: string;
  startTime: Timestamp; // Use Timestamp for Firestore or string for ISO date
  endTime: Timestamp; // Use Timestamp for Firestore or string for ISO date
  description: string;
}

export type CreateBookingInput = {
  roomId: string;
  userId: string;
  email: string;
  startDate: string;
  endDate: string;
  description?: string;
};

export type CreateBooking = (input: CreateBookingInput) => Promise<string>;

export type UpdateBooking = (
  bookingId: string,
  updates: Partial<CreateBookingInput>
) => Promise<void>;

export type CancelBooking = (bookingId: string) => Promise<void>;
