export type BookingStatus = "PENDING" | "CONFIRMED" | "REJECTED" | "CANCELLED";

export interface Slot {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  duration: number; // minutes
  isBooked: boolean;
  createdBy: string;
}

export interface Booking {
  id: string;
  slotId: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: BookingStatus;
  message?: string;
  createdAt: string; // ISO string
}
