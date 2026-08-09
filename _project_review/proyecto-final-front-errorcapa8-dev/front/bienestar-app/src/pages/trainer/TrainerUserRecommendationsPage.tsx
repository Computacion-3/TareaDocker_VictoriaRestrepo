import { useCallback } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import AppButton from "../../components/common/AppButton";
import GlassCard from "../../components/common/GlassCard";
import { useApiData } from "../../hooks/useApiData";
import { getAssignedUserRecommendations } from "../../services/trainerService";
import type { Recommendation } from "../../types/recommendation";
import TrainerDataSection from "./components/TrainerDataSection";
import TrainerPage from "./components/TrainerPage";
import { formatDateTime } from "./formatters";

function TrainerUserRecommendationsPage() {
  const { userId } = useParams();
  const numericUserId = Number(userId);
  const navigate = useNavigate();
  const loadRecommendations = useCallback(
    () => getAssignedUserRecommendations(numericUserId),
    [numericUserId]
  );
  const { data, error, loading } = useApiData(loadRecommendations, "No pudimos cargar las recomendaciones del usuario.");

  return (
    <TrainerPage
      title="Recomendaciones del usuario"
      subtitle="Consulta las orientaciones asociadas al estudiante asignado."
      actions={
        <AppButton appVariant="secondary" onClick={() => navigate(`/trainer/recommendations/new?userId=${numericUserId}`)}>
          Crear recomendacion
        </AppButton>
      }
    >
      <TrainerDataSection<Recommendation>
        data={data}
        emptyDescription="Aun no hay recomendaciones para este usuario."
        emptyTitle="Sin recomendaciones"
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
                  {recommendation.trainerName} - {formatDateTime(recommendation.createdAt)}
                </Typography>
              </GlassCard>
            ))}
          </Box>
        )}
      />
    </TrainerPage>
  );
}

export default TrainerUserRecommendationsPage;
