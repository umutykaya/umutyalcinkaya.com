import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { listUserBookings, listAllSlots } from "@/services/appointmentService";
import BookingCard from "@/components/appointments/BookingCard";
import type { Booking, Slot } from "@/types/appointment";
import Navbar from "@/components/Navbar";

const MyBookings = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);

  useEffect(() => {
    if (user) {
      listUserBookings(user.username).then(setBookings);
      listAllSlots().then(setSlots);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-8">
            <p className="text-sm font-mono text-accent mb-3">// {t("nav.myBookings")}</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              {t("appointments.myBookings")}
            </h1>
          </div>

          {bookings.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              {t("appointments.noBookings")}
            </p>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  slot={slots.find((s) => s.id === booking.slotId)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
