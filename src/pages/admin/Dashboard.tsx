import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { CalendarDays, BookOpen, Clock, Users } from "lucide-react";
import { listAllSlots, listAllBookings } from "@/services/appointmentService";
import type { Slot, Booking } from "@/types/appointment";

const Dashboard = () => {
  const { t } = useTranslation();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    listAllSlots().then(setSlots);
    listAllBookings().then(setBookings);
  }, []);

  const stats = [
    {
      label: t("admin.totalSlots"),
      value: slots.length,
      icon: CalendarDays,
      color: "text-accent",
    },
    {
      label: t("admin.bookedSlots"),
      value: slots.filter((s) => s.isBooked).length,
      icon: Clock,
      color: "text-green-500",
    },
    {
      label: t("admin.pendingBookings"),
      value: bookings.filter((b) => b.status === "PENDING").length,
      icon: BookOpen,
      color: "text-yellow-500",
    },
    {
      label: t("admin.totalBookings"),
      value: bookings.length,
      icon: Users,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">{t("admin.dashboard")}</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="p-4 rounded-xl border border-border/50 bg-card">
            <stat.icon size={20} className={`${stat.color} mb-2`} />
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          to="/admin/slots"
          className="p-6 rounded-xl border border-border/50 bg-card hover:border-accent/30 transition-colors"
        >
          <CalendarDays size={24} className="text-accent mb-3" />
          <h3 className="font-semibold text-foreground">{t("admin.manageSlots")}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {slots.length} {t("admin.totalSlots").toLowerCase()}
          </p>
        </Link>
        <Link
          to="/admin/bookings"
          className="p-6 rounded-xl border border-border/50 bg-card hover:border-accent/30 transition-colors"
        >
          <BookOpen size={24} className="text-accent mb-3" />
          <h3 className="font-semibold text-foreground">{t("admin.manageBookings")}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {bookings.filter((b) => b.status === "PENDING").length} {t("admin.pendingBookings").toLowerCase()}
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
