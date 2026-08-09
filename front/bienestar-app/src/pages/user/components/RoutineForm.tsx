import { useState } from "react";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { Alert, Box, IconButton, Typography } from "@mui/material";
import AppButton from "../../../components/common/AppButton";
import AppInput from "../../../components/common/AppInput";
import AppSelect from "../../../components/common/AppSelect";
import AppTextarea from "../../../components/common/AppTextarea";
import ErrorMessage from "../../../components/common/ErrorMessage";
import GlassCard from "../../../components/common/GlassCard";
import type { Exercise } from "../../../types/exercise";
import type { Routine, RoutineExerciseRequest, RoutineRequest } from "../../../types/routine";

interface RoutineFormProps {
  exercises: Exercise[];
  onSubmit: (routine: RoutineRequest) => Promise<Routine>;
}

const toOptionalNumber = (value: string) => value ? Number(value) : undefined;

function RoutineForm({ exercises, onSubmit }: RoutineFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedExerciseId, setSelectedExerciseId] = useState("");
  const [sets, setSets] = useState("");
  const [repetitions, setRepetitions] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [exerciseDetails, setExerciseDetails] = useState<RoutineExerciseRequest[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const exerciseOptions = exercises.map((exercise) => ({
    label: exercise.name,
    value: String(exercise.id),
  }));

  const addExercise = () => {
    if (!selectedExerciseId) {
      setError("Selecciona un ejercicio para agregarlo a la rutina.");
      return;
    }

    setExerciseDetails((current) => [
      ...current,
      {
        duration: toOptionalNumber(duration),
        exerciseId: Number(selectedExerciseId),
        notes: notes.trim() || undefined,
        orderIndex: current.length + 1,
        repetitions: toOptionalNumber(repetitions),
        sets: toOptionalNumber(sets),
      },
    ]);
    setSelectedExerciseId("");
    setSets("");
    setRepetitions("");
    setDuration("");
    setNotes("");
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !description.trim()) {
      setError("Agrega nombre y descripcion para continuar.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      await onSubmit({
        description: description.trim(),
        exerciseDetails: exerciseDetails.length > 0 ? exerciseDetails : undefined,
        name: name.trim(),
      });
      setName("");
      setDescription("");
      setExerciseDetails([]);
      setSuccess("Rutina creada correctamente.");
    } catch {
      setError("No se pudo guardar la rutina.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <GlassCard variant="dashboard">
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error && <ErrorMessage message={error} />}
      <Box component="form" onSubmit={handleSubmit}>
        <AppInput
          label="Nombre de la rutina"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
        <AppTextarea
          label="Descripcion"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          minRows={4}
          required
        />

        <Typography sx={{ mt: 2 }} variant="h6">
          Ejercicios de la rutina
        </Typography>
        <AppSelect
          label="Ejercicio"
          value={selectedExerciseId}
          options={exerciseOptions}
          onChange={(event) => setSelectedExerciseId(event.target.value)}
        />
        <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" } }}>
          <AppInput label="Series" type="number" value={sets} onChange={(event) => setSets(event.target.value)} />
          <AppInput label="Repeticiones" type="number" value={repetitions} onChange={(event) => setRepetitions(event.target.value)} />
          <AppInput label="Duracion" type="number" value={duration} onChange={(event) => setDuration(event.target.value)} />
        </Box>
        <AppInput label="Notas" value={notes} onChange={(event) => setNotes(event.target.value)} />
        <AppButton appVariant="secondary" onClick={addExercise} startIcon={<AddCircleOutlinedIcon />} type="button">
          Agregar ejercicio
        </AppButton>

        {exerciseDetails.map((detail, index) => {
          const exercise = exercises.find((item) => item.id === detail.exerciseId);

          return (
            <Box
              key={`${detail.exerciseId}-${index}`}
              sx={{
                alignItems: "center",
                borderTop: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                justifyContent: "space-between",
                mt: 1.5,
                pt: 1.5,
              }}
            >
              <Typography color="text.secondary">
                {exercise?.name ?? "Ejercicio seleccionado"}
              </Typography>
              <IconButton
                aria-label="Quitar ejercicio"
                color="inherit"
                onClick={() => setExerciseDetails((current) => current.filter((_, itemIndex) => itemIndex !== index))}
              >
                <DeleteOutlinedIcon />
              </IconButton>
            </Box>
          );
        })}

        <AppButton disabled={submitting} sx={{ mt: 3 }} type="submit">
          {submitting ? "Guardando" : "Guardar rutina"}
        </AppButton>
      </Box>
    </GlassCard>
  );
}

export default RoutineForm;
