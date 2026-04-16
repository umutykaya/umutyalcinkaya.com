import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Trash2, Clock } from "lucide-react";
import { listAllSlots, createSlot, deleteSlot } from "@/services/appointmentService";
import SlotForm from "@/components/appointments/SlotForm";
import type { Slot } from "@/types/appointment";
import { toast } from "sonner";

const ManageSlots = () => {
  const { t } = useTranslation();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [showForm, setShowForm] = useState(false);

  const load = () => listAllSlots().then(setSlots);
  useEffect(() => { load(); }, []);

  const handleCreate = async (data: Omit<Slot, "id">) => {
    await createSlot(data);
    setShowForm(false);
    load();
    toast.success(t("admin.createSlot"));
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("admin.deleteConfirm"))) return;
    await deleteSlot(id);
    load();
  };

  // Group by date
  const grouped = slots.reduce<Record<string, Slot[]>>((acc, slot) => {
    (acc[slot.date] ??= []).push(slot);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">{t("admin.manageSlots")}</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors"
        >
          <Plus size={16} />
          {t("admin.createSlot")}
        </button>
      </div>

      {slots.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">{t("admin.noSlots")}</p>
      ) : (
        <div className="space-y-6">
          {Object.keys(grouped).sort().map((date) => (
            <div key={date}>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">{date}</h3>
              <div className="space-y-2">
                {grouped[date].sort((a, b) => a.startTime.localeCompare(b.startTime)).map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card"
                  >
                    <div className="flex items-center gap-3">
                      <Clock size={16} className={slot.isBooked ? "text-yellow-500" : "text-accent"} />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {slot.startTime} – {slot.endTime}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {slot.duration} {t("appointments.minutes")}
                          {slot.isBooked && " · Booked"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(slot.id)}
                      className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <SlotForm onSave={handleCreate} onCancel={() => setShowForm(false)} />
      )}
    </div>
  );
};

export default ManageSlots;
