import { ArrowDown } from "lucide-react";
import { useTranslation } from "react-i18next";

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/60 bg-secondary/50 mb-8 opacity-0 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-xs font-medium text-muted-foreground">{t("hero.badge")}</span>
        </div>

        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold leading-[0.95] mb-6 opacity-0 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          {t("hero.title1")}
          <br />
          <span className="text-gradient">{t("hero.title2")}</span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto mb-12 opacity-0 animate-fade-up" style={{ animationDelay: "0.4s" }}>
          {t("hero.subtitle")}
        </p>

        <div className="flex items-center justify-center gap-4 opacity-0 animate-fade-up" style={{ animationDelay: "0.6s" }}>
          <a href="#work" className="px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            {t("hero.viewWork")}
          </a>
          <a href="#about" className="px-6 py-3 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors">
            {t("hero.aboutMe")}
          </a>
        </div>
      </div>

      <a href="#work" className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-foreground transition-colors animate-float">
        <ArrowDown size={20} />
      </a>
    </section>
  );
};

export default HeroSection;
