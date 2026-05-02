import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Github, BarChart3, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import ProjectCard from "./ProjectCard";
import { fetchEnrichedRepos, type GitHubRepo } from "@/services/githubService";

const MAX_REPOS = 6;
const GITHUB_USERNAME_PATTERN = /github\.com\/([^/?#]+)/;

const getGitHubUsername = () => {
  const usernameEnv = import.meta.env.VITE_GITHUB_USERNAME;
  const configuredGitHubUsername = typeof usernameEnv === "string" ? usernameEnv.trim() : "";
  if (configuredGitHubUsername) {
    return configuredGitHubUsername;
  }

  const githubProfileUrl = import.meta.env.VITE_GITHUB_URL;
  return githubProfileUrl?.match(GITHUB_USERNAME_PATTERN)?.[1] ?? null;
};

const githubUsername = getGitHubUsername();

const WorkSection = () => {
  const { t } = useTranslation();

  const {
    data: repos,
    isLoading,
    isError,
  } = useQuery<GitHubRepo[]>({
    // Share cache with the GitHub page's complexity table
    queryKey: ["github-enriched-repos"],
    queryFn: () => fetchEnrichedRepos(),
    staleTime: 1000 * 60 * 5,
  });

  // Already sorted by complexity_score desc by fetchEnrichedRepos
  const displayed = repos?.slice(0, MAX_REPOS) ?? [];

  return (
    <section id="work" className="py-32 border-t border-border/30">
      <div className="container mx-auto px-6">
        <div className="mb-10 flex items-end justify-between gap-4 flex-wrap">
          <div className="max-w-2xl">
            <p className="text-sm font-mono text-accent mb-3">{t("work.label")}</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-5">
              {t("work.title")}
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              {t("work.intro")}
            </p>
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

        <div className="mb-12">
          <Link
            to="/github"
            className="group inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-foreground transition-colors"
          >
            <BarChart3 size={16} />
            <span>{t("work.viewDashboard")}</span>
            <ArrowUpRight
              size={14}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayed.map((repo, i) => {
                const owner = repo.full_name?.split("/")[0];
                const showOwner =
                  owner &&
                  githubUsername &&
                  owner.toLowerCase() !== githubUsername.toLowerCase();
                const title = showOwner ? `${owner}/${repo.name}` : repo.name;
                return (
                  <div
                    key={repo.id}
                    className="opacity-0 animate-fade-up"
                    style={{ animationDelay: `${0.1 * i}s` }}
                  >
                    <ProjectCard
                      title={title}
                      description={repo.description ?? ""}
                      tags={repo.topics}
                      href={repo.html_url}
                      language={repo.language}
                      stars={repo.stargazers_count}
                      forks={repo.forks_count}
                      className="h-full"
                    />
                  </div>
                );
              })}
            </div>
        )}
      </div>
    </section>
  );
};

export default WorkSection;
