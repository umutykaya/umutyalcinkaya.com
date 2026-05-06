import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Github, RefreshCw } from "lucide-react";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import BackToHome from "@/components/BackToHome";
import GitHubProfileCard from "@/components/github/GitHubProfileCard";
import ContributionHeatmap from "@/components/github/ContributionHeatmap";
import ActivityOverview from "@/components/github/ActivityOverview";
import ComplexReposTable from "@/components/github/ComplexReposTable";
import OrganizationContributions from "@/components/github/OrganizationContributions";
import RateLimitIndicator from "@/components/github/RateLimitIndicator";
import GitHubAdminAuth from "@/components/github/GitHubAdminAuth";
import GitHubAdminEditModal from "@/components/github/GitHubAdminEditModal";
import type { AdminEditTarget, AdminSaveResult } from "@/components/github/GitHubAdminEditModal";
import {
  fetchGitHubUser,
  fetchEnrichedRepos,
  fetchStarredRepos,
  fetchContributions,
  fetchOrgContributions,
  deleteRepo,
} from "@/services/githubService";
import type {
  GitHubUser,
  GitHubRepo,
  ContributionMatrix,
  OrgContribution,
} from "@/types/github";

const GitHub = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // ── Admin state ──────────────────────────────────────────────────
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [adminScopes, setAdminScopes] = useState<string[]>([]);
  const [editTarget, setEditTarget] = useState<AdminEditTarget | null>(null);

  const handleAuthenticated = (_token: string, result: { user: GitHubUser; scopes: string[] }) => {
    setAdminToken(_token);
    setAdminScopes(result.scopes);
  };

  const handleLogout = () => {
    setAdminToken(null);
    setAdminScopes([]);
    setEditTarget(null);
  };

  const applyRepoUpdate = (prev: GitHubRepo[] | undefined, result: Extract<AdminSaveResult, { type: "repo" }>) =>
    prev?.map((r) =>
      r.id === result.repoId
        ? {
            ...r,
            name: result.name,
            full_name: r.full_name.replace(/\/[^/]+$/, `/${result.name}`),
            description: result.description || null,
            homepage: result.homepage || null,
          }
        : r,
    ) ?? [];

  const handleSaved = (result: AdminSaveResult) => {
    setEditTarget(null);
    if (result.type === "profile") {
      queryClient.setQueryData<GitHubUser>(["github-user"], (prev) =>
        prev ? { ...prev, bio: result.bio || null } : prev,
      );
    } else if (result.type === "repo") {
      queryClient.setQueryData<GitHubRepo[]>(
        ["github-enriched-repos", adminToken],
        (prev) => applyRepoUpdate(prev, result),
      );
    }
  };

  const handleDeleteRepo = async (repo: GitHubRepo) => {
    if (!adminToken) return;
    const [owner] = repo.full_name.split("/");
    await deleteRepo(adminToken, owner, repo.name);
    queryClient.setQueryData<GitHubRepo[]>(
      ["github-enriched-repos", adminToken],
      (prev) => prev?.filter((r) => r.id !== repo.id) ?? [],
    );
  };

  const userQuery = useQuery<GitHubUser>({
    queryKey: ["github-user"],
    queryFn: () => fetchGitHubUser(),
    staleTime: 1000 * 60 * 10,
  });

  const reposQuery = useQuery<GitHubRepo[]>({
    queryKey: ["github-enriched-repos", adminToken],
    queryFn: () => fetchEnrichedRepos(undefined, adminToken ?? undefined),
    staleTime: 1000 * 60 * 5,
  });

  const starredQuery = useQuery<GitHubRepo[]>({
    queryKey: ["github-starred-repos", adminToken],
    queryFn: () => fetchStarredRepos(undefined, adminToken ?? undefined),
    staleTime: 1000 * 60 * 10,
  });

  const contribQuery = useQuery<ContributionMatrix>({
    queryKey: ["github-contributions", adminToken],
    queryFn: () => fetchContributions(undefined, adminToken ?? undefined),
    staleTime: 1000 * 60 * 30,
  });

  const orgsQuery = useQuery<OrgContribution[]>({
    queryKey: ["github-org-contributions", adminToken],
    queryFn: () => fetchOrgContributions(undefined, adminToken ?? undefined),
    staleTime: 1000 * 60 * 30,
  });

  const hasError =
    userQuery.isError ||
    reposQuery.isError ||
    starredQuery.isError ||
    contribQuery.isError ||
    orgsQuery.isError;

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <div className="relative z-10">
      <Navbar />

      <main className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <BackToHome />
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
            <GitHubAdminAuth
              isAuthenticated={!!adminToken}
              onAuthenticated={handleAuthenticated}
              onLogout={handleLogout}
            />
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
                starredQuery.refetch();
                contribQuery.refetch();
                orgsQuery.refetch();
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
            isAdmin={!!adminToken}
            onEditProfile={() =>
              userQuery.data &&
              setEditTarget({ type: "profile", user: userQuery.data })
            }
          />
        </section>

        {/* Contribution Heatmap */}
        <section className="mb-8">
          <ContributionHeatmap
            data={contribQuery.data}
            isLoading={contribQuery.isLoading}
          />
        </section>

        {/* Activity Overview */}
        <section className="mb-8">
          <ActivityOverview
            data={contribQuery.data}
            isLoading={contribQuery.isLoading}
          />
        </section>

        {/* Organization Contributions */}
        <section className="mb-8">
          <OrganizationContributions
            data={orgsQuery.data}
            isLoading={orgsQuery.isLoading}
          />
        </section>

        {/* Complex Repos Table */}
        <section>
          <ComplexReposTable
            repos={reposQuery.data}
            isLoading={reposQuery.isLoading}
            dataUpdatedAt={reposQuery.dataUpdatedAt}
            isAdmin={!!adminToken}
            canDeleteRepo={adminScopes.includes("delete_repo")}
            onEditRepo={(repo) => setEditTarget({ type: "repo", repo })}
            onDeleteRepo={handleDeleteRepo}
          />
        </section>

        {/* Starred Repositories */}
        <section className="mt-8">
          <ComplexReposTable
            repos={starredQuery.data}
            isLoading={starredQuery.isLoading}
            dataUpdatedAt={starredQuery.dataUpdatedAt}
            title={t("github.repos.starredTitle")}
            emptyText={t("github.repos.starredEmpty")}
          />
        </section>

        {/* Admin edit modal */}
        {adminToken && (
          <GitHubAdminEditModal
            target={editTarget}
            adminToken={adminToken}
            onClose={() => setEditTarget(null)}
            onSaved={handleSaved}
          />
        )}
        </div>
      </main>
      </div>
    </div>
  );
};

export default GitHub;
