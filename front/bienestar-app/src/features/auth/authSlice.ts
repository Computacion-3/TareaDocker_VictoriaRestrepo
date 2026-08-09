import {
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type { AuthSession, AuthState, AuthUser, RoleName } from "../../types/auth";
import type { RootState } from "../../store/store";

const initialState: AuthState = {
  token: null,
  type: "Bearer",
  issuedAt: null,
  expiresAt: null,
  user: null,
  roles: [],
  isAuthenticated: false,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authRequestStarted: (state) => {
      state.status = "loading";
      state.error = null;
    },
    setCredentials: (state, action: PayloadAction<AuthSession>) => {
      const { token, type, issuedAt, expiresAt, user, roles } = action.payload;

      state.token = token;
      state.type = type || "Bearer";
      state.issuedAt = issuedAt || null;
      state.expiresAt = expiresAt || null;
      state.user = user;
      state.roles = roles;
      state.isAuthenticated = Boolean(token);
      state.status = "authenticated";
      state.error = null;
    },
    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
    },
    setRoles: (state, action: PayloadAction<RoleName[]>) => {
      state.roles = action.payload;
    },
    authRequestFailed: (state, action: PayloadAction<string>) => {
      state.status = "error";
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    clearAuthError: (state) => {
      state.error = null;
      if (state.status === "error") {
        state.status = state.isAuthenticated ? "authenticated" : "idle";
      }
    },
    logout: () => initialState,
  },
});

export const {
  authRequestFailed,
  authRequestStarted,
  clearAuthError,
  logout,
  setCredentials,
  setRoles,
  setUser,
} = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;
export const selectToken = (state: RootState) => state.auth.token;
export const selectUser = (state: RootState) => state.auth.user;
export const selectRoles = (state: RootState) => state.auth.roles;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated && Boolean(state.auth.token);

export default authSlice.reducer;
