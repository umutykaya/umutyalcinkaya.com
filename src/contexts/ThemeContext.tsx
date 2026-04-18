import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function isNightTime(): boolean {
  const hour = new Date().getHours();
  return hour < 6 || hour >= 20;
}

function getAutoTheme(): Theme {
  return isNightTime() ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [manual, setManual] = useState<boolean>(() => localStorage.getItem("theme-manual") === "true");
  const [theme, setTheme] = useState<Theme>(() => {
    if (localStorage.getItem("theme-manual") === "true") {
      const stored = localStorage.getItem("theme");
      if (stored === "light" || stored === "dark") return stored;
    }
    return getAutoTheme();
  });

  // Auto-switch theme based on time of day (check every minute)
  useEffect(() => {
    if (manual) return;
    const interval = setInterval(() => {
      setTheme(getAutoTheme());
    }, 60_000);
    return () => clearInterval(interval);
  }, [manual]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setManual(true);
    localStorage.setItem("theme-manual", "true");
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
