import { useCallback, useState } from "react";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { Alert, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AppButton from "../../components/common/AppButton";
import ErrorMessage from "../../components/common/ErrorMessage";
import GlassCard from "../../components/common/GlassCard";
import { useApiData } from "../../hooks/useApiData";
import { getAvailableExercises } from "../../services/exerciseService";
import {
  adoptRoutineTemplate,
  getMyRoutines,
  getRoutineTemplates,
} from "../../services/routineService";
import type { Exercise } from "../../types/exercise";
import type { Routine } from "../../types/routine";
import DataSection from "./components/DataSection";
import ResourceGrid from "./components/ResourceGrid";
import RoutineEditForm from "./components/RoutineEditForm";
import RoutineExercisePicker from "./components/RoutineExercisePicker";
import UserPage from "./components/UserPage";

interface RoutinePageData {
  exercises: Exercise[];
  personal: Routine[];
  templates: Routine[];
}

function RoutinesPage() {
  const navigate = useNavigate();
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const loadRoutines = useCallback(async (): Promise<RoutinePageData> => {
    const [personal, templates, exercises] = await Promise.all([
      getMyRoutines(),
      getRoutineTemplates(),
      getAvailableExercises(),
    ]);

    return { exercises, personal, templates };
  }, []);

  const { data, error, loading, reload } = useApiData(loadRoutines, "No pudimos cargar tus rutinas por ahora.");

  const handleAdopt = async (templateId: number) => {
    try {
      setActionError(null);
      setActionSuccess(null);
      await adoptRoutineTemplate(templateId);
      setActionSuccess("Rutina adoptada correctamente.");
      await reload();
    } catch {
      setActionError("No se pudo adoptar la rutina.");
    }
  };

  return (
    <UserPage
      title="Mis rutinas"
      subtitle="Consulta tus planes personales y revisa rutinas predisenadas para adoptar."
      actions={
        <AppButton appVariant="secondary" onClick={() => navigate("/app/routines/new")}>
          Crear rutina
        </AppButton>
      }
    >
      {actionSuccess && <Alert severity="success">{actionSuccess}</Alert>}
      {actionError && <ErrorMessage message={actionError} />}

      {data && data.personal.length > 0 && data.exercises.length > 0 && (
        <Box className="module-grid">
          <Box>
            <Typography sx={{ mb: 2 }} variant="h5">
              Agregar ejercicio a rutina
            </Typography>
            <RoutineExercisePicker
              exercises={data.exercises}
              routines={data.personal}
              onAdded={reload}
            />
          </Box>
          <Box>
            <Typography sx={{ mb: 2 }} variant="h5">
              Editar rutina
            </Typography>
            <RoutineEditForm routines={data.personal} onUpdated={reload} />
          </Box>
        </Box>
      )}

      <DataSection<Routine>
        data={data?.personal}
        emptyDescription="Crea una rutina o adopta una rutina predisenada para empezar."
        emptyTitle="Aun no tienes rutinas"
        error={error}
        loading={loading}
        render={(items) => (
          <ResourceGrid
            items={items}
            renderDescription={(routine) => routine.description}
            renderMeta={(routine) => (
              <Typography color="text.secondary" variant="body2">
                {routine.exerciseDetails?.length ?? routine.exercises?.length ?? 0} ejercicios
              </Typography>
            )}
            renderTitle={(routine) => routine.name}
          />
        )}
      />

      <Box>
        <Box sx={{ alignItems: "center", display: "flex", gap: 1.5, mb: 2 }}>
          <AutoAwesomeIcon sx={{ color: "#bfdbfe" }} />
          <Typography variant="h5">Rutinas predisenadas</Typography>
        </Box>
        {data?.templates && data.templates.length > 0 ? (
          <ResourceGrid
            items={data.templates}
            renderDescription={(routine) => routine.description}
            renderMeta={(routine) => (
              <Box sx={{ alignItems: "center", display: "flex", justifyContent: "space-between", gap: 2 }}>
                <Typography color="text.secondary" variant="body2">
                  Creada por {routine.createdByName ?? "Bienestar"}
                </Typography>
                <AppButton appVariant="secondary" onClick={() => void handleAdopt(routine.id)}>
                  Adoptar rutina
                </AppButton>
              </Box>
            )}
            renderTitle={(routine) => routine.name}
          />
        ) : (
          <GlassCard variant="dashboard" sx={{ alignItems: "center", display: "flex", gap: 1.5 }}>
            <AddCircleOutlinedIcon sx={{ color: "#bfdbfe" }} />
            <Typography color="text.secondary">
              Las rutinas predisenadas disponibles apareceran en este espacio.
            </Typography>
          </GlassCard>
        )}
      </Box>
    </UserPage>
  );
}

export default RoutinesPage;
