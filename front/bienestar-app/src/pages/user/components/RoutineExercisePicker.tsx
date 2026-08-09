import { useState } from "react";
import { Alert, Box } from "@mui/material";
import AppButton from "../../../components/common/AppButton";
import AppInput from "../../../components/common/AppInput";
import AppSelect from "../../../components/common/AppSelect";
import ErrorMessage from "../../../components/common/ErrorMessage";
import GlassCard from "../../../components/common/GlassCard";
import { addExerciseToRoutine } from "../../../services/routineService";
import type { Exercise } from "../../../types/exercise";
import type { Routine } from "../../../types/routine";

interface RoutineExercisePickerProps {
  exercises: Exercise[];
  routines: Routine[];
  onAdded: () => Promise<void>;
}

const toOptionalNumber = (value: string) => value ? Number(value) : undefined;

function RoutineExercisePicker({
  exercises,
  routines,
  onAdded,
}: RoutineExercisePickerProps) {
  const [routineId, setRoutineId] = useState("");
  const [exerciseId, setExerciseId] = useState("");
  const [sets, setSets] = useState("");
  const [repetitions, setRepetitions] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!routineId || !exerciseId) {
      setError("Selecciona una rutina y un ejercicio para continuar.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      await addExerciseToRoutine(Number(routineId), {
        duration: toOptionalNumber(duration),
        exerciseId: Number(exerciseId),
        notes: notes.trim() || undefined,
        repetitions: toOptionalNumber(repetitions),
        sets: toOptionalNumber(sets),
      });
      setExerciseId("");
      setSets("");
      setRepetitions("");
      setDuration("");
      setNotes("");
      setSuccess("Ejercicio agregado a la rutina.");
      await onAdded();
    } catch {
      setError("No se pudo agregar el ejercicio a la rutina.");
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
          onChange={(event) => setRoutineId(event.target.value)}
        />
        <AppSelect
          label="Ejercicio"
          value={exerciseId}
          options={exercises.map((exercise) => ({ label: exercise.name, value: String(exercise.id) }))}
          onChange={(event) => setExerciseId(event.target.value)}
        />
        <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" } }}>
          <AppInput label="Series" type="number" value={sets} onChange={(event) => setSets(event.target.value)} />
          <AppInput label="Repeticiones" type="number" value={repetitions} onChange={(event) => setRepetitions(event.target.value)} />
          <AppInput label="Duracion" type="number" value={duration} onChange={(event) => setDuration(event.target.value)} />
        </Box>
        <AppInput label="Notas" value={notes} onChange={(event) => setNotes(event.target.value)} />
        <AppButton disabled={submitting} sx={{ mt: 2 }} type="submit">
          {submitting ? "Agregando" : "Agregar a rutina"}
        </AppButton>
      </Box>
    </GlassCard>
  );
}

export default RoutineExercisePicker;
