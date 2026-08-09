import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

function PageHeader({
  title,
  subtitle,
  actions,
}: PageHeaderProps) {
  return (
    <Box
      sx={{
        alignItems: { xs: "flex-start", sm: "center" },
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: 2,
        justifyContent: "space-between",
        mb: 3,
      }}
    >
      <Box>
        <Typography className="gradient-title" variant="h3">
          {title}
        </Typography>
        {subtitle && (
          <Typography className="muted-copy" sx={{ mt: 1 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {actions}
    </Box>
  );
}

export default PageHeader;
