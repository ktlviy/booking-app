import { Timestamp } from "firebase/firestore";

export interface Booking {
  roomId: string;
  userId: string;
  startTime: Timestamp;
  endTime: Timestamp;
  description: string;
}

export type CreateBookingInput = {
  roomId: string;
  userId: string;
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
