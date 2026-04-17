import { useTranslation } from "react-i18next";
import { Github, Linkedin, Mail, Twitter, Instagram } from "lucide-react";

const socials = [
  { icon: Github, label: "GitHub", href: import.meta.env.VITE_GITHUB_URL },
  { icon: Linkedin, label: "LinkedIn", href: import.meta.env.VITE_LINKEDIN_URL },
  { icon: Twitter, label: "X / Twitter", href: import.meta.env.VITE_TWITTER_URL },
  { icon: Instagram, label: "Instagram", href: import.meta.env.VITE_INSTAGRAM_URL },
  { icon: Mail, label: "Email", href: "/contact" },
];

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="py-16 border-t border-border/30">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center gap-8">
          {/* Social icons */}
          <div className="flex items-center gap-4">
            {socials.map(({ icon: Icon, label, href }) => {
              const isExternal = href.startsWith("http");
              return (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
                  className="w-10 h-10 rounded-lg border border-border/50 bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-accent/30 transition-all duration-200"
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>

          {/* Divider */}
          <div className="w-12 h-px bg-border/50" />

          {/* Bottom row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} umutyalcinkaya.com. {t("footer.rights")}</p>
            <span className="hidden sm:inline">·</span>
            <p>{t("footer.builtWith")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
