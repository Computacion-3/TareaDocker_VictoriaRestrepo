import { Typography } from "@mui/material";
import GlassCard from "./GlassCard";

interface EmptyStateProps {
  title: string;
  description?: string;
}

function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <GlassCard sx={{ textAlign: "center" }}>
      <Typography variant="h6">{title}</Typography>
      {description && (
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          {description}
        </Typography>
      )}
    </GlassCard>
  );
}

export default EmptyState;
