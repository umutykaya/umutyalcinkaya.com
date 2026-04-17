import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Star,
  GitFork,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import type { GitHubRepo, SortField, SortDirection } from "@/types/github";
import ComplexityBadge from "./ComplexityBadge";
import LanguageBar from "./LanguageBar";

interface ComplexReposTableProps {
  repos: GitHubRepo[] | undefined;
  isLoading: boolean;
  dataUpdatedAt: number;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#dea584",
  Java: "#b07219",
  "C#": "#178600",
  Ruby: "#701516",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Dart: "#00B4AB",
  HCL: "#844FBA",
};

function formatSize(kb: number): string {
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`;
  return `${kb} KB`;
}

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const ComplexReposTable = ({
  repos,
  isLoading,
  dataUpdatedAt,
}: ComplexReposTableProps) => {
  const { t } = useTranslation();
  const [sortField, setSortField] = useState<SortField>("complexity_score");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const sorted = repos
    ? [...repos].sort((a, b) => {
        let av: number | string;
        let bv: number | string;

        if (sortField === "name") {
          av = a.name.toLowerCase();
          bv = b.name.toLowerCase();
        } else {
          av = (a[sortField] as number) ?? 0;
          bv = (b[sortField] as number) ?? 0;
        }

        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      })
    : [];

  const SortButton = ({
    field,
    children,
  }: {
    field: SortField;
    children: React.ReactNode;
  }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
    >
      {children}
      {sortField === field ? (
        sortDir === "desc" ? (
          <ChevronDown size={12} />
        ) : (
          <ChevronUp size={12} />
        )
      ) : (
        <ArrowUpDown size={10} className="opacity-40" />
      )}
    </button>
  );

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
        <div className="p-6">
          <div className="h-5 w-48 bg-secondary rounded animate-pulse mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-12 bg-secondary rounded animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!repos || repos.length === 0) {
    return (
      <div className="rounded-2xl border border-border/50 bg-card p-12 text-center">
        <AlertCircle className="mx-auto mb-3 text-muted-foreground" size={32} />
        <p className="text-muted-foreground">{t("github.repos.empty")}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border/30">
        <h3 className="text-sm font-medium text-foreground">
          {t("github.repos.title")}{" "}
          <span className="text-muted-foreground tabular-nums">
            ({repos.length})
          </span>
        </h3>
        {dataUpdatedAt > 0 && (
          <span className="text-[10px] text-muted-foreground">
            {t("github.repos.lastFetched")} {timeAgo(dataUpdatedAt)}
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-left px-4 py-3">
                <SortButton field="name">
                  {t("github.repos.name")}
                </SortButton>
              </th>
              <th className="text-left px-4 py-3 hidden lg:table-cell">
                <span className="text-xs font-medium text-muted-foreground">
                  {t("github.repos.language")}
                </span>
              </th>
              <th className="text-right px-4 py-3">
                <SortButton field="stargazers_count">
                  <Star size={12} />
                </SortButton>
              </th>
              <th className="text-right px-4 py-3 hidden sm:table-cell">
                <SortButton field="forks_count">
                  <GitFork size={12} />
                </SortButton>
              </th>
              <th className="text-right px-4 py-3 hidden md:table-cell">
                <SortButton field="size">
                  {t("github.repos.size")}
                </SortButton>
              </th>
              <th className="text-right px-4 py-3">
                <SortButton field="complexity_score">
                  {t("github.repos.complexity")}
                </SortButton>
              </th>
              <th className="w-10 px-2" />
            </tr>
          </thead>
          {sorted.map((repo) => {
              const isExpanded = expandedId === repo.id;
              const langCount = repo.languages
                ? Object.keys(repo.languages).length
                : 0;

              return (
                <tbody key={repo.id}>
                  <tr
                    className="border-b border-border/20 hover:bg-secondary/30 transition-colors cursor-pointer"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : repo.id)
                    }
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-medium text-foreground truncate">
                          {repo.name}
                        </span>
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink size={12} />
                        </a>
                      </div>
                      {repo.description && (
                        <p className="text-xs text-muted-foreground truncate max-w-xs mt-0.5">
                          {repo.description}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {repo.language ? (
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <span
                            className="inline-block w-2 h-2 rounded-full"
                            style={{
                              backgroundColor:
                                LANGUAGE_COLORS[repo.language] ?? "#8b8b8b",
                            }}
                          />
                          {repo.language}
                          {langCount > 1 && (
                            <span className="opacity-60 tabular-nums">
                              +{langCount - 1}
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground opacity-50">
                          Unknown
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                      {repo.stargazers_count}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted-foreground hidden sm:table-cell">
                      {repo.forks_count}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted-foreground text-xs hidden md:table-cell">
                      {formatSize(repo.size)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {repo.complexity_tier && repo.complexity_score != null && (
                        <ComplexityBadge
                          tier={repo.complexity_tier}
                          score={repo.complexity_score}
                        />
                      )}
                    </td>
                    <td className="px-2 py-3 text-muted-foreground">
                      {isExpanded ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      )}
                    </td>
                  </tr>
                  {isExpanded && repo.languages && (
                    <tr className="bg-secondary/20">
                      <td colSpan={7} className="px-4 py-4">
                        <div className="max-w-2xl">
                          <div className="flex flex-wrap gap-4 mb-3 text-xs text-muted-foreground">
                            <span>
                              {t("github.repos.openIssues")}:{" "}
                              <span className="tabular-nums font-medium">
                                {repo.open_issues_count}
                              </span>
                            </span>
                            <span>
                              {t("github.repos.size")}:{" "}
                              <span className="tabular-nums font-medium">
                                {formatSize(repo.size)}
                              </span>
                            </span>
                            <span>
                              {t("github.repos.languages")}:{" "}
                              <span className="tabular-nums font-medium">
                                {langCount}
                              </span>
                            </span>
                          </div>
                          <LanguageBar languages={repo.languages} />
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              );
            })}
        </table>
      </div>
    </div>
  );
};

export default ComplexReposTable;
