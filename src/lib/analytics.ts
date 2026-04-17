const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || "G-XXXXXXXXXX";

function gtag(...args: unknown[]) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
}

/**
 * Set consent defaults to denied. Must be called before loading gtag.
 * This is called early in app initialization (before user interacts with banner).
 */
export function setDefaultConsent() {
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
  });
}

/**
 * Load the Google tag script and configure it.
 * Called once during app initialization (regardless of consent state).
 * Tags will respect the consent state automatically.
 */
export function initGA() {
  if (typeof window === "undefined") return;
  if (document.getElementById("ga-script")) return;

  const script = document.createElement("script");
  script.id = "ga-script";
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);

  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID);
}

/**
 * Update consent to granted for all parameters.
 * Called when the user accepts cookies.
 */
export function grantConsent() {
  gtag("consent", "update", {
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
    analytics_storage: "granted",
  });
}

/**
 * Revoke consent (set all to denied).
 * Called when the user declines cookies.
 */
export function denyConsent() {
  gtag("consent", "update", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
  });
}

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}
