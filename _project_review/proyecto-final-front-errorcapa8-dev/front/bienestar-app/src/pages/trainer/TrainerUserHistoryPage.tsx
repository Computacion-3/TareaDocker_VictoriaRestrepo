import { useCallback } from "react";
import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import GlassCard from "../../components/common/GlassCard";
import { useApiData } from "../../hooks/useApiData";
import { getHistoryByUser } from "../../services/historyService";
import type { ActivityHistory, HistoryEntry } from "../../types/history";
import TrainerDataSection from "./components/TrainerDataSection";
import TrainerPage from "./components/TrainerPage";
import { formatDate } from "./formatters";

function TrainerUserHistoryPage() {
  const { userId } = useParams();
  const numericUserId = Number(userId);
  const loadHistory = useCallback(() => getHistoryByUser(numericUserId), [numericUserId]);
  const { data, error, loading } = useApiData<ActivityHistory>(loadHistory, "No pudimos cargar el historial del usuario.");

  return (
    <TrainerPage
      title="Historial del usuario"
      subtitle="Consulta el recorrido de actividad del estudiante asignado."
    >
      {data?.summary && (
        <Box className="stats-grid">
          <GlassCard variant="dashboard">
            <Typography color="text.secondary">Registros</Typography>
            <Typography className="gradient-title" variant="h4">{data.summary.totalProgressEntries}</Typography>
          </GlassCard>
          <GlassCard variant="dashboard">
            <Typography color="text.secondary">Minutos acumulados</Typography>
            <Typography className="gradient-title" variant="h4">{data.summary.totalMinutes}</Typography>
          </GlassCard>
          <GlassCard variant="dashboard">
            <Typography color="text.secondary">Ultima actividad</Typography>
            <Typography className="gradient-title" variant="h5">{formatDate(data.summary.lastActivityDate)}</Typography>
          </GlassCard>
        </Box>
      )}
      <TrainerDataSection<HistoryEntry>
        data={data?.entries}
        emptyDescription="Cuando el usuario registre actividad, aparecera aqui."
        emptyTitle="Sin historial disponible"
        error={error}
        loading={loading}
        render={(items) => (
          <Box className="module-grid">
            {items.map((entry) => (
              <GlassCard key={entry.progressId} variant="dashboard">
                <Typography variant="h5">{entry.exerciseName ?? entry.routineName ?? "Actividad registrada"}</Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>{entry.notes || "Actividad de seguimiento."}</Typography>
                <Typography color="text.secondary" sx={{ mt: 2 }} variant="body2">
                  {formatDate(entry.date)} - {entry.timeMinutes ?? 0} min - {entry.effortLevel}
                </Typography>
              </GlassCard>
            ))}
          </Box>
        )}
      />
    </TrainerPage>
  );
}

export default TrainerUserHistoryPage;
