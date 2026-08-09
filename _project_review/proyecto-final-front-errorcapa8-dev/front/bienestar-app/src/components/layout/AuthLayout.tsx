import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import logoIcesi from "../../assets/images/logoIcesi.png";
import GlassCard from "../common/GlassCard";
import AppBackground from "./AppBackground";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

function AuthLayout({
  title,
  subtitle,
  children,
}: AuthLayoutProps) {
  return (
    <AppBackground variant="auth">
      <Box className="auth-shell">
        <GlassCard
          variant="auth"
          sx={{
            p: { xs: 3, sm: 5 },
          }}
        >
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              justifyContent: "space-between",
              mb: 1.5,
            }}
          >
            <Typography className="gradient-title" variant="h3">
              {title}
            </Typography>
            <Box
              component="img"
              src={logoIcesi}
              alt="Universidad Icesi"
              sx={{
                filter: "brightness(0) invert(1)",
                height: { xs: 34, sm: 47 },
                objectFit: "contain",
                opacity: 0.92,
                width: "auto",
              }}
            />
          </Box>
          {subtitle && (
            <Typography color="text.secondary" sx={{ mb: 3 }} variant="body2">
              {subtitle}
            </Typography>
          )}
          {children}
        </GlassCard>
      </Box>
    </AppBackground>
  );
}

export default AuthLayout;
