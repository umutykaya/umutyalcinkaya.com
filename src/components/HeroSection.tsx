import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, FileText, Github, Linkedin, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import profilePhoto from "@/assets/pp.png";

const roles = ["Platform Engineer", "Cloud Architect", "DevOps", "Full Stack Developer"];

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

const whoami = [
  { key: "role", value: "Senior Platform Engineer" },
  { key: "exp", value: "8+ years" },
  { key: "cloud", value: "AWS · Azure · GCP" },
  { key: "iac", value: "Terraform · Bicep · CDK" },
  { key: "loc", value: "Netherlands" },
];

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Types out each role, pauses, deletes it, then moves to the next one
const useTypewriter = (words: string[]) => {
  const [text, setText] = useState(prefersReducedMotion() ? words[0] : "");

  useEffect(() => {
    if (prefersReducedMotion()) return;

    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      const word = words[wordIndex];
      charIndex += deleting ? -1 : 1;
      setText(word.slice(0, charIndex));

      let delay = deleting ? 40 : 80;
      if (!deleting && charIndex === word.length) {
        deleting = true;
        delay = 1800;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 400;
      }
      timeout = setTimeout(tick, delay);
    };

    timeout = setTimeout(tick, 600);
    return () => clearTimeout(timeout);
  }, [words]);

  return text;
};

const HeroSection = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const role = useTypewriter(roles);

  // Spotlight follows the cursor via CSS vars, so no re-renders
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden hero-spotlight"
    >
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "3s" }}
      />

      <div className="container mx-auto px-6 relative z-10 pt-24 pb-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text content */}
          <div>
            {/* Status badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/60 bg-secondary/50 backdrop-blur mb-8 opacity-0 animate-fade-up"
              style={{ animationDelay: "0.1s" }}
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
              className="text-5xl sm:text-7xl lg:text-8xl font-bold leading-[0.95] mb-6 opacity-0 animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              {t("hero.title1")}
              <br />
              <span className="text-gradient-animated">{t("hero.title2")}</span>
            </h1>

            {/* Typewriter role */}
            <p
              className="font-mono text-base sm:text-lg text-foreground/80 mb-6 h-7 opacity-0 animate-fade-up"
              style={{ animationDelay: "0.3s" }}
              aria-label={roles.join(", ")}
            >
              <span className="text-accent">~$</span> {role}
              <span className="hero-caret" aria-hidden="true" />
            </p>

            {/* Subtitle */}
            <p
              className="text-lg sm:text-xl text-muted-foreground max-w-xl mb-10 opacity-0 animate-fade-up"
              style={{ animationDelay: "0.4s" }}
            >
              {t("hero.subtitle")}
            </p>

            {/* CTA row */}
            <div
              className="flex flex-wrap items-center gap-4 opacity-0 animate-fade-up"
              style={{ animationDelay: "0.6s" }}
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

          {/* Right: Avatar with gradient ring + floating terminal card */}
          <div
            className="relative flex justify-center opacity-0 animate-fade-up"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="relative">
              <div className="absolute -inset-6 rounded-full bg-accent/15 blur-3xl" />
              <div className="hero-ring relative rounded-full p-[3px]">
                <img
                  src={profilePhoto}
                  alt="Umut Yalcinkaya"
                  className="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96 rounded-full object-cover bg-background"
                />
              </div>

              <div className="hidden sm:block absolute -bottom-10 -left-16 lg:-left-24 w-72 rounded-xl glass shadow-2xl animate-float">
                <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border/50">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-[10px] font-mono text-muted-foreground">
                    zsh — umut
                  </span>
                </div>
                <div className="px-4 py-3 font-mono text-xs leading-relaxed">
                  <p className="text-muted-foreground">
                    <span className="text-accent">~$</span> whoami --verbose
                  </p>
                  {whoami.map((line) => (
                    <p key={line.key} className="whitespace-pre">
                      <span className="text-accent/80">{line.key.padEnd(7)}</span>
                      <span className="text-foreground/90">{line.value}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tech stack marquee */}
      <div
        className="relative z-10 w-full border-y border-border/40 bg-background/30 backdrop-blur-sm py-4 hero-marquee-mask opacity-0 animate-fade-up"
        style={{ animationDelay: "1s" }}
      >
        <div className="hero-marquee flex w-max gap-12">
          {[...stack, ...stack].map((tech, i) => (
            <span
              key={i}
              className="font-mono text-sm text-muted-foreground whitespace-nowrap"
              aria-hidden={i >= stack.length}
            >
              <span className="text-accent/70">#</span> {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <a
        href="#apps"
        className="relative z-10 mx-auto mt-6 mb-6 text-muted-foreground hover:text-foreground transition-colors animate-bounce"
        aria-label={t("hero.viewWork")}
      >
        <ChevronDown size={22} />
      </a>
    </section>
  );
};

export default HeroSection;
