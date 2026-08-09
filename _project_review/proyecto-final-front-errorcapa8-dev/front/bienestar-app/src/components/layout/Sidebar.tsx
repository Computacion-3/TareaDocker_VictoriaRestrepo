import { Box, Typography } from "@mui/material";
import GlassCard from "../common/GlassCard";
import Badge from "../common/Badge";

const navigationPreview = [
  "Dashboard",
  "Rutinas",
  "Ejercicios",
  "Progreso",
  "Eventos",
];

function Sidebar() {
  return (
    <GlassCard
      className="glass-nav"
      sx={{
        position: { md: "sticky" },
        top: 20,
        height: { md: "calc(100vh - 40px)" },
      }}
    >
      <Typography variant="h5">Fitness Icesi</Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">
        Navegación base preparada para roles.
      </Typography>
      <Box sx={{ display: "grid", gap: 1.2, mt: 3 }}>
        {navigationPreview.map((item) => (
          <Box
            key={item}
            sx={{
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 2,
              px: 1.5,
              py: 1,
              color: "text.secondary",
            }}
          >
            {item}
          </Box>
        ))}
      </Box>
      <Box sx={{ mt: 3 }}>
        <Badge label="Base Fase 9" tone="info" />
      </Box>
    </GlassCard>
  );
}

export default Sidebar;
