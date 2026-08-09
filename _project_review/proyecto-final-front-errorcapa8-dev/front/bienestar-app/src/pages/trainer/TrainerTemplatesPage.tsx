import { useCallback } from "react";
import { Box, Typography } from "@mui/material";
import GlassCard from "../../components/common/GlassCard";
import { useApiData } from "../../hooks/useApiData";
import { getAvailableExercises } from "../../services/exerciseService";
import { createRoutineTemplate, getRoutineTemplates } from "../../services/routineService";
import type { Exercise } from "../../types/exercise";
import type { Routine } from "../../types/routine";
import RoutineForm from "../user/components/RoutineForm";
import TrainerDataSection from "./components/TrainerDataSection";
import TrainerPage from "./components/TrainerPage";

interface TemplatePageData {
  exercises: Exercise[];
  templates: Routine[];
}

function TrainerTemplatesPage() {
  const loadTemplates = useCallback(async (): Promise<TemplatePageData> => {
    const [templates, exercises] = await Promise.all([
      getRoutineTemplates(),
      getAvailableExercises(),
    ]);

    return { exercises, templates };
  }, []);
  const { data, error, loading, reload } = useApiData(loadTemplates, "No pudimos cargar las rutinas predisenadas.");

  return (
    <TrainerPage
      title="Rutinas predisenadas"
      subtitle="Consulta y crea planes reutilizables para acompanar a tus usuarios."
    >
      {data && (
        <RoutineForm
          exercises={data.exercises}
          onSubmit={async (routine) => {
            const created = await createRoutineTemplate(routine);
            await reload();
            return created;
          }}
        />
      )}
      <TrainerDataSection<Routine>
        data={data?.templates}
        emptyDescription="Cuando existan rutinas predisenadas, apareceran aqui."
        emptyTitle="Sin rutinas predisenadas"
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
                  Creada por {routine.createdByName ?? "Bienestar"}
                </Typography>
              </GlassCard>
            ))}
          </Box>
        )}
      />
    </TrainerPage>
  );
}

export default TrainerTemplatesPage;
