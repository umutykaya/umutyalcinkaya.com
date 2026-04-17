import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import cartoonProfile from "@/assets/cartoon_profile.png";

const roles = ["Platform Engineer", "Cloud Architect", "DevOps"];

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "3s" }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text content */}
          <div>
          {/* Status badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/60 bg-secondary/50 mb-8 opacity-0 animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-muted-foreground">
              {t("hero.badge")}
            </span>
          </div>

          {/* Main headline */}
          <h1
            className="text-5xl sm:text-7xl lg:text-8xl font-bold leading-[0.95] mb-6 opacity-0 animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            {t("hero.title1")}
            <br />
            <span className="text-gradient">{t("hero.title2")}</span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg sm:text-xl text-muted-foreground max-w-xl mb-8 opacity-0 animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            {t("hero.subtitle")}
          </p>

          {/* Role tags */}
          <div
            className="flex flex-wrap gap-2 mb-10 opacity-0 animate-fade-up"
            style={{ animationDelay: "0.5s" }}
          >
            {roles.map((role) => (
              <span
                key={role}
                className="px-3 py-1 text-xs font-mono rounded-md border border-border/50 bg-card text-muted-foreground"
              >
                {role}
              </span>
            ))}
          </div>

          {/* CTA row */}
          <div
            className="flex flex-wrap items-center gap-4 opacity-0 animate-fade-up"
            style={{ animationDelay: "0.6s" }}
          >
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              {t("nav.letsTalk")}
              <ArrowRight size={16} />
            </Link>
            <a
              href="#work"
              className="px-6 py-3 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              {t("hero.viewWork")}
            </a>
          </div>

          {/* Social links */}
          <div
            className="flex items-center gap-4 mt-12 opacity-0 animate-fade-up"
            style={{ animationDelay: "0.8s" }}
          >
            <a
              href={import.meta.env.VITE_GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href={import.meta.env.VITE_LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="/contact"
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              aria-label="Email"
            >
              <Mail size={20} />
            </a>
            <span className="h-4 w-px bg-border/50 mx-1" />
            <span className="text-xs text-muted-foreground font-mono">
              Based in Netherlands
            </span>
          </div>
          </div>

          {/* Right: Profile photo */}
          <div
            className="flex justify-center opacity-0 animate-fade-up"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-accent/10 blur-2xl" />
              <img
                src={cartoonProfile}
                alt="Umut Yalcinkaya"
                className="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96 rounded-full object-cover border-2 border-border/50 shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
