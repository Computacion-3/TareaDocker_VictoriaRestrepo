import { useCallback } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AppButton from "../../components/common/AppButton";
import GlassCard from "../../components/common/GlassCard";
import { useApiData } from "../../hooks/useApiData";
import { getAssignedUserRecommendations, getMyAssignedUsers } from "../../services/trainerService";
import type { Recommendation } from "../../types/recommendation";
import TrainerDataSection from "./components/TrainerDataSection";
import TrainerPage from "./components/TrainerPage";
import { formatDateTime } from "./formatters";

function TrainerRecommendationsPage() {
  const navigate = useNavigate();
  const loadRecommendations = useCallback(async (): Promise<Recommendation[]> => {
    const users = await getMyAssignedUsers();
    const recommendationGroups = await Promise.all(
      users.map((user) => getAssignedUserRecommendations(user.id))
    );

    return recommendationGroups.flat();
  }, []);
  const { data, error, loading } = useApiData(loadRecommendations, "No pudimos cargar las recomendaciones.");

  return (
    <TrainerPage
      title="Recomendaciones"
      subtitle="Consulta orientaciones enviadas a tus usuarios asignados."
      actions={
        <AppButton appVariant="secondary" onClick={() => navigate("/trainer/recommendations/new")}>
          Crear recomendacion
        </AppButton>
      }
    >
      <TrainerDataSection<Recommendation>
        data={data}
        emptyDescription="Cuando envies recomendaciones, apareceran aqui."
        emptyTitle="No hay recomendaciones disponibles por ahora"
        error={error}
        loading={loading}
        render={(items) => (
          <Box className="module-grid">
            {items.map((recommendation) => (
              <GlassCard key={recommendation.id} variant="dashboard">
                <Typography variant="h5">{recommendation.title}</Typography>
                <Typography color="text.secondary" sx={{ mt: 1, lineHeight: 1.6 }}>
                  {recommendation.message}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 2 }} variant="body2">
                  Para {recommendation.targetUserName} - {formatDateTime(recommendation.createdAt)}
                </Typography>
              </GlassCard>
            ))}
          </Box>
        )}
      />
    </TrainerPage>
  );
}

export default TrainerRecommendationsPage;
