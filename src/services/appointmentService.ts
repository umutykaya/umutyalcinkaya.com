import type { Slot, Booking, BookingStatus } from "@/types/appointment";

// TODO: Replace localStorage with AppSync when Amplify API is configured:
// import { generateClient } from 'aws-amplify/api';
// const client = generateClient();

const SLOTS_KEY = "app_slots";
const BOOKINGS_KEY = "app_bookings";

function getStored<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function setStored<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

// --- Slot Operations ---

export async function listAllSlots(): Promise<Slot[]> {
  return getStored<Slot>(SLOTS_KEY);
}

export async function listAvailableSlots(): Promise<Slot[]> {
  return getStored<Slot>(SLOTS_KEY).filter((s) => !s.isBooked);
}

export async function getSlot(id: string): Promise<Slot | undefined> {
  return getStored<Slot>(SLOTS_KEY).find((s) => s.id === id);
}

export async function createSlot(slot: Omit<Slot, "id">): Promise<Slot> {
  const slots = getStored<Slot>(SLOTS_KEY);
  const newSlot: Slot = { ...slot, id: crypto.randomUUID() };
  slots.push(newSlot);
  setStored(SLOTS_KEY, slots);
  return newSlot;
}

export async function updateSlot(id: string, updates: Partial<Slot>): Promise<Slot> {
  const slots = getStored<Slot>(SLOTS_KEY);
  const index = slots.findIndex((s) => s.id === id);
  if (index === -1) throw new Error("Slot not found");
  slots[index] = { ...slots[index], ...updates };
  setStored(SLOTS_KEY, slots);
  return slots[index];
}

export async function deleteSlot(id: string): Promise<void> {
  const slots = getStored<Slot>(SLOTS_KEY).filter((s) => s.id !== id);
  setStored(SLOTS_KEY, slots);
}

// --- Booking Operations ---

export async function listAllBookings(): Promise<Booking[]> {
  return getStored<Booking>(BOOKINGS_KEY);
}

export async function listUserBookings(userId: string): Promise<Booking[]> {
  return getStored<Booking>(BOOKINGS_KEY).filter((b) => b.userId === userId);
}

export async function createBooking(
  booking: Omit<Booking, "id" | "createdAt">
): Promise<Booking> {
  const bookings = getStored<Booking>(BOOKINGS_KEY);
  const newBooking: Booking = {
    ...booking,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  bookings.push(newBooking);
  setStored(BOOKINGS_KEY, bookings);

  // Mark slot as booked
  await updateSlot(booking.slotId, { isBooked: true });

  return newBooking;
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus
): Promise<Booking> {
  const bookings = getStored<Booking>(BOOKINGS_KEY);
  const index = bookings.findIndex((b) => b.id === id);
  if (index === -1) throw new Error("Booking not found");
  bookings[index] = { ...bookings[index], status };
  setStored(BOOKINGS_KEY, bookings);

  // If rejected or cancelled, free up the slot
  if (status === "REJECTED" || status === "CANCELLED") {
    await updateSlot(bookings[index].slotId, { isBooked: false });
  }

  return bookings[index];
}
