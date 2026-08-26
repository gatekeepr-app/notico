import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { getDeviceName } from "../../lib/deviceName";
import { clearStoredToken, getStoredToken, setStoredToken } from "../../lib/authToken";

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
  loginWithCode: (code: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  signup: async () => {},
  login: async () => {},
  loginWithCode: async () => {},
  logout: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(getStoredToken);
  const [loading, setLoading] = useState(true);
  const signupMutation = useMutation(api.auth.signup);
  const loginMutation = useMutation(api.auth.login);
  const claimCode = useMutation(api.pairing.claim);
  const logoutMutation = useMutation(api.auth.logout);
  const me = useQuery(api.auth.me, token ? { token } : "skip");

  useEffect(() => {
    if (me !== undefined || !token) setLoading(false);
  }, [me, token]);

  const signup = useCallback(async (email: string, password: string, name?: string) => {
    const result = await signupMutation({ email, password, name, deviceName: getDeviceName() });
    setStoredToken(result.token);
    setToken(result.token);
  }, [signupMutation]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginMutation({ email, password, deviceName: getDeviceName() });
    setStoredToken(result.token);
    setToken(result.token);
  }, [loginMutation]);

  const loginWithCode = useCallback(async (code: string) => {
    const result = await claimCode({ code: code.trim().toUpperCase(), deviceName: getDeviceName() });
    setStoredToken(result.token);
    setToken(result.token);
  }, [claimCode]);

  const logout = useCallback(async () => {
    if (token) await logoutMutation({ token });
    clearStoredToken();
    setToken(null);
  }, [token, logoutMutation]);

  return (
    <AuthContext.Provider value={{ user: me ?? null, token, loading, signup, login, loginWithCode, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
