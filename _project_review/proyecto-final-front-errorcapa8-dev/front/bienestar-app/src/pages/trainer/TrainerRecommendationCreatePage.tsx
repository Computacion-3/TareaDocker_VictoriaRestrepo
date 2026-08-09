import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useApiData } from "../../hooks/useApiData";
import { getMyAssignedUsers } from "../../services/trainerService";
import type { User } from "../../types/user";
import TrainerDataSection from "./components/TrainerDataSection";
import TrainerPage from "./components/TrainerPage";
import TrainerRecommendationForm from "./components/TrainerRecommendationForm";

function TrainerRecommendationCreatePage() {
  const [searchParams] = useSearchParams();
  const initialUserId = Number(searchParams.get("userId") ?? 0) || undefined;
  const loadUsers = useCallback(() => getMyAssignedUsers(), []);
  const { data, error, loading, reload } = useApiData(loadUsers, "No pudimos cargar tus usuarios asignados.");

  return (
    <TrainerPage
      title="Crear recomendacion"
      subtitle="Envia una orientacion personalizada a un usuario asignado."
    >
      <TrainerDataSection<User>
        data={data}
        emptyDescription="Necesitas usuarios asignados para enviar recomendaciones."
        emptyTitle="Sin usuarios asignados"
        error={error}
        loading={loading}
        render={(users) => (
          <TrainerRecommendationForm
            initialUserId={initialUserId}
            users={users}
            onCreated={() => reload()}
          />
        )}
      />
    </TrainerPage>
  );
}

export default TrainerRecommendationCreatePage;
