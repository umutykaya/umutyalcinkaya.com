import { useTranslation } from "react-i18next";
import { MapPin, Users, BookOpen, ExternalLink } from "lucide-react";
import type { GitHubUser } from "@/types/github";

interface GitHubProfileCardProps {
  user: GitHubUser | undefined;
  isLoading: boolean;
}

const GitHubProfileCard = ({ user, isLoading }: GitHubProfileCardProps) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex items-center gap-6 p-6 rounded-2xl border border-border/50 bg-card animate-pulse">
        <div className="w-20 h-20 rounded-full bg-secondary shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-5 w-40 bg-secondary rounded" />
          <div className="h-4 w-64 bg-secondary rounded" />
          <div className="h-3 w-32 bg-secondary rounded" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 rounded-2xl border border-border/50 bg-card">
      <img
        src={user.avatar_url}
        alt={user.name ?? user.login}
        className="w-20 h-20 rounded-full border-2 border-border/50"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-xl font-semibold text-foreground truncate">
            {user.name ?? user.login}
          </h2>
          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink size={14} />
          </a>
        </div>

        {user.bio && (
          <p className="text-sm text-muted-foreground mb-3">{user.bio}</p>
        )}

        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          {user.location && (
            <span className="flex items-center gap-1">
              <MapPin size={12} />
              {user.location}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Users size={12} />
            <span className="tabular-nums">{user.followers}</span>{" "}
            {t("github.profile.followers")}
            <span className="text-border mx-1">·</span>
            <span className="tabular-nums">{user.following}</span>{" "}
            {t("github.profile.following")}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen size={12} />
            <span className="tabular-nums">{user.public_repos}</span>{" "}
            {t("github.profile.repos")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GitHubProfileCard;
