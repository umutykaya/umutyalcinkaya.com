import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="py-8 border-t border-border/30">
      <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} umutykaya. {t("footer.rights")}
        </p>
        <p className="text-sm text-muted-foreground">
          {t("footer.builtWith")}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
