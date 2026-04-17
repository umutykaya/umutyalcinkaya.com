import { createRoot } from "react-dom/client";
import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";
import { setDefaultConsent, initGA, grantConsent } from "@/lib/analytics";
import "@/i18n";
import App from "./App.tsx";
import "./index.css";

Amplify.configure(awsExports);

// 1. Set consent defaults to denied (must happen before gtag loads)
setDefaultConsent();

// 2. Load Google tag (runs in denied mode until consent is granted)
initGA();

// 3. If user previously accepted cookies, restore granted consent
if (document.cookie.split("; ").some((c) => c.startsWith("analytics_consent=true"))) {
  grantConsent();
}

createRoot(document.getElementById("root")!).render(<App />);
