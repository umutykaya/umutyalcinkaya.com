import { useState } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import type { Slot } from "@/types/appointment";

interface BookingFormProps {
  slot: Slot;
  onConfirm: (message: string) => void;
  onCancel: () => void;
}

const BookingForm = ({ slot, onConfirm, onCancel }: BookingFormProps) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-6">
      <div className="w-full max-w-md rounded-2xl border border-border/50 bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">{t("appointments.confirmTitle")}</h3>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <div className="mb-4 p-3 rounded-lg bg-secondary/50">
          <p className="text-sm text-foreground font-medium">
            {slot.date} · {slot.startTime} – {slot.endTime}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {slot.duration} {t("appointments.minutes")}
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-1.5">
            {t("appointments.confirmMessage")}
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            placeholder={t("appointments.confirmPlaceholder")}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-lg border border-border text-foreground hover:bg-secondary transition-colors"
          >
            {t("appointments.cancel")}
          </button>
          <button
            onClick={() => onConfirm(message)}
            className="flex-1 py-2.5 rounded-lg bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors"
          >
            {t("appointments.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
