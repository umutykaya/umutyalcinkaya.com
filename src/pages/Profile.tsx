import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, Mail, Shield, LogOut } from "lucide-react";

const Profile = () => {
  const { t } = useTranslation();
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background pt-24 px-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">{t("profile.title")}</h1>

        <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-6">
          <h2 className="text-lg font-semibold text-foreground">{t("profile.personalInfo")}</h2>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User size={18} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">{t("profile.name")}</p>
                <p className="text-foreground">{user.name || user.username}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail size={18} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">{t("profile.email")}</p>
                <p className="text-foreground">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Shield size={18} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">{t("profile.role")}</p>
                <p className="text-foreground">
                  {isAdmin ? t("profile.admin") : t("profile.user")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border text-foreground hover:bg-secondary transition-colors"
        >
          <LogOut size={16} />
          {t("profile.signOut")}
        </button>
      </div>
    </div>
  );
};

export default Profile;
