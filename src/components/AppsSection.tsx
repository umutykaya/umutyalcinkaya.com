import { useTranslation } from "react-i18next";
import { ArrowUpRight } from "lucide-react";
import mealPlannerShot from "@/assets/apps/mealplanner.jpg";
import noteablyShot from "@/assets/apps/noteably.jpg";

type PortfolioApp = {
  name: string;
  url: string;
  tagline: string;
  description: string;
  image: string;
  features: string[];
};

// Add new apps here — each one renders as a showcase card
const apps: PortfolioApp[] = [
  {
    name: "Meal Planner",
    url: "https://mealplanner.mountwavegroup.com",
    tagline: "Compose your own diet.",
    description:
      "Bring your own recipes from a spreadsheet or by hand and turn them into months of meals. Autofill a week in one tap, track daily calories and macros against your targets, and get a shopping list grouped by aisle.",
    image: mealPlannerShot,
    features: ["CSV import & export", "1-tap weekly autofill", "3-month planning", "Nutrition tracking", "Smart shopping list"],
  },
  {
    name: "Noteably",
    url: "https://noteably.mountwavegroup.com",
    tagline: "A tiny notes app, self-hosted.",
    description:
      "A lightweight Django note board running on my own Mac mini M4 and served to the internet. Post a note from any device and see it appear instantly, end to end on hardware I run myself.",
    image: noteablyShot,
    features: ["Django", "Self-hosted on Mac mini M4", "Post from any device", "Lightweight & fast"],
  },
];

const AppsSection = () => {
  const { t } = useTranslation();

  return (
    <section id="apps" className="py-32 border-t border-border/30">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-mono text-accent mb-3">{t("apps.label")}</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-5">
            {t("apps.title")}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            {t("apps.intro")}
          </p>
        </div>

        <div className="space-y-8">
          {apps.map((app, i) => {
            const host = new URL(app.url).host;
            // Alternate the screenshot side on wide screens for rhythm
            const flipped = i % 2 === 1;
            return (
              <article
                key={app.url}
                className={`group grid ${flipped ? "lg:grid-cols-[1fr_1.4fr]" : "lg:grid-cols-[1.4fr_1fr]"} gap-8 items-center rounded-3xl border border-border/50 bg-card/60 backdrop-blur p-4 sm:p-6 transition-all duration-300 hover:border-accent/40 hover:glow`}
              >
                {/* Screenshot in a browser frame */}
                <a
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block rounded-2xl overflow-hidden border border-border/50 bg-background shadow-xl ${flipped ? "lg:order-2" : ""}`}
                >
                  <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border/50 bg-secondary/60">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    <span className="ml-3 flex-1 truncate rounded-md bg-background/70 px-3 py-0.5 text-[11px] font-mono text-muted-foreground">
                      {host}
                    </span>
                  </div>
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={app.image}
                      alt={`${app.name} screenshot`}
                      loading="lazy"
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                </a>

                {/* Details */}
                <div className="px-2 sm:px-0 lg:pr-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-0.5 text-[11px] font-medium text-green-600 dark:text-green-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      {t("apps.live")}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground truncate">
                      {host}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                    {app.name}
                  </h3>
                  <p className="text-gradient font-semibold mb-4">{app.tagline}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {app.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {app.features.map((f) => (
                      <span
                        key={f}
                        className="text-xs px-2.5 py-1 rounded-md bg-secondary text-muted-foreground"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-all hover:shadow-[0_0_40px_-8px_hsl(var(--accent))] hover:-translate-y-0.5"
                  >
                    {t("apps.visit")}
                    <ArrowUpRight
                      size={16}
                      className="transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
                    />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AppsSection;
