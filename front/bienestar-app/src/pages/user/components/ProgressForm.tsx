import { useState } from "react";
import { Alert, Box } from "@mui/material";
import AppButton from "../../../components/common/AppButton";
import AppInput from "../../../components/common/AppInput";
import AppSelect from "../../../components/common/AppSelect";
import AppTextarea from "../../../components/common/AppTextarea";
import ErrorMessage from "../../../components/common/ErrorMessage";
import GlassCard from "../../../components/common/GlassCard";
import { createProgress } from "../../../services/progressService";
import type { Exercise } from "../../../types/exercise";
import type { ProgressEntry } from "../../../types/progress";
import type { Routine } from "../../../types/routine";

interface ProgressFormProps {
  exercises: Exercise[];
  routines: Routine[];
  onCreated: (progress: ProgressEntry) => Promise<void>;
}

const today = () => new Date().toISOString().slice(0, 10);
const toOptionalNumber = (value: string) => value ? Number(value) : undefined;

function ProgressForm({
  exercises,
  routines,
  onCreated,
}: ProgressFormProps) {
  const [date, setDate] = useState(today());
  const [periodType, setPeriodType] = useState("DAILY");
  const [routineId, setRoutineId] = useState("");
  const [exerciseId, setExerciseId] = useState("");
  const [timeMinutes, setTimeMinutes] = useState("");
  const [repetitions, setRepetitions] = useState("");
  const [weight, setWeight] = useState("");
  const [effortLevel, setEffortLevel] = useState("Medio");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!date || !effortLevel.trim()) {
      setError("Completa fecha y esfuerzo para continuar.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      const created = await createProgress({
        date,
        effortLevel,
        exerciseId: exerciseId ? Number(exerciseId) : undefined,
        notes: notes.trim() || undefined,
        periodType,
        repetitions: toOptionalNumber(repetitions),
        routineId: routineId ? Number(routineId) : undefined,
        timeMinutes: toOptionalNumber(timeMinutes),
        weight: toOptionalNumber(weight),
      });
      setDate(today());
      setRoutineId("");
      setExerciseId("");
      setTimeMinutes("");
      setRepetitions("");
      setWeight("");
      setEffortLevel("Medio");
      setNotes("");
      setSuccess("Progreso registrado correctamente.");
      await onCreated(created);
    } catch {
      setError("No se pudo registrar el progreso.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <GlassCard variant="dashboard">
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error && <ErrorMessage message={error} />}
      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" } }}>
          <AppInput label="Fecha" type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
          <AppSelect
            label="Tipo de seguimiento"
            value={periodType}
            options={[
              { label: "Diario", value: "DAILY" },
              { label: "Semanal", value: "WEEKLY" },
              { label: "Mensual", value: "MONTHLY" },
            ]}
            onChange={(event) => setPeriodType(event.target.value)}
          />
        </Box>
        <AppSelect
          label="Rutina"
          value={routineId}
          options={[{ label: "Sin rutina especifica", value: "" }, ...routines.map((routine) => ({ label: routine.name, value: String(routine.id) }))]}
          onChange={(event) => setRoutineId(event.target.value)}
        />
        <AppSelect
          label="Ejercicio"
          value={exerciseId}
          options={[{ label: "Sin ejercicio especifico", value: "" }, ...exercises.map((exercise) => ({ label: exercise.name, value: String(exercise.id) }))]}
          onChange={(event) => setExerciseId(event.target.value)}
        />
        <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" } }}>
          <AppInput label="Minutos" type="number" value={timeMinutes} onChange={(event) => setTimeMinutes(event.target.value)} />
          <AppInput label="Repeticiones" type="number" value={repetitions} onChange={(event) => setRepetitions(event.target.value)} />
          <AppInput label="Peso" type="number" value={weight} onChange={(event) => setWeight(event.target.value)} />
        </Box>
        <AppSelect
          label="Esfuerzo"
          value={effortLevel}
          options={[
            { label: "Bajo", value: "Bajo" },
            { label: "Medio", value: "Medio" },
            { label: "Alto", value: "Alto" },
          ]}
          onChange={(event) => setEffortLevel(event.target.value)}
        />
        <AppTextarea label="Observaciones" value={notes} onChange={(event) => setNotes(event.target.value)} />
        <AppButton disabled={submitting} sx={{ mt: 2 }} type="submit">
          {submitting ? "Guardando" : "Registrar progreso"}
        </AppButton>
      </Box>
    </GlassCard>
  );
}

export default ProgressForm;
