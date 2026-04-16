import CookieConsentLib from "react-cookie-consent";
import { useTranslation } from "react-i18next";
import { initGA } from "@/lib/analytics";

const CookieConsentBanner = () => {
  const { t } = useTranslation();

  return (
    <CookieConsentLib
      location="bottom"
      buttonText={t("cookie.accept")}
      declineButtonText={t("cookie.decline")}
      enableDeclineButton
      onAccept={initGA}
      cookieName="analytics_consent"
      style={{
        background: "hsl(var(--card))",
        border: "1px solid hsl(var(--border))",
        borderBottom: "none",
        color: "hsl(var(--foreground))",
        padding: "1rem 1.5rem",
        alignItems: "center",
        fontSize: "0.875rem",
      }}
      buttonStyle={{
        background: "hsl(var(--accent))",
        color: "hsl(var(--accent-foreground))",
        borderRadius: "0.5rem",
        padding: "0.5rem 1.25rem",
        fontSize: "0.875rem",
        fontWeight: "500",
      }}
      declineButtonStyle={{
        background: "transparent",
        border: "1px solid hsl(var(--border))",
        color: "hsl(var(--muted-foreground))",
        borderRadius: "0.5rem",
        padding: "0.5rem 1.25rem",
        fontSize: "0.875rem",
        fontWeight: "500",
      }}
    >
      {t("cookie.message")}
    </CookieConsentLib>
  );
};

export default CookieConsentBanner;
