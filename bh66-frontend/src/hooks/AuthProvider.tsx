import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import api, { setAccessToken, setRefreshHandler } from "../services/api";
import type {
  AuthUser,
  LoginPayload,
  RegisterPayload,
  TokenOut,
} from "../types/auth";
import { AuthContext, type AuthContextValue } from "./AuthContext";

async function fetchCurrentUser(): Promise<AuthUser> {
  const { data } = await api.get<AuthUser>("users/me");
  return data;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessTokenState, setAccessTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const applyAccessToken = useCallback((token: string | null) => {
    setAccessTokenState(token);
    setAccessToken(token);
  }, []);

  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    try {
      const { data } = await api.post<TokenOut>("auth/refresh");
      const token = data.access_token;
      applyAccessToken(token);
      return token;
    } catch {
      applyAccessToken(null);
      setUser(null);
      return null;
    }
  }, [applyAccessToken]);

  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = await refreshAccessToken();
      if (!token) {
        setUser(null);
        return;
      }
      const currentUser = await fetchCurrentUser();
      setUser(currentUser);
    } catch {
      applyAccessToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [applyAccessToken, refreshAccessToken]);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const { data } = await api.post<TokenOut>("auth/login", {
        email: payload.email,
        password: payload.password,
      });
      applyAccessToken(data.access_token);
      const currentUser = await fetchCurrentUser();
      setUser(currentUser);
    },
    [applyAccessToken]
  );

  const register = useCallback(async (payload: RegisterPayload) => {
    await api.post("auth/register", payload);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("auth/logout");
    } finally {
      applyAccessToken(null);
      setUser(null);
    }
  }, [applyAccessToken]);

  useEffect(() => {
    setRefreshHandler(refreshAccessToken);

    return () => {
      setRefreshHandler(null);
    };
  }, [refreshAccessToken]);

  useEffect(() => {
    const initialize = async () => {
      await checkAuth();
    };

    void initialize();
  }, [checkAuth]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken: accessTokenState,
      isAuthenticated: Boolean(user && accessTokenState),
      isLoading,
      login,
      register,
      logout,
      checkAuth,
    }),
    [user, accessTokenState, isLoading, login, register, logout, checkAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
