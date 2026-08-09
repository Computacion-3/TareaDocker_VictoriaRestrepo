import type { AxiosError } from "axios";
import { login, me } from "../../services/authService";
import type { ApiError } from "../../types/api";
import type { AuthSession, AuthUser, LoginRequest } from "../../types/auth";
import { getHomePathByRole, normalizeRoles } from "../../utils/roleUtils";
import type { AppThunk } from "../../store/store";
import {
  authRequestFailed,
  authRequestStarted,
  logout,
  setCredentials,
  setRoles,
  setUser,
} from "./authSlice";

function getErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<ApiError>;
  const status = axiosError.response?.status;
  const message = axiosError.response?.data?.message;

  if (message) {
    return message;
  }

  if (status === 401) {
    return "Credenciales invalidas.";
  }

  if (status === 400) {
    return "Revisa el correo institucional y la informacion ingresada.";
  }

  if (!axiosError.response) {
    return "No fue posible conectar con el backend.";
  }

  return "No fue posible iniciar sesion.";
}

export const loginThunk =
  (credentials: LoginRequest): AppThunk<Promise<AuthSession>> =>
  async (dispatch) => {
    dispatch(authRequestStarted());

    try {
      const response = await login(credentials);
      const user = response.user ?? await me(response.token);
      const roles = normalizeRoles(response.roles ?? [user.roleName]);
      const session: AuthSession = {
        token: response.token,
        type: response.type ?? "Bearer",
        issuedAt: response.issuedAt ?? null,
        expiresAt: response.expiresAt ?? null,
        user,
        roles,
      };

      dispatch(setCredentials(session));

      return session;
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch(authRequestFailed(message));
      throw new Error(message, { cause: error });
    }
  };

export const fetchMeThunk =
  (): AppThunk<Promise<AuthUser>> =>
  async (dispatch, getState) => {
    const { token } = getState().auth;

    if (!token) {
      dispatch(logout());
      throw new Error("No hay sesion activa.");
    }

    const user = await me();
    dispatch(setUser(user));
    dispatch(setRoles(normalizeRoles([user.roleName])));

    return user;
  };

export const logoutThunk =
  (): AppThunk<string> =>
  (dispatch, getState) => {
    const homePath = getHomePathByRole(getState().auth.roles);
    dispatch(logout());

    return homePath;
  };
