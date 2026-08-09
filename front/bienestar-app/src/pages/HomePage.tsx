import { Box, Typography } from "@mui/material";
import Badge from "../components/common/Badge";
import GlassCard from "../components/common/GlassCard";
import PageHeader from "../components/layout/PageHeader";

function HomePage() {
  return (
    <Box className="page-shell">
      <PageHeader
        title="Bienestar Fitness Icesi"
        subtitle="Base visual Liquid Glass preparada para integrar los módulos por rol."
        actions={<Badge label="Fase 9" tone="info" />}
      />
      <div className="glass-grid">
        <GlassCard>
          <Typography variant="h5">Arquitectura lista</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Componentes, layouts, estilos y assets quedaron preparados para crecer por fases.
          </Typography>
        </GlassCard>
        <GlassCard>
          <Typography variant="h5">API real documentada</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            El frontend queda apuntando al context path actual del backend.
          </Typography>
        </GlassCard>
      </div>
    </Box>
  );
}

export default HomePage;
