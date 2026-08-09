import { useState } from "react";
import { Alert, Box } from "@mui/material";
import AppButton from "../../../components/common/AppButton";
import AppInput from "../../../components/common/AppInput";
import AppSelect from "../../../components/common/AppSelect";
import AppTextarea from "../../../components/common/AppTextarea";
import ErrorMessage from "../../../components/common/ErrorMessage";
import GlassCard from "../../../components/common/GlassCard";
import { createRecommendationForUser } from "../../../services/recommendationService";
import type { Recommendation } from "../../../types/recommendation";
import type { User } from "../../../types/user";

interface TrainerRecommendationFormProps {
  users: User[];
  initialUserId?: number;
  onCreated: (recommendation: Recommendation) => Promise<void> | void;
}

function TrainerRecommendationForm({
  users,
  initialUserId,
  onCreated,
}: TrainerRecommendationFormProps) {
  const [userId, setUserId] = useState(initialUserId ? String(initialUserId) : "");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!userId) {
      setError("Selecciona un usuario para continuar.");
      return;
    }

    if (!title.trim() || !message.trim()) {
      setError("Escribe una recomendacion para continuar.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      const created = await createRecommendationForUser(Number(userId), {
        message: message.trim(),
        title: title.trim(),
      });
      setTitle("");
      setMessage("");
      setSuccess("Recomendacion enviada correctamente.");
      await onCreated(created);
    } catch {
      setError("No se pudo enviar la recomendacion.");
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
          label="Usuario asignado"
          value={userId}
          options={users.map((user) => ({ label: user.name, value: String(user.id) }))}
          onChange={(event) => setUserId(event.target.value)}
        />
        <AppInput
          label="Titulo"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
        <AppTextarea
          label="Mensaje"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          required
        />
        <AppButton disabled={submitting} sx={{ mt: 2 }} type="submit">
          {submitting ? "Enviando" : "Enviar recomendacion"}
        </AppButton>
      </Box>
    </GlassCard>
  );
}

export default TrainerRecommendationForm;
