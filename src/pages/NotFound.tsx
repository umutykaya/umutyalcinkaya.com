import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-foreground">{t("notFound.title")}</h1>
        <p className="mb-6 text-xl text-muted-foreground">{t("notFound.message")}</p>
        <a href="/" className="px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          {t("notFound.backHome")}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
