import { useTranslation } from "react-i18next";
import { Calendar, Clock } from "lucide-react";
import type { Booking, Slot } from "@/types/appointment";

interface BookingCardProps {
  booking: Booking;
  slot?: Slot;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-500",
  CONFIRMED: "bg-green-500/10 text-green-500",
  REJECTED: "bg-destructive/10 text-destructive",
  CANCELLED: "bg-muted text-muted-foreground",
};

const BookingCard = ({ booking, slot }: BookingCardProps) => {
  const { t } = useTranslation();

  const statusKey = booking.status.toLowerCase() as "pending" | "confirmed" | "rejected" | "cancelled";

  return (
    <div className="p-4 rounded-xl border border-border/50 bg-card">
      <div className="flex items-start justify-between mb-3">
        <div className="space-y-1">
          {slot && (
            <>
              <p className="flex items-center gap-2 text-sm text-foreground">
                <Calendar size={14} className="text-muted-foreground" />
                {slot.date}
              </p>
              <p className="flex items-center gap-2 text-sm text-foreground">
                <Clock size={14} className="text-muted-foreground" />
                {slot.startTime} – {slot.endTime} ({slot.duration} {t("appointments.minutes")})
              </p>
            </>
          )}
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${statusColors[booking.status]}`}>
          {t(`appointments.${statusKey}`)}
        </span>
      </div>
      {booking.message && (
        <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border/30">
          {booking.message}
        </p>
      )}
    </div>
  );
};

export default BookingCard;
