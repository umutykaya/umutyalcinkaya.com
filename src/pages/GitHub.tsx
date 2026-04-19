import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Github, RefreshCw } from "lucide-react";
import Navbar from "@/components/Navbar";
import GitHubProfileCard from "@/components/github/GitHubProfileCard";
import ContributionHeatmap from "@/components/github/ContributionHeatmap";
import ComplexReposTable from "@/components/github/ComplexReposTable";
import RateLimitIndicator from "@/components/github/RateLimitIndicator";
import {
  fetchGitHubUser,
  fetchEnrichedRepos,
  fetchContributions,
} from "@/services/githubService";
import type { GitHubUser, GitHubRepo, ContributionMatrix } from "@/types/github";

const GitHub = () => {
  const { t } = useTranslation();

  const userQuery = useQuery<GitHubUser>({
    queryKey: ["github-user"],
    queryFn: () => fetchGitHubUser(),
    staleTime: 1000 * 60 * 10,
  });

  const reposQuery = useQuery<GitHubRepo[]>({
    queryKey: ["github-enriched-repos"],
    queryFn: () => fetchEnrichedRepos(),
    staleTime: 1000 * 60 * 5,
  });

  const contribQuery = useQuery<ContributionMatrix>({
    queryKey: ["github-contributions", userQuery.data?.created_at],
    queryFn: () => fetchContributions(undefined, userQuery.data?.created_at),
    enabled: !!userQuery.data,
    staleTime: 1000 * 60 * 30,
  });

  const hasError = userQuery.isError || reposQuery.isError || contribQuery.isError;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-6 pt-28 pb-20">
        {/* Header */}
        <div className="flex items-end justify-between gap-4 flex-wrap mb-10">
          <div>
            <p className="text-sm font-mono text-accent mb-3">
              {t("github.label")}
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
              {t("github.title")}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <RateLimitIndicator />
            <a
              href={`https://github.com/${import.meta.env.VITE_GITHUB_USERNAME || "umutykaya"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github size={18} />
              {t("github.viewProfile")}
            </a>
          </div>
        </div>

        {/* Global error */}
        {hasError && (
          <div className="mb-8 p-4 rounded-xl border border-destructive/30 bg-destructive/5 flex items-center gap-3">
            <p className="text-sm text-destructive flex-1">
              {t("github.errors.fetchFailed")}
            </p>
            <button
              onClick={() => {
                userQuery.refetch();
                reposQuery.refetch();
                contribQuery.refetch();
              }}
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
            >
              <RefreshCw size={14} />
              {t("github.errors.retry")}
            </button>
          </div>
        )}

        {/* Profile Card */}
        <section className="mb-8">
          <GitHubProfileCard
            user={userQuery.data}
            isLoading={userQuery.isLoading}
          />
        </section>

        {/* Contribution Heatmap */}
        <section className="mb-8">
          <ContributionHeatmap
            data={contribQuery.data}
            isLoading={contribQuery.isLoading}
          />
        </section>

        {/* Complex Repos Table */}
        <section>
          <ComplexReposTable
            repos={reposQuery.data}
            isLoading={reposQuery.isLoading}
            dataUpdatedAt={reposQuery.dataUpdatedAt}
          />
        </section>
      </main>
    </div>
  );
};

export default GitHub;
