import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredGroup?: string;
}

const ProtectedRoute = ({ children, requiredGroup }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredGroup && !user.groups.includes(requiredGroup)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
