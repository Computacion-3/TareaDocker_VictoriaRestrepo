import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import GlassCard from "./GlassCard";

interface StatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  helper?: string;
}

function StatCard({
  label,
  value,
  icon,
  helper,
}: StatCardProps) {
  return (
    <GlassCard
      variant="dashboard"
      sx={{
        alignItems: "center",
        display: "flex",
        gap: 2,
        minHeight: 132,
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          alignItems: "center",
          background: "rgba(255, 255, 255, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.14)",
          borderRadius: "50%",
          color: "rgba(255, 255, 255, 0.88)",
          display: "flex",
          flexShrink: 0,
          fontWeight: 800,
          height: 52,
          justifyContent: "center",
          width: 52,
          "& svg": {
            fontSize: 26,
          },
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography color="text.secondary" sx={{ fontSize: "0.82rem" }}>
          {label}
        </Typography>
        <Typography className="gradient-title" variant="h4">
          {value}
        </Typography>
        {helper && (
          <Typography color="text.secondary" sx={{ mt: 0.5 }} variant="body2">
            {helper}
          </Typography>
        )}
      </Box>
    </GlassCard>
  );
}

export default StatCard;
