import { useState } from "react";
import { Alert, Box } from "@mui/material";
import AppButton from "../../../components/common/AppButton";
import AppInput from "../../../components/common/AppInput";
import AppSelect from "../../../components/common/AppSelect";
import AppTextarea from "../../../components/common/AppTextarea";
import ErrorMessage from "../../../components/common/ErrorMessage";
import GlassCard from "../../../components/common/GlassCard";
import { createCustomExercise } from "../../../services/exerciseService";
import type { Exercise } from "../../../types/exercise";

interface ExerciseCreateFormProps {
  onCreated: (exercise: Exercise) => void;
}

const difficultyOptions = [
  { label: "Baja", value: "Baja" },
  { label: "Media", value: "Media" },
  { label: "Alta", value: "Alta" },
];

function ExerciseCreateForm({ onCreated }: ExerciseCreateFormProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [difficulty, setDifficulty] = useState("Media");
  const [videoUrl, setVideoUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !type.trim() || !description.trim() || !difficulty.trim()) {
      setError("Completa nombre, tipo, descripcion y dificultad para continuar.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      const created = await createCustomExercise({
        description: description.trim(),
        difficulty,
        duration: duration ? Number(duration) : undefined,
        name: name.trim(),
        type: type.trim(),
        videoUrl: videoUrl.trim() || undefined,
      });

      setName("");
      setType("");
      setDescription("");
      setDuration("");
      setDifficulty("Media");
      setVideoUrl("");
      setSuccess("Ejercicio creado correctamente.");
      onCreated(created);
    } catch {
      setError("No se pudo crear el ejercicio.");
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
          label="Nombre"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
        <AppInput
          label="Tipo"
          value={type}
          onChange={(event) => setType(event.target.value)}
          required
        />
        <AppTextarea
          label="Descripcion"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
        />
        <AppInput
          label="Duracion en minutos"
          type="number"
          value={duration}
          onChange={(event) => setDuration(event.target.value)}
        />
        <AppSelect
          label="Dificultad"
          value={difficulty}
          options={difficultyOptions}
          onChange={(event) => setDifficulty(event.target.value)}
        />
        <AppInput
          label="Enlace de apoyo"
          value={videoUrl}
          onChange={(event) => setVideoUrl(event.target.value)}
        />
        <AppButton disabled={submitting} sx={{ mt: 2 }} type="submit">
          {submitting ? "Guardando" : "Crear ejercicio personalizado"}
        </AppButton>
      </Box>
    </GlassCard>
  );
}

export default ExerciseCreateForm;
