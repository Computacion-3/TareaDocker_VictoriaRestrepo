import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import GlassCard from "../../../components/common/GlassCard";

interface ResourceGridProps<T> {
  items: T[];
  renderMeta?: (item: T) => ReactNode;
  renderTitle: (item: T) => string;
  renderDescription: (item: T) => string;
}

function ResourceGrid<T>({
  items,
  renderMeta,
  renderTitle,
  renderDescription,
}: ResourceGridProps<T>) {
  return (
    <Box className="module-grid">
      {items.map((item, index) => (
        <GlassCard key={index} variant="dashboard" sx={{ minHeight: 180 }}>
          <Typography variant="h5">{renderTitle(item)}</Typography>
          <Typography color="text.secondary" sx={{ mt: 1, lineHeight: 1.6 }}>
            {renderDescription(item)}
          </Typography>
          {renderMeta && (
            <Box sx={{ mt: 2 }}>
              {renderMeta(item)}
            </Box>
          )}
        </GlassCard>
      ))}
    </Box>
  );
}

export default ResourceGrid;
