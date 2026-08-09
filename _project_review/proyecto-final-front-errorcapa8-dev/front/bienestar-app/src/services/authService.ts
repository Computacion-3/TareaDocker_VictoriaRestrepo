import api from "./api";
import type { AuthUser, LoginRequest, LoginResponse } from "../types/auth";

export const login = async ({
  email,
  password,
}: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login", {
    email,
    password,
  });

  return response.data;
};

export const loginRequest = login;

export const me = async (token?: string): Promise<AuthUser> => {
  const response = await api.get<AuthUser>("/auth/me", {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
  });

  return response.data;
};

export const logoutLocal = () => undefined;
