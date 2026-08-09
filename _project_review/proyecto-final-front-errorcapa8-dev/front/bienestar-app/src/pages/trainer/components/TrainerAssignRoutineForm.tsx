import { useState } from "react";
import { Alert, Box } from "@mui/material";
import AppButton from "../../../components/common/AppButton";
import AppInput from "../../../components/common/AppInput";
import AppSelect from "../../../components/common/AppSelect";
import AppTextarea from "../../../components/common/AppTextarea";
import ErrorMessage from "../../../components/common/ErrorMessage";
import GlassCard from "../../../components/common/GlassCard";
import { assignRoutineToUser } from "../../../services/trainerService";
import type { Routine } from "../../../types/routine";

interface TrainerAssignRoutineFormProps {
  templates: Routine[];
  userId: number;
  onAssigned: () => Promise<void>;
}

function TrainerAssignRoutineForm({
  templates,
  userId,
  onAssigned,
}: TrainerAssignRoutineFormProps) {
  const [templateId, setTemplateId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!templateId) {
      setError("Selecciona una rutina para continuar.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      await assignRoutineToUser(userId, {
        description: description.trim() || undefined,
        name: name.trim() || undefined,
        templateId: Number(templateId),
      });
      setTemplateId("");
      setName("");
      setDescription("");
      setSuccess("Rutina asignada correctamente.");
      await onAssigned();
    } catch {
      setError("No se pudo asignar la rutina.");
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
          value={templateId}
          options={templates.map((routine) => ({ label: routine.name, value: String(routine.id) }))}
          onChange={(event) => setTemplateId(event.target.value)}
        />
        <AppInput
          label="Nombre personalizado"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <AppTextarea
          label="Descripcion personalizada"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <AppButton disabled={submitting} sx={{ mt: 2 }} type="submit">
          {submitting ? "Asignando" : "Asignar rutina"}
        </AppButton>
      </Box>
    </GlassCard>
  );
}

export default TrainerAssignRoutineForm;
