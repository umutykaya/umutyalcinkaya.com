import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon, FileText } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { label: t("nav.apps"), href: "/#apps" },
    { label: t("nav.work"), href: "/#work" },
    { label: t("nav.about"), href: "/#about" },
    { label: t("nav.contact"), href: "/#contact" },
  ];

  // Every nav link is an anchor on the one-pager, so only highlight them there
  const isActive = () => location.pathname === "/";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto flex items-center justify-between h-16 px-6">
        <a href="/" className="text-lg font-semibold tracking-tight text-foreground">
          portfolio<span className="text-gradient">.</span>
        </a>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors duration-200 ${
                isActive()
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </a>
          ))}
          {user && (
            <>
              <Link
                to="/appointments"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {t("nav.appointments")}
              </Link>
              <Link
                to="/my-bookings"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {t("nav.myBookings")}
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {t("nav.admin")}
                </Link>
              )}
            </>
          )}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <LanguageSwitcher />
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link
            to="/resume"
            className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg border border-accent/60 text-accent hover:bg-accent/10 transition-colors"
          >
            <FileText size={16} />
            {t("nav.resume")}
          </Link>
          <a
            href="/#contact"
            className="text-sm px-4 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
          >
            {t("nav.letsTalk")}
          </a>
        </div>

        <div className="md:hidden flex items-center gap-3">
          <Link
            to="/resume"
            onClick={() => setOpen(false)}
            className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border border-accent/60 text-accent hover:bg-accent/10 transition-colors"
          >
            <FileText size={14} />
            {t("nav.resume")}
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="text-foreground"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden glass border-t border-border/50 animate-fade-in">
          <div className="container mx-auto px-6 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`text-sm transition-colors ${
                  isActive()
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </a>
            ))}
            {user && (
              <>
                <Link to="/appointments" onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("nav.appointments")}
                </Link>
                <Link to="/my-bookings" onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("nav.myBookings")}
                </Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {t("nav.admin")}
                  </Link>
                )}
                <Link to="/profile" onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("nav.profile")}
                </Link>
              </>
            )}
            <div className="flex items-center gap-2 pt-2 border-t border-border/30">
              <LanguageSwitcher />
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
