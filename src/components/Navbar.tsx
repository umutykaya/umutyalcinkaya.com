import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Menu, X, Sun, Moon, User, LogOut } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { user, isAdmin, logout } = useAuth();

  const sectionLinks = [
    { label: t("nav.work"), href: "/#work" },
    { label: t("nav.about"), href: "/#about" },
    { label: t("nav.contact"), href: "/#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto flex items-center justify-between h-16 px-6">
        <a href="/" className="text-lg font-semibold tracking-tight text-foreground">
          portfolio<span className="text-gradient">.</span>
        </a>

        <div className="hidden md:flex items-center gap-6">
          {sectionLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
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

          {user ? (
            <div className="flex items-center gap-1">
              <Link
                to="/profile"
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <User size={18} />
              </Link>
              <button
                onClick={() => logout()}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-sm px-3 py-1.5 rounded-lg border border-border text-foreground hover:bg-secondary transition-colors"
            >
              {t("nav.login")}
            </Link>
          )}

          <a
            href="/#contact"
            className="text-sm px-4 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
          >
            {t("nav.letsTalk")}
          </a>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-foreground"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden glass border-t border-border/50 animate-fade-in">
          <div className="container mx-auto px-6 py-4 flex flex-col gap-3">
            {sectionLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
            {!user && (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="text-sm text-accent hover:underline"
              >
                {t("nav.login")}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
