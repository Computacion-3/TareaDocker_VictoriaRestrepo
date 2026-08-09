import { useState } from "react";
import { Alert, Box } from "@mui/material";
import AppButton from "../../../components/common/AppButton";
import AppInput from "../../../components/common/AppInput";
import AppSelect from "../../../components/common/AppSelect";
import AppTextarea from "../../../components/common/AppTextarea";
import ErrorMessage from "../../../components/common/ErrorMessage";
import GlassCard from "../../../components/common/GlassCard";
import { updateRoutine } from "../../../services/routineService";
import type { Routine, RoutineExerciseRequest } from "../../../types/routine";

interface RoutineEditFormProps {
  routines: Routine[];
  onUpdated: () => Promise<void>;
}

const preserveExercises = (routine: Routine): RoutineExerciseRequest[] => {
  if (routine.exerciseDetails && routine.exerciseDetails.length > 0) {
    return routine.exerciseDetails
      .filter((detail) => detail.exerciseId)
      .map((detail, index) => ({
        duration: detail.duration ?? undefined,
        exerciseId: detail.exerciseId as number,
        notes: detail.notes ?? undefined,
        orderIndex: detail.orderIndex ?? index + 1,
        repetitions: detail.repetitions ?? undefined,
        sets: detail.sets ?? undefined,
      }));
  }

  return (routine.exercises ?? []).map((exercise, index) => ({
    exerciseId: exercise.id,
    orderIndex: index + 1,
  }));
};

function RoutineEditForm({ routines, onUpdated }: RoutineEditFormProps) {
  const [routineId, setRoutineId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const selectedRoutine = routines.find((routine) => routine.id === Number(routineId));

  const handleRoutineChange = (value: string) => {
    const routine = routines.find((item) => item.id === Number(value));

    setRoutineId(value);
    setName(routine?.name ?? "");
    setDescription(routine?.description ?? "");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedRoutine || !name.trim() || !description.trim()) {
      setError("Selecciona una rutina y completa sus datos para continuar.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      await updateRoutine(selectedRoutine.id, {
        description: description.trim(),
        exerciseDetails: preserveExercises(selectedRoutine),
        name: name.trim(),
      });
      setSuccess("Rutina actualizada correctamente.");
      await onUpdated();
    } catch {
      setError("No se pudo actualizar la rutina.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <GlassCard variant="dashboard">
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error && <ErrorMessage message={error} />}
      <Box component="form" onSubmit={handleSubmit}>
        <AppSelect
          label="Rutina"
          value={routineId}
          options={routines.map((routine) => ({ label: routine.name, value: String(routine.id) }))}
          onChange={(event) => handleRoutineChange(event.target.value)}
        />
        <AppInput
          label="Nombre"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
        <AppTextarea
          label="Descripcion"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
        />
        <AppButton disabled={submitting} sx={{ mt: 2 }} type="submit">
          {submitting ? "Guardando" : "Actualizar rutina"}
        </AppButton>
      </Box>
    </GlassCard>
  );
}

export default RoutineEditForm;
