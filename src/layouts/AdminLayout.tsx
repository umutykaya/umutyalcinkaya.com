import { Link, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LayoutDashboard, CalendarDays, BookOpen, RefreshCw } from "lucide-react";
import Navbar from "@/components/Navbar";

const navItems = [
  { key: "dashboard", path: "/admin", icon: LayoutDashboard },
  { key: "manageSlots", path: "/admin/slots", icon: CalendarDays },
  { key: "manageBookings", path: "/admin/bookings", icon: BookOpen },
  { key: "calendarSync", path: "/admin/calendar", icon: RefreshCw },
];

const AdminLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 flex">
        <aside className="hidden lg:flex w-64 flex-col border-r border-border/30 min-h-[calc(100vh-5rem)] p-4 gap-1">
          {navItems.map(({ key, path, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={key}
                to={path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-accent/10 text-accent font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Icon size={18} />
                {t(`admin.${key}`)}
              </Link>
            );
          })}
        </aside>

        {/* Mobile nav */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card flex">
          {navItems.map(({ key, path, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={key}
                to={path}
                className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors ${
                  isActive ? "text-accent" : "text-muted-foreground"
                }`}
              >
                <Icon size={18} />
                {t(`admin.${key}`)}
              </Link>
            );
          })}
        </div>

        <main className="flex-1 p-6 pb-24 lg:pb-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
