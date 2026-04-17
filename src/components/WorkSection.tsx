import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Github } from "lucide-react";
import ProjectCard from "./ProjectCard";
import { fetchGitHubRepos, type GitHubRepo } from "@/services/githubService";

const MAX_REPOS = 6;
const configuredGitHubUsername = import.meta.env.VITE_GITHUB_USERNAME?.trim();
const githubProfileUrl = import.meta.env.VITE_GITHUB_URL;
const githubUsernameFromUrl = githubProfileUrl?.match(/github\.com\/([^/?#]+)/)?.[1];
const githubUsername = configuredGitHubUsername || githubUsernameFromUrl;
const githubHeatmapUrl = githubUsername
  ? `https://ghchart.rshah.org/${githubUsername}`
  : null;

const WorkSection = () => {
  const { t } = useTranslation();
  const [isHeatMapAvailable, setIsHeatMapAvailable] = useState(Boolean(githubHeatmapUrl));

  const {
    data: repos,
    isLoading,
    isError,
  } = useQuery<GitHubRepo[]>({
    queryKey: ["github-repos"],
    queryFn: fetchGitHubRepos,
    staleTime: 1000 * 60 * 10,
  });

  const displayed = repos?.slice(0, MAX_REPOS) ?? [];

  return (
    <section id="work" className="py-32 border-t border-border/30">
      <div className="container mx-auto px-6">
        <div className="mb-16 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-mono text-accent mb-3">{t("work.label")}</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
              {t("work.title")}
            </h2>
          </div>
          <a
            href={import.meta.env.VITE_GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github size={18} />
            {t("work.viewGitHub")}
          </a>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: MAX_REPOS }).map((_, i) => (
              <div
                key={i}
                className="h-56 rounded-2xl border border-border/50 bg-card animate-pulse"
              />
            ))}
          </div>
        )}

        {isError && (
          <p className="text-center text-muted-foreground">
            {t("work.fetchError")}
          </p>
        )}

        {!isLoading && !isError && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayed.map((repo, i) => (
                <div
                  key={repo.id}
                  className="opacity-0 animate-fade-up"
                  style={{ animationDelay: `${0.1 * i}s` }}
                >
                  <ProjectCard
                    title={repo.name}
                    description={repo.description ?? ""}
                    tags={repo.topics}
                    href={repo.html_url}
                    language={repo.language}
                    stars={repo.stargazers_count}
                    forks={repo.forks_count}
                    className="h-full"
                  />
                </div>
              ))}
            </div>

            {githubHeatmapUrl && (
              <div className="mt-8 rounded-2xl border border-border/50 bg-card/60 p-4 sm:p-6">
                {isHeatMapAvailable ? (
                  <img
                    src={githubHeatmapUrl}
                    alt={`${githubUsername} GitHub contribution heat map`}
                    loading="lazy"
                    onError={() => setIsHeatMapAvailable(false)}
                    className="w-full h-auto"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground text-center">
                    GitHub heat map is currently unavailable.
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default WorkSection;
