import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Download, Upload, FileCheck } from "lucide-react";
import { listAllSlots, listAllBookings, createSlot } from "@/services/appointmentService";
import { exportToIcs, downloadIcs, parseIcs, icsEventsToSlots } from "@/lib/calendar";
import { toast } from "sonner";

const CalendarSync = () => {
  const { t } = useTranslation();
  const fileRef = useRef<HTMLInputElement>(null);
  const [slotCount, setSlotCount] = useState(0);

  useEffect(() => {
    listAllSlots().then((s) => setSlotCount(s.length));
  }, []);

  const handleExport = async () => {
    const slots = await listAllSlots();
    const bookings = await listAllBookings();
    const icsContent = exportToIcs(slots, bookings);
    downloadIcs(icsContent);
    toast.success(t("admin.exportSuccess"));
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const events = parseIcs(text);
    const newSlots = icsEventsToSlots(events);

    for (const slot of newSlots) {
      await createSlot(slot);
    }

    toast.success(`${t("admin.importSuccess")} (${newSlots.length})`);
    listAllSlots().then((s) => setSlotCount(s.length));

    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">{t("admin.calendarSync")}</h1>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="p-6 rounded-xl border border-border/50 bg-card">
          <Download size={24} className="text-accent mb-3" />
          <h3 className="font-semibold text-foreground mb-2">{t("admin.exportIcs")}</h3>
          <p className="text-sm text-muted-foreground mb-4">{t("admin.exportDesc")}</p>
          <button
            onClick={handleExport}
            disabled={slotCount === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            <FileCheck size={16} />
            {t("admin.exportIcs")}
          </button>
        </div>

        <div className="p-6 rounded-xl border border-border/50 bg-card">
          <Upload size={24} className="text-accent mb-3" />
          <h3 className="font-semibold text-foreground mb-2">{t("admin.importIcs")}</h3>
          <p className="text-sm text-muted-foreground mb-4">{t("admin.importDesc")}</p>
          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-secondary transition-colors cursor-pointer">
            <Upload size={16} />
            {t("admin.selectFile")}
            <input
              ref={fileRef}
              type="file"
              accept=".ics"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default CalendarSync;
