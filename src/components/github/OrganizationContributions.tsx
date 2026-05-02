import { useTranslation } from "react-i18next";
import { Building2, ExternalLink, GitCommit } from "lucide-react";
import type { OrgContribution } from "@/types/github";

interface OrganizationContributionsProps {
  data: OrgContribution[] | undefined;
  isLoading: boolean;
}

const OrganizationContributions = ({
  data,
  isLoading,
}: OrganizationContributionsProps) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="p-6 rounded-2xl border border-border/50 bg-card">
        <div className="h-5 w-48 bg-secondary rounded animate-pulse mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-border/50 bg-background/40 animate-pulse"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-secondary" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 bg-secondary rounded" />
                  <div className="h-3 w-16 bg-secondary rounded" />
                </div>
              </div>
              <div className="h-3 w-full bg-secondary rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="p-6 rounded-2xl border border-border/50 bg-card">
      <div className="flex items-center gap-2 mb-5">
        <Building2 size={18} className="text-accent" />
        <h3 className="text-lg font-semibold text-foreground">
          {t("github.organizations.title")}
        </h3>
        <span className="text-xs text-muted-foreground tabular-nums ml-auto">
          {data.length}{" "}
          {data.length === 1
            ? t("github.organizations.org")
            : t("github.organizations.orgs")}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map(({ org, totalContributions, repos }) => (
          <a
            key={org.login}
            href={org.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-4 rounded-xl border border-border/50 bg-background/40 hover:bg-background/80 hover:border-accent/40 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <img
                src={org.avatar_url}
                alt={org.login}
                loading="lazy"
                className="w-10 h-10 rounded-lg border border-border/50"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-foreground truncate">
                    @{org.login}
                  </span>
                  <ExternalLink
                    size={12}
                    className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  />
                </div>
                {totalContributions > 0 && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <GitCommit size={11} />
                    <span className="tabular-nums">{totalContributions}</span>
                    <span>
                      {t("github.organizations.contributionsLastYear")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {org.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                {org.description}
              </p>
            )}

            {repos.length > 0 && (
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-mono">
                  {t("github.organizations.topRepos")}
                </p>
                {repos.slice(0, 3).map((r) => (
                  <div
                    key={r.name}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-foreground/80 truncate">
                      {r.name}
                    </span>
                    <span className="text-muted-foreground tabular-nums shrink-0 ml-2">
                      {r.contributions}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </a>
        ))}
      </div>
    </div>
  );
};

export default OrganizationContributions;
