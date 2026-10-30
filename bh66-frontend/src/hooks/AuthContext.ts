import { createContext } from "react";
import type { AuthUser, LoginPayload, RegisterPayload } from "../types/auth";

export type AuthContextValue = {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
