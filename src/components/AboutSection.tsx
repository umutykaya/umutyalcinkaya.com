import { useTranslation } from "react-i18next";

const stack = ["React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS", "Figma", "Python", "AWS"];

const AboutSection = () => {
  const { t } = useTranslation();

  const stats = [
    { label: t("about.yearsExp"), value: "10+" },
    { label: t("about.projects"), value: "100+" },
    { label: t("about.clients"), value: "80+" },
  ];

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

            <div className="grid grid-cols-3 gap-6 mt-12">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-mono text-accent mb-6">{t("about.techStack")}</p>
            <div className="flex flex-wrap gap-3">
              {stack.map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 rounded-lg border border-border/50 bg-card text-sm text-foreground hover:border-accent/30 hover:glow transition-all duration-300 cursor-default"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-12 rounded-2xl border border-border/50 bg-card p-4 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div className="max-w-xl">
                  <p className="text-sm font-mono text-accent mb-2">{t("about.videoLabel")}</p>
                  <h3 className="text-xl font-semibold text-foreground">{t("about.videoTitle")}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{t("about.videoDescription")}</p>
                </div>
                <a
                  href="https://www.youtube.com/watch?v=LHor80uvNWg&t=24s"
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
                  src="https://www.youtube.com/embed/LHor80uvNWg?start=24"
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
      </div>
    </section>
  );
};

export default AboutSection;
