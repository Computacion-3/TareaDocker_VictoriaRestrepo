import { useCallback } from "react";
import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import GlassCard from "../../components/common/GlassCard";
import { useApiData } from "../../hooks/useApiData";
import { getMonthlyStatsByUser, getWeeklyStatsByUser } from "../../services/statsService";
import type { UserStats } from "../../types/stats";
import TrainerDataSection from "./components/TrainerDataSection";
import TrainerPage from "./components/TrainerPage";
import { formatDate } from "./formatters";

interface TrainerStatsData {
  monthly: UserStats;
  weekly: UserStats;
}

function TrainerUserStatsPage() {
  const { userId } = useParams();
  const numericUserId = Number(userId);
  const loadStats = useCallback(async (): Promise<TrainerStatsData> => {
    const [weekly, monthly] = await Promise.all([
      getWeeklyStatsByUser(numericUserId),
      getMonthlyStatsByUser(numericUserId),
    ]);

    return { monthly, weekly };
  }, [numericUserId]);
  const { data, error, loading } = useApiData(loadStats, "No pudimos cargar las estadisticas del usuario.");
  const summaries = data ? [data.weekly, data.monthly] : [];

  return (
    <TrainerPage
      title="Estadisticas del usuario"
      subtitle="Revisa indicadores semanales y mensuales del estudiante asignado."
    >
      {data && (
        <Box className="stats-grid">
          <GlassCard variant="dashboard">
            <Typography color="text.secondary">Minutos semanales</Typography>
            <Typography className="gradient-title" variant="h4">{data.weekly.totalMinutes}</Typography>
          </GlassCard>
          <GlassCard variant="dashboard">
            <Typography color="text.secondary">Registros semanales</Typography>
            <Typography className="gradient-title" variant="h4">{data.weekly.totalProgressEntries}</Typography>
          </GlassCard>
          <GlassCard variant="dashboard">
            <Typography color="text.secondary">Minutos mensuales</Typography>
            <Typography className="gradient-title" variant="h4">{data.monthly.totalMinutes}</Typography>
          </GlassCard>
        </Box>
      )}
      <TrainerDataSection<UserStats>
        data={summaries}
        emptyDescription="Cuando el usuario registre actividad, sus indicadores apareceran aqui."
        emptyTitle="Sin estadisticas disponibles"
        error={error}
        loading={loading}
        render={(items) => (
          <Box className="module-grid">
            {items.map((stats) => (
              <GlassCard key={stats.period} variant="dashboard">
                <Typography variant="h5">{stats.period === "weekly" ? "Resumen semanal" : "Resumen mensual"}</Typography>
                <Typography color="text.secondary" sx={{ mt: 1, lineHeight: 1.6 }}>
                  {stats.totalProgressEntries} registros, {stats.totalMinutes} minutos y {stats.totalRepetitions} repeticiones.
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 2 }} variant="body2">
                  {formatDate(stats.startDate)} a {formatDate(stats.endDate)}
                </Typography>
              </GlassCard>
            ))}
          </Box>
        )}
      />
    </TrainerPage>
  );
}

export default TrainerUserStatsPage;
