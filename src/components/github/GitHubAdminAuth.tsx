import { useState } from "react";
import { KeyRound, LogOut, Loader2, ShieldCheck, Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { verifyAdminToken } from "@/services/githubService";
import type { AdminAuthResult } from "@/services/githubService";
import type { GitHubUser } from "@/types/github";

interface GitHubAdminAuthProps {
  isAuthenticated: boolean;
  onAuthenticated: (token: string, result: AdminAuthResult) => void;
  onLogout: () => void;
}

const GitHubAdminAuth = ({
  isAuthenticated,
  onAuthenticated,
  onLogout,
}: GitHubAdminAuthProps) => {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;

    setIsVerifying(true);
    setError(null);

    try {
      const result = await verifyAdminToken(token.trim());
      onAuthenticated(token.trim(), result);
      setToken("");
      setOpen(false);
    } catch {
      setError("Authentication failed. Check your token and try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    onLogout();
    setToken("");
    setError(null);
  };

  if (isAuthenticated) {
    return (
      <button
        onClick={handleLogout}
        title="Logout from admin mode"
        className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-green-500/40 bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors font-mono"
      >
        <ShieldCheck size={14} />
        Admin
        <LogOut size={12} className="opacity-70" />
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="GITHUB-2088: Admin JWT Authentication"
        className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-border/50 bg-card text-muted-foreground hover:text-foreground hover:border-border transition-colors font-mono"
      >
        <KeyRound size={14} />
        Admin: JWT Authentication
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-mono text-base">
              <KeyRound size={16} className="text-accent" />
              Admin Authentication
              <span className="text-xs text-muted-foreground font-normal ml-auto">
                GITHUB-2088
              </span>
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Enter a GitHub Personal Access Token (PAT) with{" "}
              <code className="text-xs bg-secondary px-1 py-0.5 rounded">repo</code>{" "}
              and{" "}
              <code className="text-xs bg-secondary px-1 py-0.5 rounded">user</code>{" "}
              scopes to enable editing. Add{" "}
              <code className="text-xs bg-secondary px-1 py-0.5 rounded">delete_repo</code>{" "}
              scope to also enable deletion. The token is held in memory only and
              never persisted.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="relative">
              <input
                type={showToken ? "text" : "password"}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ghp_••••••••••••••••••••••••••••••••••••"
                autoComplete="off"
                spellCheck={false}
                className="w-full px-3 py-2 pr-10 rounded-lg border border-border/50 bg-background text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 transition"
              />
              <button
                type="button"
                onClick={() => setShowToken((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showToken ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>

            {error && (
              <p className="text-xs text-destructive px-1">{error}</p>
            )}

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!token.trim() || isVerifying}
                className="flex items-center gap-2 px-4 py-1.5 text-sm rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isVerifying ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Verifying…
                  </>
                ) : (
                  <>
                    <ShieldCheck size={14} />
                    Authenticate
                  </>
                )}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GitHubAdminAuth;
