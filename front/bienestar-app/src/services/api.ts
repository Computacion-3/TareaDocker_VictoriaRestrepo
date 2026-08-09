import axios from "axios";

import { store } from "../store/store";
import { logout } from "../store/authSlice";
import { clearPersistedSession, getPersistedAuthToken } from "../utils/storage";

const configuredApiBaseUrl: unknown = import.meta.env.VITE_API_BASE_URL;
const apiBaseUrl =
  typeof configuredApiBaseUrl === "string" && configuredApiBaseUrl.length > 0
    ? configuredApiBaseUrl
    : "http://localhost:8080/api/v1";

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const { token, type } = store.getState().auth;
  const fallbackToken = getPersistedAuthToken();
  const authToken = token ?? fallbackToken;

  if (authToken) {
    config.headers.set("Authorization", `${type || "Bearer"} ${authToken}`);
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(new Error("Error inesperado del cliente HTTP."));
    }

    const status = error.response?.status;
    const currentPath = window.location.pathname;

    if (status === 401) {
      store.dispatch(logout());
      clearPersistedSession();

      if (currentPath !== "/login") {
        window.location.assign("/login");
      }
    }

    if (status === 403 && currentPath !== "/unauthorized") {
      window.location.assign("/unauthorized");
    }

    return Promise.reject(error);
  }
);

export default api;
