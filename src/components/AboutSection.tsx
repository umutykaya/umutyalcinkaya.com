import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const stack = ["AWS", "Azure", "Terraform", "Kubernetes", "TypeScript", "Python", "Go", "React"];

const AboutSection = () => {
  const { t } = useTranslation();

  return (
    <section id="about" className="py-32 border-t border-border/30">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-sm font-mono text-accent mb-3">{t("about.label")}</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-8">
              {t("about.title1")}<br />
              <span className="text-gradient">{t("about.title2")}</span>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>{t("about.bio1")}</p>
              <p>{t("about.bio2")}</p>
            </div>

            <div className="flex flex-wrap gap-3 mt-8">
              {stack.map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 rounded-lg border border-border/50 bg-card text-sm text-foreground hover:border-accent/30 hover:glow transition-all duration-300 cursor-default"
                >
                  {tech}
                </span>
              ))}
            </div>

            <Link
              to="/resume"
              className="inline-flex items-center gap-2 mt-8 text-sm text-accent hover:underline"
            >
              {t("nav.resume")}
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card p-4 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div className="max-w-xl">
                <p className="text-sm font-mono text-accent mb-2">{t("about.videoLabel")}</p>
                <h3 className="text-xl font-semibold text-foreground">{t("about.videoTitle")}</h3>
                <p className="text-sm text-muted-foreground mt-2">{t("about.videoDescription")}</p>
              </div>
              <a
                href={import.meta.env.VITE_YOUTUBE_VIDEO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-sm text-accent hover:underline"
              >
                {t("about.watchVideo")}
              </a>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-border/50 bg-secondary/30 aspect-video">
              <iframe
                className="absolute inset-0 h-full w-full"
                src={import.meta.env.VITE_YOUTUBE_EMBED_URL}
                title={t("about.videoTitle")}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
