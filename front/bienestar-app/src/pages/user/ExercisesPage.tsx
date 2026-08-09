import { useCallback } from "react";
import { Typography } from "@mui/material";
import { useApiData } from "../../hooks/useApiData";
import { getAvailableExercises } from "../../services/exerciseService";
import type { Exercise } from "../../types/exercise";
import DataSection from "./components/DataSection";
import ExerciseCreateForm from "./components/ExerciseCreateForm";
import ResourceGrid from "./components/ResourceGrid";
import UserPage from "./components/UserPage";

function ExercisesPage() {
  const loadExercises = useCallback(() => getAvailableExercises(), []);
  const { data, error, loading, reload } = useApiData(loadExercises, "No pudimos cargar tus ejercicios por ahora.");

  return (
    <UserPage
      title="Ejercicios"
      subtitle="Explora ejercicios disponibles y prepara movimientos personalizados para tu entrenamiento."
    >
      <ExerciseCreateForm onCreated={() => void reload()} />

      <DataSection<Exercise>
        data={data}
        emptyDescription="Cuando tengas ejercicios disponibles, apareceran aqui."
        emptyTitle="Aun no hay ejercicios disponibles"
        error={error}
        loading={loading}
        render={(items) => (
          <ResourceGrid
            items={items}
            renderDescription={(exercise) => exercise.description}
            renderMeta={(exercise) => (
              <Typography color="text.secondary" variant="body2">
                {exercise.type} · {exercise.difficulty}
                {exercise.duration ? ` · ${exercise.duration} min` : ""}
              </Typography>
            )}
            renderTitle={(exercise) => exercise.name}
          />
        )}
      />
    </UserPage>
  );
}

export default ExercisesPage;
