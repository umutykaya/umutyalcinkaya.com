import { ArrowRight, ChevronDown, FileText, Github, Linkedin, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import profilePhoto from "@/assets/pp.png";

const role = "Platform Engineer";

const stack = [
  "AWS",
  "Azure",
  "Kubernetes",
  "Terraform",
  "Bicep",
  "CDK",
  "Python",
  "Go",
  "TypeScript",
  "Django",
  "Databricks",
  "Helm",
];

const HeroSection = () => {
  const { t } = useTranslation();
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      <div className="container mx-auto px-6 relative z-10 pt-24 pb-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text content */}
          <div>
            {/* Status badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/60 bg-secondary/50 backdrop-blur mb-8"
            >
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-green-500" />
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                {t("hero.badge")}
              </span>
            </div>

            {/* Main headline */}
            <h1
              className="text-5xl sm:text-7xl lg:text-8xl font-bold leading-[0.95] mb-6"
            >
              {t("hero.title1")}
              <br />
              <span className="text-gradient">{t("hero.title2")}</span>
            </h1>

            {/* Typewriter role */}
            <p
              className="font-mono text-base sm:text-lg text-foreground/80 mb-6 h-7"
             
            >
              <span className="text-accent">~$</span> {role}
            </p>

            {/* Subtitle */}
            <p
              className="text-lg sm:text-xl text-muted-foreground max-w-xl mb-10"
            >
              {t("hero.subtitle")}
            </p>

            {/* CTA row */}
            <div
              className="flex flex-wrap items-center gap-4"
            >
              <a
                href="#contact"
                className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-all hover:shadow-[0_0_40px_-8px_hsl(var(--accent))] hover:-translate-y-0.5"
              >
                {t("nav.letsTalk")}
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>
              <Link
                to="/resume"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-accent/60 bg-accent/10 backdrop-blur text-sm font-medium text-accent hover:bg-accent/20 hover:-translate-y-0.5 transition-all"
              >
                <FileText size={16} />
                {t("nav.resume")}
              </Link>
              <a
                href="#apps"
                className="px-6 py-3 rounded-lg border border-border bg-background/40 backdrop-blur text-sm font-medium text-foreground hover:bg-secondary hover:-translate-y-0.5 transition-all"
              >
                {t("hero.viewWork")}
              </a>
            </div>

            {/* Social links */}
            <div
              className="flex items-center gap-4 mt-12"
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
                href="/#contact"
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

          {/* Right: Avatar with gradient ring */}
          <div className="relative flex justify-center">
            <div className="hero-ring relative rounded-full p-[3px]">
              <img
                src={profilePhoto}
                alt="Umut Yalcinkaya"
                className="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96 rounded-full object-cover bg-background"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tech stack marquee */}
      <div
        className="relative z-10 w-full border-y border-border/40 bg-background/30 backdrop-blur-sm py-4"
      >
        <div className="container mx-auto px-6 flex flex-wrap justify-center gap-x-8 gap-y-2">
          {stack.map((tech) => (
            <span
              key={tech}
              className="font-mono text-sm text-muted-foreground whitespace-nowrap"
            >
              <span className="text-accent/70">#</span> {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <a
        href="#apps"
        className="relative z-10 mx-auto mt-6 mb-6 text-muted-foreground hover:text-foreground transition-colors"
        aria-label={t("hero.viewWork")}
      >
        <ChevronDown size={22} />
      </a>
    </section>
  );
};

export default HeroSection;
