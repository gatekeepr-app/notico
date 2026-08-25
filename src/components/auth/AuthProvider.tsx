import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface AuthUser {
  userId: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  signup: async () => {},
  login: async () => {},
  logout: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("notico-token"));
  const [loading, setLoading] = useState(true);
  const signupMutation = useMutation(api.auth.signup);
  const loginMutation = useMutation(api.auth.login);
  const logoutMutation = useMutation(api.auth.logout);
  const me = useQuery(api.auth.me, token ? { token } : "skip");

  useEffect(() => {
    if (me !== undefined || !token) setLoading(false);
  }, [me, token]);

  const signup = useCallback(async (email: string, password: string, name?: string) => {
    const result = await signupMutation({ email, password, name });
    localStorage.setItem("notico-token", result.token);
    setToken(result.token);
  }, [signupMutation]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginMutation({ email, password });
    localStorage.setItem("notico-token", result.token);
    setToken(result.token);
  }, [loginMutation]);

  const logout = useCallback(async () => {
    if (token) await logoutMutation({ token });
    localStorage.removeItem("notico-token");
    setToken(null);
  }, [token, logoutMutation]);

  return (
    <AuthContext.Provider value={{ user: me ?? null, token, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
