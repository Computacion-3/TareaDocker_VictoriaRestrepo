import type { ReactNode } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import GlassCard from "../../../components/common/GlassCard";

export interface UserCardOption {
  label: string;
  to: string;
}

interface UserActionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  summary: string;
  options: UserCardOption[];
}

function UserActionCard({
  title,
  description,
  icon,
  summary,
  options,
}: UserActionCardProps) {
  return (
    <GlassCard
      variant="dashboard"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        minHeight: 260,
      }}
    >
      <Box sx={{ alignItems: "flex-start", display: "flex", gap: 1.5 }}>
        <Box
          aria-hidden="true"
          sx={{
            alignItems: "center",
            background: "linear-gradient(135deg, rgba(59, 130, 246, 0.22), rgba(34, 211, 238, 0.12))",
            border: "1px solid rgba(96, 165, 250, 0.24)",
            borderRadius: "var(--radius-sm)",
            color: "#bfdbfe",
            display: "flex",
            flexShrink: 0,
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
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h5">{title}</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.75, lineHeight: 1.55 }}>
            {description}
          </Typography>
        </Box>
      </Box>

      <Typography
        sx={{
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "var(--radius-sm)",
          color: "rgba(255, 255, 255, 0.72)",
          px: 1.5,
          py: 1,
        }}
        variant="body2"
      >
        {summary}
      </Typography>

      <Box sx={{ mt: "auto" }}>
        {options.map((option) => (
          <Box
            component={RouterLink}
            key={`${title}-${option.label}`}
            sx={{
              alignItems: "center",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              color: "rgba(255, 255, 255, 0.82)",
              display: "flex",
              justifyContent: "space-between",
              py: 1.05,
              textDecoration: "none",
              transition: "color 0.2s ease, padding-left 0.2s ease",
              "&:hover": {
                color: "#bfdbfe",
                pl: 0.5,
              },
            }}
            to={option.to}
          >
            <Typography variant="body2">{option.label}</Typography>
            <ArrowForwardIcon sx={{ fontSize: 16, opacity: 0.72 }} />
          </Box>
        ))}
      </Box>
    </GlassCard>
  );
}

export default UserActionCard;
