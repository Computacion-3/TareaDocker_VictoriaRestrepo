import { useCallback } from "react";
import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import GlassCard from "../../components/common/GlassCard";
import { useApiData } from "../../hooks/useApiData";
import { getRoutineTemplates } from "../../services/routineService";
import { getAssignedUserRoutines } from "../../services/trainerService";
import type { Routine } from "../../types/routine";
import TrainerAssignRoutineForm from "./components/TrainerAssignRoutineForm";
import TrainerDataSection from "./components/TrainerDataSection";
import TrainerPage from "./components/TrainerPage";

interface TrainerUserRoutinesData {
  routines: Routine[];
  templates: Routine[];
}

function TrainerUserRoutinesPage() {
  const { userId } = useParams();
  const numericUserId = Number(userId);
  const loadRoutines = useCallback(async (): Promise<TrainerUserRoutinesData> => {
    const [routines, templates] = await Promise.all([
      getAssignedUserRoutines(numericUserId),
      getRoutineTemplates(),
    ]);

    return { routines, templates };
  }, [numericUserId]);
  const { data, error, loading, reload } = useApiData(loadRoutines, "No pudimos cargar las rutinas del usuario.");

  return (
    <TrainerPage
      title="Rutinas del usuario"
      subtitle="Consulta y asigna planes de entrenamiento al usuario asignado."
    >
      {data && (
        <TrainerAssignRoutineForm
          templates={data.templates}
          userId={numericUserId}
          onAssigned={reload}
        />
      )}

      <TrainerDataSection<Routine>
        data={data?.routines}
        emptyDescription="Este usuario aun no tiene rutinas registradas."
        emptyTitle="Sin rutinas disponibles"
        error={error}
        loading={loading}
        render={(items) => (
          <Box className="module-grid">
            {items.map((routine) => (
              <GlassCard key={routine.id} variant="dashboard">
                <Typography variant="h5">{routine.name}</Typography>
                <Typography color="text.secondary" sx={{ mt: 1, lineHeight: 1.6 }}>
                  {routine.description}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 2 }} variant="body2">
                  {routine.exerciseDetails?.length ?? routine.exercises?.length ?? 0} ejercicios
                </Typography>
              </GlassCard>
            ))}
          </Box>
        )}
      />
    </TrainerPage>
  );
}

export default TrainerUserRoutinesPage;
