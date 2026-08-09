import { useCallback } from "react";
import { Box, Typography } from "@mui/material";
import GlassCard from "../../components/common/GlassCard";
import { useApiData } from "../../hooks/useApiData";
import { getMyMonthlyStats, getMyWeeklyStats } from "../../services/statsService";
import type { UserStats } from "../../types/stats";
import DataSection from "./components/DataSection";
import ResourceGrid from "./components/ResourceGrid";
import UserPage from "./components/UserPage";
import { formatDate } from "./formatters";

interface StatsPageData {
  weekly: UserStats;
  monthly: UserStats;
}

function StatsPage() {
  const loadStats = useCallback(async (): Promise<StatsPageData> => {
    const [weekly, monthly] = await Promise.all([
      getMyWeeklyStats(),
      getMyMonthlyStats(),
    ]);

    return { weekly, monthly };
  }, []);

  const { data, error, loading } = useApiData(loadStats, "No pudimos cargar tus estadisticas por ahora.");
  const summaryItems = data ? [data.weekly, data.monthly] : [];

  return (
    <UserPage
      title="Estadisticas"
      subtitle="Revisa indicadores semanales y mensuales de tu actividad."
    >
      {data && (
        <Box className="stats-grid">
          <GlassCard variant="dashboard">
            <Typography color="text.secondary">Minutos semanales</Typography>
            <Typography className="gradient-title" variant="h4">
              {data.weekly.totalMinutes}
            </Typography>
          </GlassCard>
          <GlassCard variant="dashboard">
            <Typography color="text.secondary">Registros semanales</Typography>
            <Typography className="gradient-title" variant="h4">
              {data.weekly.totalProgressEntries}
            </Typography>
          </GlassCard>
          <GlassCard variant="dashboard">
            <Typography color="text.secondary">Minutos mensuales</Typography>
            <Typography className="gradient-title" variant="h4">
              {data.monthly.totalMinutes}
            </Typography>
          </GlassCard>
        </Box>
      )}

      <DataSection<UserStats>
        data={summaryItems}
        emptyDescription="Cuando registres actividad, tus indicadores apareceran aqui."
        emptyTitle="Aun no hay estadisticas disponibles"
        error={error}
        loading={loading}
        render={(items) => (
          <ResourceGrid
            items={items}
            renderDescription={(stats) =>
              `${stats.totalProgressEntries} registros, ${stats.totalMinutes} minutos y ${stats.totalRepetitions} repeticiones.`
            }
            renderMeta={(stats) => (
              <Typography color="text.secondary" variant="body2">
                {formatDate(stats.startDate)} a {formatDate(stats.endDate)}
              </Typography>
            )}
            renderTitle={(stats) => stats.period === "weekly" ? "Resumen semanal" : "Resumen mensual"}
          />
        )}
      />
    </UserPage>
  );
}

export default StatsPage;
