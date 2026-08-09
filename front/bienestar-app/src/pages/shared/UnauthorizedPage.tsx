import { Box, Typography } from "@mui/material";
import AppButton from "../../components/common/AppButton";
import GlassCard from "../../components/common/GlassCard";

function UnauthorizedPage() {
  return (
    <Box className="page-shell">
      <GlassCard sx={{ maxWidth: 640, mx: "auto", textAlign: "center" }}>
        <Typography variant="h3">Acceso restringido</Typography>
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          Tu cuenta no tiene permisos para acceder a esta vista.
        </Typography>
        <AppButton href="/" sx={{ mt: 3 }}>
          Volver al inicio
        </AppButton>
      </GlassCard>
    </Box>
  );
}

export default UnauthorizedPage;
