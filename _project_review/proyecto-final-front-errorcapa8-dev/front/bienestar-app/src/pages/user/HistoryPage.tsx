import { useCallback } from "react";
import { Box, Typography } from "@mui/material";
import GlassCard from "../../components/common/GlassCard";
import { useApiData } from "../../hooks/useApiData";
import { getMyHistory } from "../../services/historyService";
import type { ActivityHistory, HistoryEntry } from "../../types/history";
import DataSection from "./components/DataSection";
import ResourceGrid from "./components/ResourceGrid";
import UserPage from "./components/UserPage";
import { formatDate } from "./formatters";

function HistoryPage() {
  const loadHistory = useCallback(() => getMyHistory(), []);
  const { data, error, loading } = useApiData<ActivityHistory>(loadHistory, "No pudimos cargar tu historial por ahora.");

  return (
    <UserPage
      title="Historial"
      subtitle="Consulta tu recorrido de actividad y los avances acumulados."
    >
      {data?.summary && (
        <Box className="stats-grid">
          <GlassCard variant="dashboard">
            <Typography color="text.secondary">Registros</Typography>
            <Typography className="gradient-title" variant="h4">
              {data.summary.totalProgressEntries}
            </Typography>
          </GlassCard>
          <GlassCard variant="dashboard">
            <Typography color="text.secondary">Minutos acumulados</Typography>
            <Typography className="gradient-title" variant="h4">
              {data.summary.totalMinutes}
            </Typography>
          </GlassCard>
          <GlassCard variant="dashboard">
            <Typography color="text.secondary">Ultima actividad</Typography>
            <Typography className="gradient-title" variant="h5">
              {formatDate(data.summary.lastActivityDate)}
            </Typography>
          </GlassCard>
        </Box>
      )}

      <DataSection<HistoryEntry>
        data={data?.entries}
        emptyDescription="Cuando tengas actividad registrada, aparecera aqui."
        emptyTitle="Aun no tienes historial"
        error={error}
        loading={loading}
        render={(items) => (
          <ResourceGrid
            items={items}
            renderDescription={(entry) => entry.notes || "Actividad registrada para tu bienestar."}
            renderMeta={(entry) => (
              <Typography color="text.secondary" variant="body2">
                {formatDate(entry.date)} · {entry.timeMinutes ?? 0} min · {entry.effortLevel}
              </Typography>
            )}
            renderTitle={(entry) => entry.exerciseName ?? entry.routineName ?? "Actividad registrada"}
          />
        )}
      />
    </UserPage>
  );
}

export default HistoryPage;
