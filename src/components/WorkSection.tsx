import { useTranslation } from "react-i18next";
import ProjectCard from "./ProjectCard";

const projectKeys = ["nebula", "aura", "synthwave", "vertex", "horizon", "pulse"] as const;

const projectTags: Record<string, string[]> = {
  nebula: ["React", "TypeScript", "D3.js", "Supabase"],
  aura: ["Next.js", "Stripe", "Tailwind"],
  synthwave: ["Web Audio API", "React", "Python"],
  vertex: ["TypeScript", "MDX", "Vercel"],
  horizon: ["React", "Zustand", "Framer Motion"],
  pulse: ["React Native", "Node.js", "PostgreSQL"],
};

const WorkSection = () => {
  const { t } = useTranslation();

  return (
    <section id="work" className="py-32">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <p className="text-sm font-mono text-accent mb-3">{t("work.label")}</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
            {t("work.title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projectKeys.map((key, i) => (
            <div
              key={key}
              className="opacity-0 animate-fade-up"
              style={{ animationDelay: `${0.1 * i}s` }}
            >
              <ProjectCard
                title={t(`work.${key}.title`)}
                description={t(`work.${key}.description`)}
                tags={projectTags[key]}
                className="h-full"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
