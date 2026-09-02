import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { authApi } from "@/lib/api";

const TOKEN_KEY = "weathermap.token";
const USER_KEY = "weathermap.user";

export type AuthUser = { name?: string; email?: string };

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  ready: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  // Carrega token/usuário do localStorage ao iniciar
  useEffect(() => {
    const stored = window.localStorage.getItem(TOKEN_KEY);
    const storedUser = window.localStorage.getItem(USER_KEY);
    if (stored) setToken(stored);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser) as AuthUser);
      } catch {
        /* ignore malformed cache */
      }
    }
    setReady(true);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    if (response?.access_token) {
      const authUser = { email };
      window.localStorage.setItem(TOKEN_KEY, response.access_token);
      window.localStorage.setItem(USER_KEY, JSON.stringify(authUser));
      setToken(response.access_token);
      setUser(authUser);
    } else {
      throw new Error("Credenciais inválidas");
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const response = await authApi.register(name, email, password);
    if (response?.access_token) {
      const authUser = { name, email };
      window.localStorage.setItem(TOKEN_KEY, response.access_token);
      window.localStorage.setItem(USER_KEY, JSON.stringify(authUser));
      setToken(response.access_token);
      setUser(authUser);
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    await authApi.resetPassword(email);
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      ready,
      isAuthenticated: Boolean(token),
      login,
      register,
      resetPassword,
      logout,
    }),
    [token, user, ready, login, register, resetPassword, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
}
