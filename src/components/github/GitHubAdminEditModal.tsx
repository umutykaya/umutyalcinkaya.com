import { useState, useEffect } from "react";
import { Pencil, Loader2, Check, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { updateUserProfile, updateRepo } from "@/services/githubService";
import type { GitHubUser, GitHubRepo } from "@/types/github";

// ── Profile edit ──────────────────────────────────────────────────

interface EditProfileTarget {
  type: "profile";
  user: GitHubUser;
}

// ── Repo edit ──────────────────────────────────────────────────────

interface EditRepoTarget {
  type: "repo";
  repo: GitHubRepo;
}

export type AdminEditTarget = EditProfileTarget | EditRepoTarget;

interface GitHubAdminEditModalProps {
  target: AdminEditTarget | null;
  adminToken: string;
  onClose: () => void;
  onSaved: (target: AdminEditTarget) => void;
}

const GitHubAdminEditModal = ({
  target,
  adminToken,
  onClose,
  onSaved,
}: GitHubAdminEditModalProps) => {
  const [bio, setBio] = useState("");
  const [repoName, setRepoName] = useState("");
  const [repoDesc, setRepoDesc] = useState("");
  const [repoHomepage, setRepoHomepage] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Reset fields whenever the target changes
  useEffect(() => {
    if (!target) return;
    setError(null);
    setSaved(false);
    if (target.type === "profile") {
      setBio(target.user.bio ?? "");
    } else {
      setRepoName(target.repo.name);
      setRepoDesc(target.repo.description ?? "");
      setRepoHomepage(target.repo.homepage ?? "");
    }
  }, [target]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target) return;

    setIsSaving(true);
    setError(null);

    try {
      if (target.type === "profile") {
        await updateUserProfile(adminToken, { bio: bio || null });
      } else {
        const [owner] = target.repo.full_name.split("/");
        await updateRepo(adminToken, owner, target.repo.name, {
          name: repoName || undefined,
          description: repoDesc || null,
          homepage: repoHomepage || null,
        });
      }
      setSaved(true);
      setTimeout(() => {
        onSaved(target);
        setSaved(false);
      }, 800);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Save failed. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const title =
    target?.type === "profile"
      ? "Edit Profile"
      : `Edit Repo: ${target?.repo.name ?? ""}`;

  const description =
    target?.type === "profile"
      ? "Update your GitHub profile description (bio)."
      : "Update the repository name, description, and website link.";

  return (
    <Dialog open={!!target} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-mono text-base">
            <Pencil size={15} className="text-accent" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="mt-4 space-y-4">
          {target?.type === "profile" && (
            <Field label="Bio / Description">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                maxLength={160}
                placeholder="A short bio about you…"
                className="w-full px-3 py-2 rounded-lg border border-border/50 bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 transition resize-none"
              />
              <span className="text-xs text-muted-foreground text-right block">
                {bio.length}/160
              </span>
            </Field>
          )}

          {target?.type === "repo" && (
            <>
              <Field label="Repository Name">
                <input
                  type="text"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                  placeholder="my-awesome-repo"
                  className="w-full px-3 py-2 rounded-lg border border-border/50 bg-background text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 transition"
                />
              </Field>
              <Field label="Description">
                <textarea
                  value={repoDesc}
                  onChange={(e) => setRepoDesc(e.target.value)}
                  rows={2}
                  maxLength={350}
                  placeholder="A short description of this repository…"
                  className="w-full px-3 py-2 rounded-lg border border-border/50 bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 transition resize-none"
                />
                <span className="text-xs text-muted-foreground text-right block">
                  {repoDesc.length}/350
                </span>
              </Field>
              <Field label="Website / Homepage URL">
                <input
                  type="url"
                  value={repoHomepage}
                  onChange={(e) => setRepoHomepage(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 rounded-lg border border-border/50 bg-background text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 transition"
                />
              </Field>
            </>
          )}

          {error && (
            <div className="flex items-center gap-2 text-xs text-destructive px-1">
              <AlertCircle size={12} />
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || saved}
              className="flex items-center gap-2 px-4 py-1.5 text-sm rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {saved ? (
                <>
                  <Check size={14} />
                  Saved!
                </>
              ) : isSaving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving…
                </>
              ) : (
                "Save changes"
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// ── Small helper ───────────────────────────────────────────────────

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
      {label}
    </label>
    {children}
  </div>
);

export default GitHubAdminEditModal;
