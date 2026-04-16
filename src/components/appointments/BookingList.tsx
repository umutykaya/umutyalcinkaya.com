import { useTranslation } from "react-i18next";
import { Check, X, Calendar, Clock, User, Mail } from "lucide-react";
import type { Booking, Slot } from "@/types/appointment";

interface BookingListProps {
  bookings: Booking[];
  slots: Slot[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-500",
  CONFIRMED: "bg-green-500/10 text-green-500",
  REJECTED: "bg-destructive/10 text-destructive",
  CANCELLED: "bg-muted text-muted-foreground",
};

const BookingList = ({ bookings, slots, onApprove, onReject }: BookingListProps) => {
  const { t } = useTranslation();

  if (bookings.length === 0) {
    return <p className="text-center text-muted-foreground py-8">{t("admin.noBookings")}</p>;
  }

  return (
    <div className="space-y-3">
      {bookings.map((booking) => {
        const slot = slots.find((s) => s.id === booking.slotId);
        const statusKey = booking.status.toLowerCase() as "pending" | "confirmed" | "rejected" | "cancelled";

        return (
          <div key={booking.id} className="p-4 rounded-xl border border-border/50 bg-card">
            <div className="flex items-start justify-between mb-3">
              <div className="space-y-1.5">
                <p className="flex items-center gap-2 text-sm text-foreground font-medium">
                  <User size={14} className="text-muted-foreground" />
                  {booking.userName}
                </p>
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Mail size={12} />
                  {booking.userEmail}
                </p>
                {slot && (
                  <>
                    <p className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar size={12} />
                      {slot.date}
                    </p>
                    <p className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock size={12} />
                      {slot.startTime} – {slot.endTime}
                    </p>
                  </>
                )}
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${statusColors[booking.status]}`}>
                {t(`appointments.${statusKey}`)}
              </span>
            </div>

            {booking.message && (
              <p className="text-xs text-muted-foreground mb-3 pl-6">"{booking.message}"</p>
            )}

            {booking.status === "PENDING" && (
              <div className="flex gap-2 pt-2 border-t border-border/30">
                <button
                  onClick={() => onApprove(booking.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-500 text-xs font-medium hover:bg-green-500/20 transition-colors"
                >
                  <Check size={14} />
                  {t("admin.approve")}
                </button>
                <button
                  onClick={() => onReject(booking.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-medium hover:bg-destructive/20 transition-colors"
                >
                  <X size={14} />
                  {t("admin.reject")}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BookingList;
