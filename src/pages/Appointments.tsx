import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { listAvailableSlots, createBooking } from "@/services/appointmentService";
import SlotCalendar from "@/components/appointments/SlotCalendar";
import BookingForm from "@/components/appointments/BookingForm";
import type { Slot } from "@/types/appointment";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const Appointments = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  useEffect(() => {
    listAvailableSlots().then(setSlots);
  }, []);

  const handleBook = async (message: string) => {
    if (!user || !selectedSlot) return;
    try {
      await createBooking({
        slotId: selectedSlot.id,
        userId: user.username,
        userName: user.name || user.username,
        userEmail: user.email,
        status: "PENDING",
        message: message || undefined,
      });
      toast.success(t("appointments.bookedSuccess"));
      setSelectedSlot(null);
      const updated = await listAvailableSlots();
      setSlots(updated);
    } catch {
      toast.error(t("appointments.bookingError"));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <p className="text-sm font-mono text-accent mb-3">// {t("nav.appointments")}</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">{t("appointments.title")}</h1>
            <p className="text-muted-foreground mt-2">{t("appointments.subtitle")}</p>
          </div>

          <SlotCalendar slots={slots} onBook={setSelectedSlot} />

          {selectedSlot && (
            <BookingForm
              slot={selectedSlot}
              onConfirm={handleBook}
              onCancel={() => setSelectedSlot(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointments;
