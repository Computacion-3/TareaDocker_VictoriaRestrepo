import { useCallback } from "react";
import { Typography } from "@mui/material";
import { useApiData } from "../../hooks/useApiData";
import { getMyRecommendations } from "../../services/recommendationService";
import type { Recommendation } from "../../types/recommendation";
import DataSection from "./components/DataSection";
import ResourceGrid from "./components/ResourceGrid";
import UserPage from "./components/UserPage";
import { formatDateTime } from "./formatters";

function RecommendationsPage() {
  const loadRecommendations = useCallback(() => getMyRecommendations(), []);
  const { data, error, loading } = useApiData(loadRecommendations, "No pudimos cargar tus recomendaciones por ahora.");

  return (
    <UserPage
      title="Recomendaciones"
      subtitle="Consulta orientaciones enviadas para mejorar tu entrenamiento."
    >
      <DataSection<Recommendation>
        data={data}
        emptyDescription="No hay recomendaciones disponibles por ahora."
        emptyTitle="Sin recomendaciones"
        error={error}
        loading={loading}
        render={(items) => (
          <ResourceGrid
            items={items}
            renderDescription={(recommendation) => recommendation.message}
            renderMeta={(recommendation) => (
              <Typography color="text.secondary" variant="body2">
                {recommendation.trainerName} · {formatDateTime(recommendation.createdAt)}
              </Typography>
            )}
            renderTitle={(recommendation) => recommendation.title}
          />
        )}
      />
    </UserPage>
  );
}

export default RecommendationsPage;
