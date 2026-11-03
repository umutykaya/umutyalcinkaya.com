import { useTranslation } from "react-i18next";
import SitePageLayout from "@/components/SitePageLayout";

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <SitePageLayout>
      <article className="container mx-auto max-w-3xl px-6 py-32">
        <header className="mb-12">
          <p className="text-sm font-mono text-accent mb-3">// {t("footer.privacy")}</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            {t("footer.privacy")}
          </h1>
          <p className="text-sm text-muted-foreground">Last updated: November 2, 2026</p>
        </header>

        <div className="space-y-10 text-muted-foreground leading-relaxed">
          <p>
            This policy explains how umutyalcinkaya.com handles information when you visit
            this website or use its contact features. The site is operated by Umut Yalcinkaya.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Information you provide</h2>
            <p>
              The contact form runs in your browser. When you choose to send a message, the
              site prepares it for your email application or WhatsApp; it does not submit the
              message to this website or store the form fields on this site. Your chosen
              provider processes the message when you send it, under its own privacy terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Analytics and consent</h2>
            <p>
              This site uses Google Analytics to understand site traffic. The Google tag is
              loaded with consent settings initially denied. If you accept the cookie banner,
              the site grants analytics and advertising-related consent; if you decline, those
              consent settings remain denied. Google may still receive limited, cookieless
              signals while consent is denied. See{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Google&apos;s Privacy Policy
              </a>{" "}
              for how Google processes information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Cookies and local storage</h2>
            <p>
              A cookie named <code className="text-foreground">analytics_consent</code> stores
              your cookie-banner choice so it can be applied on later visits. The site also
              stores your language preference in your browser&apos;s local storage. You can
              manage or remove cookies and local storage through your browser settings; doing
              so may affect site preferences.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Embedded and external services</h2>
            <p>
              The About page embeds a YouTube video. Loading that page can allow Google or
              YouTube to receive information such as your IP address and browser data. Links
              to social networks, email, and WhatsApp also take you to services that operate
              under their own privacy policies. This site does not control their processing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Your choices and questions</h2>
            <p>
              You can decline analytics consent in the cookie banner and control cookies or
              local storage through your browser. For privacy questions or requests, please
              reach out using the contact options provided on this website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Changes to this policy</h2>
            <p>
              This policy may be updated when the site or its services change. The latest
              version and its effective date will always be available on this page.
            </p>
          </section>
        </div>
      </article>
    </SitePageLayout>
  );
};

export default PrivacyPolicy;
