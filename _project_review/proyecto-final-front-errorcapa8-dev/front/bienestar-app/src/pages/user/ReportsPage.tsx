import { useState } from "react";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { Box, Typography } from "@mui/material";
import AppButton from "../../components/common/AppButton";
import ErrorMessage from "../../components/common/ErrorMessage";
import GlassCard from "../../components/common/GlassCard";
import { downloadMyProgressReport } from "../../services/reportService";
import UserPage from "./components/UserPage";

function ReportsPage() {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      setError(null);
      const blob = await downloadMyProgressReport();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "reporte-progreso-personal.pdf";
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("No pudimos preparar tu reporte por ahora.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <UserPage
      title="Reportes"
      subtitle="Descarga tu reporte personal de progreso cuando lo necesites."
    >
      {error && <ErrorMessage message={error} />}
      <GlassCard variant="dashboard" sx={{ alignItems: "center", display: "flex", gap: 2 }}>
        <PictureAsPdfIcon sx={{ color: "#bfdbfe", fontSize: 36 }} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h5">Reporte personal de progreso</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Incluye tu actividad registrada y avances principales.
          </Typography>
        </Box>
        <AppButton appVariant="secondary" disabled={downloading} onClick={handleDownload}>
          {downloading ? "Preparando" : "Descargar"}
        </AppButton>
      </GlassCard>
    </UserPage>
  );
}

export default ReportsPage;
