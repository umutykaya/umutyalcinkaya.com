import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import {
  signIn as amplifySignIn,
  signUp as amplifySignUp,
  signOut as amplifySignOut,
  confirmSignUp,
  getCurrentUser,
  fetchAuthSession,
  fetchUserAttributes,
} from "aws-amplify/auth";

interface User {
  username: string;
  email: string;
  name: string;
  groups: string[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  verify: (username: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      const groups =
        (session.tokens?.accessToken?.payload?.["cognito:groups"] as string[]) || [];
      const attributes = await fetchUserAttributes();

      setUser({
        username: currentUser.username,
        email: attributes.email || "",
        name: attributes.name || "",
        groups,
      });
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  const login = async (email: string, password: string) => {
    await amplifySignIn({ username: email, password });
    await checkUser();
  };

  const register = async (email: string, password: string, name: string) => {
    await amplifySignUp({
      username: email,
      password,
      options: { userAttributes: { email, name } },
    });
  };

  const verify = async (username: string, code: string) => {
    await confirmSignUp({ username, confirmationCode: code });
  };

  const logout = async () => {
    await amplifySignOut();
    setUser(null);
  };

  const isAdmin = user?.groups.includes("Admins") ?? false;

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAdmin, login, register, verify, logout, refreshUser: checkUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
