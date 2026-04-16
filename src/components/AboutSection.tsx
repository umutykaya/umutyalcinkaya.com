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

            <div className="mt-12 p-6 rounded-2xl border border-border/50 bg-card">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-3 h-3 rounded-full bg-destructive/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <pre className="text-sm font-mono text-muted-foreground overflow-x-auto">
                <code>
{`const developer = {
  name: "Umut Yalcinkaya",
  role: "Full-Stack Developer",
  loves: [
    "clean code", 
    "great UX",
    "open source",
    "coffee ☕",
    "Dogs 🐶",
    "Snowboarding 🏂",
    "Surfing 🌊",
    "Road bikes 🚴‍♂️",
    "Traveling ✈️",
    "Cooking 🍳",
    "Tech Gadgets 🖥️",
    "Music 🎵",
    "Photography 📸"
    ],
  status: "open to work ✨"
};`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
