import { useState } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import type { Slot } from "@/types/appointment";

interface SlotFormProps {
  slot?: Slot;
  onSave: (data: Omit<Slot, "id">) => void;
  onCancel: () => void;
}

const SlotForm = ({ slot, onSave, onCancel }: SlotFormProps) => {
  const { t } = useTranslation();
  const [date, setDate] = useState(slot?.date || "");
  const [startTime, setStartTime] = useState(slot?.startTime || "09:00");
  const [endTime, setEndTime] = useState(slot?.endTime || "10:00");
  const [duration, setDuration] = useState(slot?.duration || 60);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      date,
      startTime,
      endTime,
      duration,
      isBooked: slot?.isBooked ?? false,
      createdBy: slot?.createdBy ?? "admin",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-6">
      <div className="w-full max-w-md rounded-2xl border border-border/50 bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">
            {slot ? t("admin.editSlot") : t("admin.createSlot")}
          </h3>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">{t("admin.date")}</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">{t("admin.startTime")}</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">{t("admin.endTime")}</label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">{t("admin.durationMin")}</label>
            <input
              type="number"
              required
              min={15}
              step={15}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-lg border border-border text-foreground hover:bg-secondary transition-colors"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors"
            >
              {t("admin.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SlotForm;
