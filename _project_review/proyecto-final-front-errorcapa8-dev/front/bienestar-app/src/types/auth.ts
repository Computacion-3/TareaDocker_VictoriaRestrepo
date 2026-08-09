export type RoleName =
  | "ADMIN"
  | "USER"
  | "TRAINER";

export type UserRole =
  | "ADMIN"
  | "USER"
  | "TRAINER"
  | "ENTRENADOR"
  | "ROLE_ADMIN"
  | "ROLE_USER"
  | "ROLE_TRAINER"
  | "ROLE_ENTRENADOR";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  roleId?: number;
  roleName?: UserRole;
}

export type AuthStatus = "idle" | "loading" | "authenticated" | "error";

export interface AuthState {
  token: string | null;
  type: string;
  issuedAt: string | null;
  expiresAt: string | null;
  user: AuthUser | null;
  roles: RoleName[];
  isAuthenticated: boolean;
  status: AuthStatus;
  error: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export type LoginCredentials = LoginRequest;

export interface LoginResponse {
  token: string;
  type?: string;
  issuedAt?: string;
  expiresAt?: string;
  user?: AuthUser;
  roles?: UserRole[];
}

export type AuthResponse = LoginResponse;

export interface AuthSession {
  token: string;
  type?: string;
  issuedAt?: string | null;
  expiresAt?: string | null;
  user: AuthUser | null;
  roles: RoleName[];
}
