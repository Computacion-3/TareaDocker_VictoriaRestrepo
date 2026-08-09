import type { ReactNode } from "react";
import { Box, type SxProps, type Theme } from "@mui/material";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  variant?: "default" | "auth" | "dashboard";
  sx?: SxProps<Theme>;
}

function GlassCard({
  children,
  className = "",
  padded = true,
  variant = "default",
  sx,
}: GlassCardProps) {
  const variantClass =
    variant === "default" ? "" : `glass-card-${variant}`;

  return (
    <Box
      className={`glass-card ${variantClass} ${className}`.trim()}
      sx={{
        p: padded ? { xs: 2.5, sm: 3 } : 0,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

export default GlassCard;
