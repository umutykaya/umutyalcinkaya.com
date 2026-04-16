import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { listAllBookings, listAllSlots, updateBookingStatus } from "@/services/appointmentService";
import BookingList from "@/components/appointments/BookingList";
import type { Booking, Slot } from "@/types/appointment";
import { toast } from "sonner";

const ManageBookings = () => {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);

  const load = () => {
    listAllBookings().then(setBookings);
    listAllSlots().then(setSlots);
  };
  useEffect(() => { load(); }, []);

  const handleApprove = async (id: string) => {
    await updateBookingStatus(id, "CONFIRMED");
    toast.success(t("admin.approve"));
    load();
  };

  const handleReject = async (id: string) => {
    await updateBookingStatus(id, "REJECTED");
    toast.success(t("admin.reject"));
    load();
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">{t("admin.manageBookings")}</h1>
      <BookingList
        bookings={bookings}
        slots={slots}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default ManageBookings;
