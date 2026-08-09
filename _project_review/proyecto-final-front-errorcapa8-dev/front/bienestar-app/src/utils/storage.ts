import type { AuthState } from "../types/auth";

const persistKey = "persist:bienestar";

function parseJson<T>(value: string | null): T | null {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function getPersistedAuthState(): AuthState | null {
  const persistedRoot = parseJson<Record<string, string>>(window.localStorage.getItem(persistKey));
  const authValue = persistedRoot?.auth;

  if (!authValue) {
    return null;
  }

  return parseJson<AuthState>(authValue);
}

export function getPersistedAuthToken(): string | null {
  return getPersistedAuthState()?.token ?? null;
}

export function clearPersistedSession() {
  window.localStorage.removeItem(persistKey);
}
