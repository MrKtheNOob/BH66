import axios, {
  AxiosHeaders,
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

let accessToken: string | null = null;
let refreshFn: (() => Promise<string | null>) | null = null;

const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/",
  // Needed so the HttpOnly refresh cookie is sent to /auth/refresh and /auth/logout.
  withCredentials: true,
});

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function setRefreshHandler(handler: (() => Promise<string | null>) | null) {
  refreshFn = handler;
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessToken) {
    const headers = AxiosHeaders.from(config.headers);
    headers.set("Authorization", `Bearer ${accessToken}`);
    config.headers = headers;
  }
  return config;
});

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

// Retry once after a 401 by refreshing the access token, then replaying the request.
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const original = error.config as RetryableConfig | undefined;
    const requestPath = original?.url?.replace(/^\/+/, "") ?? "";
    const isAuthRoute = requestPath.startsWith("auth/");

    if (status === 401 && original && !original._retry && refreshFn && !isAuthRoute) {
      original._retry = true;
      try {
        const newToken = await refreshFn();
        if (newToken) {
          const headers = AxiosHeaders.from(original.headers);
          headers.set("Authorization", `Bearer ${newToken}`);
          original.headers = headers;
          return api.request(original);
        }
      } catch {
        // let caller handle final unauth state
      }
    }

    return Promise.reject(error);
  }
);

export default api;
