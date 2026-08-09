import { Box, Typography } from "@mui/material";
import AppButton from "../../components/common/AppButton";
import GlassCard from "../../components/common/GlassCard";

function NotFoundPage() {
  return (
    <Box className="page-shell">
      <GlassCard sx={{ maxWidth: 640, mx: "auto", textAlign: "center" }}>
        <Typography variant="h3">Página no encontrada</Typography>
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          La ruta solicitada no existe dentro de la aplicación.
        </Typography>
        <AppButton href="/" sx={{ mt: 3 }}>
          Ir al inicio
        </AppButton>
      </GlassCard>
    </Box>
  );
}

export default NotFoundPage;
