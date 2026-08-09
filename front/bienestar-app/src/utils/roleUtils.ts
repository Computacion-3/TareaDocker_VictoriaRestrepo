import type { RoleName } from "../types/auth";

const rolePriority: RoleName[] = ["ADMIN", "TRAINER", "USER"];

export function normalizeRole(role: string): RoleName | null {
  const normalized = role.replace("ROLE_", "").replace("ENTRENADOR", "TRAINER").toUpperCase();

  if (normalized === "ADMIN" || normalized === "TRAINER" || normalized === "USER") {
    return normalized;
  }

  return null;
}

export function normalizeRoles(roles: Array<string | undefined | null>): RoleName[] {
  const normalizedRoles = roles
    .map((role) => (role ? normalizeRole(role) : null))
    .filter((role): role is RoleName => role !== null);

  return Array.from(new Set(normalizedRoles));
}

export function hasRole(userRoles: RoleName[], allowedRoles: RoleName[]): boolean {
  if (allowedRoles.length === 0) {
    return true;
  }

  return userRoles.some((role) => allowedRoles.includes(role));
}

export function getPrimaryRole(roles: RoleName[]): RoleName | null {
  return rolePriority.find((role) => roles.includes(role)) ?? null;
}

export function getHomePathByRole(roles: RoleName[]): string {
  const primaryRole = getPrimaryRole(roles);

  if (primaryRole === "ADMIN") {
    return "/admin";
  }

  if (primaryRole === "TRAINER") {
    return "/trainer";
  }

  if (primaryRole === "USER") {
    return "/app";
  }

  return "/login";
}
