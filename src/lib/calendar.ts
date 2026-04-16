import ical, { ICalCalendarMethod } from "ical-generator";
import type { Slot, Booking } from "@/types/appointment";

export function exportToIcs(slots: Slot[], bookings: Booking[]): string {
  const calendar = ical({ name: "Appointments" });
  calendar.method(ICalCalendarMethod.PUBLISH);

  for (const booking of bookings) {
    if (booking.status === "CANCELLED" || booking.status === "REJECTED") continue;

    const slot = slots.find((s) => s.id === booking.slotId);
    if (!slot) continue;

    const [startH, startM] = slot.startTime.split(":").map(Number);
    const [endH, endM] = slot.endTime.split(":").map(Number);
    const [year, month, day] = slot.date.split("-").map(Number);

    calendar.createEvent({
      start: new Date(year, month - 1, day, startH, startM),
      end: new Date(year, month - 1, day, endH, endM),
      summary: `Appointment: ${booking.userName}`,
      description: [
        `Client: ${booking.userName}`,
        `Email: ${booking.userEmail}`,
        `Status: ${booking.status}`,
        booking.message ? `Message: ${booking.message}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    });
  }

  return calendar.toString();
}

export function downloadIcs(content: string, filename = "appointments.ics") {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

interface ParsedEvent {
  summary: string;
  start: Date;
  end: Date;
  description?: string;
}

export function parseIcs(content: string): ParsedEvent[] {
  const events: ParsedEvent[] = [];
  const lines = content.replace(/\r\n /g, "").split(/\r?\n/);

  let inEvent = false;
  let current: Partial<ParsedEvent> = {};

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      inEvent = true;
      current = {};
    } else if (line === "END:VEVENT") {
      inEvent = false;
      if (current.summary && current.start && current.end) {
        events.push(current as ParsedEvent);
      }
    } else if (inEvent) {
      const [key, ...valueParts] = line.split(":");
      const value = valueParts.join(":");
      const baseKey = key.split(";")[0];

      switch (baseKey) {
        case "SUMMARY":
          current.summary = value;
          break;
        case "DESCRIPTION":
          current.description = value.replace(/\\n/g, "\n");
          break;
        case "DTSTART":
          current.start = parseIcsDate(value);
          break;
        case "DTEND":
          current.end = parseIcsDate(value);
          break;
      }
    }
  }

  return events;
}

function parseIcsDate(value: string): Date {
  // Format: 20260415T100000Z or 20260415T100000
  const match = value.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z?$/);
  if (match) {
    const [, y, m, d, h, min, s] = match.map(Number);
    return value.endsWith("Z")
      ? new Date(Date.UTC(y, m - 1, d, h, min, s))
      : new Date(y, m - 1, d, h, min, s);
  }
  return new Date(value);
}

export function icsEventsToSlots(events: ParsedEvent[]): Omit<Slot, "id">[] {
  return events.map((event) => {
    const start = event.start;
    const end = event.end;
    const duration = Math.round((end.getTime() - start.getTime()) / 60000);

    return {
      date: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-${String(start.getDate()).padStart(2, "0")}`,
      startTime: `${String(start.getHours()).padStart(2, "0")}:${String(start.getMinutes()).padStart(2, "0")}`,
      endTime: `${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}`,
      duration,
      isBooked: false,
      createdBy: "import",
    };
  });
}
