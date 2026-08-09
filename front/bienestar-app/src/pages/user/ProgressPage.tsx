import { useCallback } from "react";
import { Typography } from "@mui/material";
import { useApiData } from "../../hooks/useApiData";
import { getAvailableExercises } from "../../services/exerciseService";
import { getMyProgress } from "../../services/progressService";
import { getMyRoutines } from "../../services/routineService";
import type { Exercise } from "../../types/exercise";
import type { ProgressEntry } from "../../types/progress";
import type { Routine } from "../../types/routine";
import DataSection from "./components/DataSection";
import ProgressForm from "./components/ProgressForm";
import ResourceGrid from "./components/ResourceGrid";
import UserPage from "./components/UserPage";
import { formatDate } from "./formatters";

interface ProgressPageData {
  exercises: Exercise[];
  progress: ProgressEntry[];
  routines: Routine[];
}

function ProgressPage() {
  const loadProgress = useCallback(async (): Promise<ProgressPageData> => {
    const [progress, routines, exercises] = await Promise.all([
      getMyProgress(),
      getMyRoutines(),
      getAvailableExercises(),
    ]);

    return { exercises, progress, routines };
  }, []);

  const { data, error, loading, reload } = useApiData(loadProgress, "No pudimos cargar tu progreso por ahora.");

  return (
    <UserPage
      title="Mi progreso"
      subtitle="Registra avances reales y revisa tus seguimientos recientes."
    >
      {data && (
        <ProgressForm
          exercises={data.exercises}
          routines={data.routines}
          onCreated={async () => {
            await reload();
          }}
        />
      )}

      <DataSection<ProgressEntry>
        data={data?.progress}
        emptyDescription="Cuando registres avances, apareceran aqui."
        emptyTitle="Aun no tienes registros"
        error={error}
        loading={loading}
        render={(items) => (
          <ResourceGrid
            items={items}
            renderDescription={(entry) => entry.notes || "Actividad registrada para tu seguimiento personal."}
            renderMeta={(entry) => (
              <Typography color="text.secondary" variant="body2">
                {formatDate(entry.date)} - {entry.exerciseName ?? entry.routineName ?? "Actividad"} - {entry.timeMinutes ?? 0} min
              </Typography>
            )}
            renderTitle={(entry) => entry.exerciseName ?? entry.routineName ?? "Registro de progreso"}
          />
        )}
      />
    </UserPage>
  );
}

export default ProgressPage;
