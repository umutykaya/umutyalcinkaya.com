import { useTranslation } from "react-i18next";
import { format, parseISO } from "date-fns";
import { Calendar, Clock } from "lucide-react";
import type { Slot } from "@/types/appointment";

interface SlotCalendarProps {
  slots: Slot[];
  onBook: (slot: Slot) => void;
}

const SlotCalendar = ({ slots, onBook }: SlotCalendarProps) => {
  const { t } = useTranslation();

  // Group slots by date
  const grouped = slots.reduce<Record<string, Slot[]>>((acc, slot) => {
    (acc[slot.date] ??= []).push(slot);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort();

  if (sortedDates.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar size={40} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">{t("appointments.noSlots")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {sortedDates.map((date) => (
        <div key={date}>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Calendar size={14} />
            {format(parseISO(date), "EEEE, MMMM d, yyyy")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {grouped[date].sort((a, b) => a.startTime.localeCompare(b.startTime)).map((slot) => (
              <button
                key={slot.id}
                onClick={() => onBook(slot)}
                className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card hover:border-accent/30 hover:glow transition-all duration-300 text-left"
              >
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-accent" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {slot.startTime} – {slot.endTime}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {slot.duration} {t("appointments.minutes")}
                    </p>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-md bg-accent/10 text-accent font-medium">
                  {t("appointments.book")}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SlotCalendar;
