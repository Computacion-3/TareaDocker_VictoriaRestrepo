import { useCallback } from "react";
import { Alert } from "@mui/material";
import AppButton from "../../components/common/AppButton";
import ErrorMessage from "../../components/common/ErrorMessage";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useApiData } from "../../hooks/useApiData";
import { getAvailableExercises } from "../../services/exerciseService";
import { createRoutine } from "../../services/routineService";
import RoutineForm from "./components/RoutineForm";
import UserPage from "./components/UserPage";

function RoutineCreatePage() {
  const loadExercises = useCallback(() => getAvailableExercises(), []);
  const { data: exercises, error, loading } = useApiData(loadExercises, "No pudimos cargar los ejercicios por ahora.");

  return (
    <UserPage
      title="Crear rutina"
      subtitle="Crea una rutina personal y agrega ejercicios si lo necesitas."
    >
      <Alert severity="info">
        Al guardar, la rutina queda asociada a tu usuario.
      </Alert>
      {loading && <LoadingSpinner label="Cargando ejercicios" />}
      {error && <ErrorMessage message={error} />}
      {exercises && <RoutineForm exercises={exercises} onSubmit={createRoutine} />}
      <AppButton appVariant="secondary" href="/app/routines" sx={{ mt: 2 }}>
        Volver a mis rutinas
      </AppButton>
    </UserPage>
  );
}

export default RoutineCreatePage;
