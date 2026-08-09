import { useCallback } from "react";
import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import GlassCard from "../../components/common/GlassCard";
import { useApiData } from "../../hooks/useApiData";
import { getAvailableExercises } from "../../services/exerciseService";
import { getAssignedUserProgress, getAssignedUserRoutines } from "../../services/trainerService";
import type { Exercise } from "../../types/exercise";
import type { ProgressEntry } from "../../types/progress";
import type { Routine } from "../../types/routine";
import TrainerDataSection from "./components/TrainerDataSection";
import TrainerPage from "./components/TrainerPage";
import TrainerUserProgressForm from "./components/TrainerUserProgressForm";
import { formatDate } from "./formatters";

interface TrainerUserProgressData {
  exercises: Exercise[];
  progress: ProgressEntry[];
  routines: Routine[];
}

const mergeExercises = (available: Exercise[], routines: Routine[]): Exercise[] => {
  const byId = new Map<number, Exercise>();

  available.forEach((exercise) => byId.set(exercise.id, exercise));
  routines.forEach((routine) => {
    (routine.exercises ?? []).forEach((exercise) => byId.set(exercise.id, exercise));
  });

  return Array.from(byId.values());
};

function TrainerUserProgressPage() {
  const { userId } = useParams();
  const numericUserId = Number(userId);
  const loadProgress = useCallback(async (): Promise<TrainerUserProgressData> => {
    const [progress, routines, availableExercises] = await Promise.all([
      getAssignedUserProgress(numericUserId),
      getAssignedUserRoutines(numericUserId),
      getAvailableExercises(),
    ]);

    return {
      exercises: mergeExercises(availableExercises, routines),
      progress,
      routines,
    };
  }, [numericUserId]);
  const { data, error, loading, reload } = useApiData(loadProgress, "No pudimos cargar el progreso del usuario.");

  return (
    <TrainerPage
      title="Progreso del usuario"
      subtitle="Revisa y registra avances del estudiante asignado."
    >
      {data && (
        <TrainerUserProgressForm
          exercises={data.exercises}
          routines={data.routines}
          userId={numericUserId}
          onCreated={reload}
        />
      )}

      <TrainerDataSection<ProgressEntry>
        data={data?.progress}
        emptyDescription="Este usuario no tiene registros todavia."
        emptyTitle="Sin registros de progreso"
        error={error}
        loading={loading}
        render={(items) => (
          <Box className="module-grid">
            {items.map((entry) => (
              <GlassCard key={entry.id} variant="dashboard">
                <Typography variant="h5">{entry.exerciseName ?? entry.routineName ?? "Registro de progreso"}</Typography>
                <Typography color="text.secondary" sx={{ mt: 1, lineHeight: 1.6 }}>
                  {entry.notes || "Actividad registrada para seguimiento."}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 2 }} variant="body2">
                  {formatDate(entry.date)} - {entry.timeMinutes ?? 0} min - {entry.effortLevel}
                </Typography>
              </GlassCard>
            ))}
          </Box>
        )}
      />
    </TrainerPage>
  );
}

export default TrainerUserProgressPage;
