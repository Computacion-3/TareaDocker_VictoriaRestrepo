import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import AppButton from "./AppButton";
import GlassCard from "./GlassCard";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  status?: string;
  actionLabel?: string;
}

function ModuleCard({
  title,
  description,
  icon,
  status = "Disponible para consulta",
  actionLabel = "Ver detalle",
}: ModuleCardProps) {
  return (
    <GlassCard
      variant="dashboard"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        minHeight: 210,
      }}
    >
      <Box
        sx={{
          alignItems: "flex-start",
          display: "flex",
          gap: 1.5,
          justifyContent: "space-between",
        }}
      >
        <Box
          aria-hidden="true"
          sx={{
            alignItems: "center",
            background: "linear-gradient(135deg, rgba(59, 130, 246, 0.22), rgba(34, 211, 238, 0.12))",
            border: "1px solid rgba(96, 165, 250, 0.24)",
            borderRadius: "var(--radius-sm)",
            color: "#bfdbfe",
            display: "flex",
            fontWeight: 800,
            height: 44,
            justifyContent: "center",
            width: 44,
            "& svg": {
              fontSize: 24,
            },
          }}
        >
          {icon}
        </Box>
        <Typography
          sx={{
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "var(--radius-pill)",
            color: "rgba(255, 255, 255, 0.54)",
            fontSize: "0.72rem",
            px: 1,
            py: 0.35,
          }}
        >
          {status}
        </Typography>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h5">{title}</Typography>
        <Typography color="text.secondary" sx={{ mt: 1, lineHeight: 1.65 }}>
          {description}
        </Typography>
      </Box>
      <AppButton appVariant="secondary" disabled fullWidth>
        {actionLabel}
      </AppButton>
    </GlassCard>
  );
}

export default ModuleCard;
