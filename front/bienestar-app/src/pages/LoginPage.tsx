import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";

import AppButton from "../components/common/AppButton";
import AppInput from "../components/common/AppInput";
import ErrorMessage from "../components/common/ErrorMessage";
import AuthLayout from "../components/layout/AuthLayout";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { loginThunk } from "../features/auth/authThunks";
import {
  clearAuthError,
  selectAuthError,
  selectAuthStatus,
  selectIsAuthenticated,
  selectRoles,
} from "../store/authSlice";
import { getHomePathByRole } from "../utils/roleUtils";

function LoginPage() {
  const dispatch = useAppDispatch();
  const authError = useAppSelector(selectAuthError);
  const authStatus = useAppSelector(selectAuthStatus);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const currentRoles = useAppSelector(selectRoles);

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [formError, setFormError] =
    useState("");

  const loading = authStatus === "loading";

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    dispatch(clearAuthError());

    if (!email.trim()) {
      setFormError("El correo es obligatorio.");
      return;
    }

    if (!password) {
      setFormError("La contrasena es obligatoria.");
      return;
    }

    if (!email.trim().toLowerCase().endsWith("@icesi.edu.co")) {
      setFormError("Usa tu correo institucional @icesi.edu.co.");
      return;
    }

    try {
      await dispatch(loginThunk({
        email: email.trim(),
        password,
      }));
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "No fue posible iniciar sesion.");
    }
  };

  if (isAuthenticated) {
    return <Navigate replace to={getHomePathByRole(currentRoles)} />;
  }

  return (
    <AuthLayout
      title="Bienestar"
      subtitle="Ingresa a tu entorno universitario"
    >
      <Box
        component="form"
        noValidate
        onSubmit={handleLogin}
        sx={{ display: "grid", gap: 1.5 }}
      >
        {(formError || authError) && (
          <ErrorMessage message={formError || authError || ""} />
        )}

        <AppInput
          autoComplete="email"
          label="Correo electronico"
          placeholder="tu@universidad.edu"
          required
          type="email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
        />

        <AppInput
          autoComplete="current-password"
          label="Contrasena"
          placeholder="********"
          required
          type="password"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
        />

        <AppButton
          disabled={loading}
          fullWidth
          sx={{ mt: 1, minHeight: 48 }}
          type="submit"
        >
          {loading ? (
            <Box sx={{ alignItems: "center", display: "flex", gap: 1 }}>
              <CircularProgress color="inherit" size={18} />
              Ingresando
            </Box>
          ) : (
            "Iniciar sesion"
          )}
        </AppButton>

        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            gap: 1.5,
            mt: 1.5,
          }}
        >
          <Box
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.12)",
              flex: 1,
              height: 1,
            }}
          />
          <Typography color="text.secondary" variant="caption">
            Bienestar Icesi
          </Typography>
          <Box
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.12)",
              flex: 1,
              height: 1,
            }}
          />
        </Box>
      </Box>
    </AuthLayout>
  );
}

export default LoginPage;
