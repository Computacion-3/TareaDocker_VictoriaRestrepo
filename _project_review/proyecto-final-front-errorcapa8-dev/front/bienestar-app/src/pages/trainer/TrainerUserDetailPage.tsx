import { useCallback } from "react";
import BarChartIcon from "@mui/icons-material/BarChart";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import HistoryIcon from "@mui/icons-material/History";
import InsightsIcon from "@mui/icons-material/Insights";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import EmptyState from "../../components/common/EmptyState";
import ErrorMessage from "../../components/common/ErrorMessage";
import GlassCard from "../../components/common/GlassCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useApiData } from "../../hooks/useApiData";
import { getMyAssignedUsers } from "../../services/trainerService";
import type { User } from "../../types/user";
import TrainerActionCard from "./components/TrainerActionCard";
import TrainerPage from "./components/TrainerPage";

function TrainerUserDetailPage() {
  const { userId } = useParams();
  const numericUserId = Number(userId);
  const loadUsers = useCallback(() => getMyAssignedUsers(), []);
  const { data, error, loading } = useApiData(loadUsers, "No pudimos cargar el usuario asignado.");
  const user: User | undefined = data?.find((item) => item.id === numericUserId);

  if (loading) {
    return (
      <TrainerPage title="Detalle de usuario" subtitle="Consulta el resumen del estudiante asignado.">
        <LoadingSpinner label="Cargando informacion" />
      </TrainerPage>
    );
  }

  if (error) {
    return (
      <TrainerPage title="Detalle de usuario" subtitle="Consulta el resumen del estudiante asignado.">
        <ErrorMessage message={error} />
      </TrainerPage>
    );
  }

  if (!user) {
    return (
      <TrainerPage title="Detalle de usuario" subtitle="Consulta el resumen del estudiante asignado.">
        <EmptyState
          title="Usuario no disponible"
          description="No encontramos este usuario dentro de tus asignaciones."
        />
      </TrainerPage>
    );
  }

  return (
    <TrainerPage
      title={user.name}
      subtitle="Resumen de seguimiento del usuario asignado."
    >
      <GlassCard variant="dashboard">
        <Typography variant="h5">Informacion basica</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          {user.email}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">
          {user.active ? "Usuario activo" : "Usuario inactivo"}
        </Typography>
      </GlassCard>

      <Box className="module-grid">
        <TrainerActionCard
          description="Consulta los planes de entrenamiento asociados al usuario."
          icon={<FitnessCenterIcon />}
          options={[{ label: "Ver rutinas", to: `/trainer/users/${user.id}/routines` }]}
          summary="Rutinas disponibles para revision"
          title="Rutinas"
        />
        <TrainerActionCard
          description="Revisa los registros de avance del usuario."
          icon={<InsightsIcon />}
          options={[{ label: "Ver progreso", to: `/trainer/users/${user.id}/progress` }]}
          summary="Seguimiento de actividad"
          title="Progreso"
        />
        <TrainerActionCard
          description="Consulta el recorrido de actividad en el tiempo."
          icon={<HistoryIcon />}
          options={[{ label: "Ver historial", to: `/trainer/users/${user.id}/history` }]}
          summary="Historial de actividad"
          title="Historial"
        />
        <TrainerActionCard
          description="Revisa indicadores semanales y mensuales."
          icon={<BarChartIcon />}
          options={[{ label: "Ver estadisticas", to: `/trainer/users/${user.id}/stats` }]}
          summary="Indicadores de bienestar"
          title="Estadisticas"
        />
        <TrainerActionCard
          description="Consulta o envia orientaciones al usuario."
          icon={<TipsAndUpdatesIcon />}
          options={[
            { label: "Ver recomendaciones", to: `/trainer/users/${user.id}/recommendations` },
            { label: "Crear recomendacion", to: `/trainer/recommendations/new?userId=${user.id}` },
          ]}
          summary="Orientaciones para el usuario"
          title="Recomendaciones"
        />
      </Box>
    </TrainerPage>
  );
}

export default TrainerUserDetailPage;
