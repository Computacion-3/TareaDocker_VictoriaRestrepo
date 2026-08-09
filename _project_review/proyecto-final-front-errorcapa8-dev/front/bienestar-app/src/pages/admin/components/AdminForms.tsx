import { useState, type FormEvent } from "react";
import { Alert, Box, FormControlLabel, Switch, TextField, Typography } from "@mui/material";
import AppButton from "../../../components/common/AppButton";
import GlassCard from "../../../components/common/GlassCard";
import type { Role, TrainerAssignment, TrainerAssignmentRequest, UserRequest } from "../../../types/admin";
import type { Event, EventRequest } from "../../../types/event";
import type { Exercise, ExerciseRequest } from "../../../types/exercise";
import type { UserNotification, NotificationRequest } from "../../../types/notification";
import type { Space, SpaceRequest } from "../../../types/space";
import type { User } from "../../../types/user";

interface BaseFormProps<TPayload> {
  title: string;
  submitLabel: string;
  successMessage: string;
  onSubmit: (payload: TPayload) => Promise<void>;
  onCancel?: () => void;
}

interface AdminUserFormProps extends BaseFormProps<UserRequest> {
  initialUser?: User;
  roles: Role[];
  targetRoleName: "USER" | "TRAINER";
}

export function AdminUserForm({
  initialUser,
  roles,
  targetRoleName,
  title,
  submitLabel,
  successMessage,
  onSubmit,
}: AdminUserFormProps) {
  const [name, setName] = useState(initialUser?.name ?? "");
  const [email, setEmail] = useState(initialUser?.email ?? "");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const role = roles.find((item) => item.name === targetRoleName);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!role) {
      setError("No se encontro el rol necesario para guardar.");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setMessage(null);
      await onSubmit({ email, name, password, roleId: role.id });
      setMessage(successMessage);
    } catch {
      setError("No pudimos guardar los cambios.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <GlassCard variant="dashboard" sx={{ mb: 3 }}>
      <Typography variant="h5">{title}</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2, mt: 2 }}>
        <TextField label="Nombre" required value={name} onChange={(event) => setName(event.target.value)} />
        <TextField label="Correo" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <TextField
          helperText="La contrasena se solicita para confirmar el registro."
          label="Contrasena"
          required
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        <AppButton disabled={saving || !role} type="submit">
          {saving ? "Guardando" : submitLabel}
        </AppButton>
      </Box>
    </GlassCard>
  );
}

interface AdminAssignmentFormProps extends BaseFormProps<TrainerAssignmentRequest> {
  initialAssignment?: TrainerAssignment;
  trainers: User[];
  users: User[];
}

export function AdminAssignmentForm({
  initialAssignment,
  trainers,
  users,
  title,
  submitLabel,
  successMessage,
  onSubmit,
  onCancel,
}: AdminAssignmentFormProps) {
  const [trainerId, setTrainerId] = useState(String(initialAssignment?.trainerId ?? ""));
  const [assignedUserId, setAssignedUserId] = useState(String(initialAssignment?.assignedUserId ?? ""));
  const [active, setActive] = useState(initialAssignment?.active ?? true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setMessage(null);
      await onSubmit({ active, assignedUserId: Number(assignedUserId), trainerId: Number(trainerId) });
      setMessage(successMessage);
    } catch {
      setError("No pudimos guardar la asignacion.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <GlassCard variant="dashboard" sx={{ mb: 3 }}>
      <Typography variant="h5">{title}</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2, mt: 2 }}>
        <TextField label="Entrenador" required select slotProps={{ select: { native: true } }} value={trainerId} onChange={(event) => setTrainerId(event.target.value)}>
          <option value="">Selecciona un entrenador</option>
          {trainers.map((trainer) => (
            <option key={trainer.id} value={trainer.id}>
              {trainer.name}
            </option>
          ))}
        </TextField>
        <TextField label="Usuario asignado" required select slotProps={{ select: { native: true } }} value={assignedUserId} onChange={(event) => setAssignedUserId(event.target.value)}>
          <option value="">Selecciona un usuario</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </TextField>
        <FormControlLabel control={<Switch checked={active} onChange={(event) => setActive(event.target.checked)} />} label="Asignacion activa" />
        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          <AppButton disabled={saving} type="submit">
            {saving ? "Guardando" : submitLabel}
          </AppButton>
          {onCancel && (
            <AppButton appVariant="secondary" onClick={onCancel} type="button">
              Cancelar
            </AppButton>
          )}
        </Box>
      </Box>
    </GlassCard>
  );
}

interface AdminExerciseFormProps extends BaseFormProps<ExerciseRequest> {
  initialExercise?: Exercise;
}

export function AdminExerciseForm({
  initialExercise,
  title,
  submitLabel,
  successMessage,
  onSubmit,
  onCancel,
}: AdminExerciseFormProps) {
  const [name, setName] = useState(initialExercise?.name ?? "");
  const [type, setType] = useState(initialExercise?.type ?? "");
  const [description, setDescription] = useState(initialExercise?.description ?? "");
  const [duration, setDuration] = useState(String(initialExercise?.duration ?? ""));
  const [difficulty, setDifficulty] = useState(initialExercise?.difficulty ?? "MEDIA");
  const [videoUrl, setVideoUrl] = useState(initialExercise?.videoUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setMessage(null);
      await onSubmit({
        description,
        difficulty,
        duration: duration ? Number(duration) : undefined,
        name,
        type,
        videoUrl: videoUrl || undefined,
      });
      setMessage(successMessage);
    } catch {
      setError("No pudimos guardar el ejercicio.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <GlassCard variant="dashboard" sx={{ mb: 3 }}>
      <Typography variant="h5">{title}</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2, mt: 2 }}>
        <TextField label="Nombre" required value={name} onChange={(event) => setName(event.target.value)} />
        <TextField label="Tipo" required value={type} onChange={(event) => setType(event.target.value)} />
        <TextField label="Descripcion" required multiline minRows={3} value={description} onChange={(event) => setDescription(event.target.value)} />
        <TextField label="Duracion en minutos" type="number" value={duration} onChange={(event) => setDuration(event.target.value)} />
        <TextField label="Dificultad" required select slotProps={{ select: { native: true } }} value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
          <option value="BAJA">Baja</option>
          <option value="MEDIA">Media</option>
          <option value="ALTA">Alta</option>
        </TextField>
        <TextField label="Video" value={videoUrl} onChange={(event) => setVideoUrl(event.target.value)} />
        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          <AppButton disabled={saving} type="submit">
            {saving ? "Guardando" : submitLabel}
          </AppButton>
          {onCancel && (
            <AppButton appVariant="secondary" onClick={onCancel} type="button">
              Cancelar
            </AppButton>
          )}
        </Box>
      </Box>
    </GlassCard>
  );
}

interface AdminEventFormProps extends BaseFormProps<EventRequest> {
  initialEvent?: Event;
}

const toDateTimeInputValue = (value?: string | null) => (value ? value.slice(0, 16) : "");

export function AdminEventForm({
  initialEvent,
  title,
  submitLabel,
  successMessage,
  onSubmit,
  onCancel,
}: AdminEventFormProps) {
  const [name, setName] = useState(initialEvent?.name ?? "");
  const [description, setDescription] = useState(initialEvent?.description ?? "");
  const [eventType, setEventType] = useState(initialEvent?.eventType ?? "GENERAL");
  const [dateTime, setDateTime] = useState(toDateTimeInputValue(initialEvent?.dateTime));
  const [endDateTime, setEndDateTime] = useState(toDateTimeInputValue(initialEvent?.endDateTime));
  const [capacity, setCapacity] = useState(String(initialEvent?.capacity ?? ""));
  const [location, setLocation] = useState(initialEvent?.location ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setMessage(null);
      await onSubmit({
        capacity: capacity ? Number(capacity) : undefined,
        dateTime,
        description,
        endDateTime: endDateTime || undefined,
        eventType,
        location,
        name,
      });
      setMessage(successMessage);
    } catch {
      setError("No pudimos guardar el evento.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <GlassCard variant="dashboard" sx={{ mb: 3 }}>
      <Typography variant="h5">{title}</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2, mt: 2 }}>
        <TextField label="Nombre" required value={name} onChange={(event) => setName(event.target.value)} />
        <TextField label="Descripcion" required multiline minRows={3} value={description} onChange={(event) => setDescription(event.target.value)} />
        <TextField label="Tipo" required value={eventType} onChange={(event) => setEventType(event.target.value)} />
        <TextField label="Inicio" required slotProps={{ inputLabel: { shrink: true } }} type="datetime-local" value={dateTime} onChange={(event) => setDateTime(event.target.value)} />
        <TextField label="Fin" slotProps={{ inputLabel: { shrink: true } }} type="datetime-local" value={endDateTime} onChange={(event) => setEndDateTime(event.target.value)} />
        <TextField label="Capacidad" type="number" value={capacity} onChange={(event) => setCapacity(event.target.value)} />
        <TextField label="Lugar" required value={location} onChange={(event) => setLocation(event.target.value)} />
        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          <AppButton disabled={saving} type="submit">
            {saving ? "Guardando" : submitLabel}
          </AppButton>
          {onCancel && (
            <AppButton appVariant="secondary" onClick={onCancel} type="button">
              Cancelar
            </AppButton>
          )}
        </Box>
      </Box>
    </GlassCard>
  );
}

interface AdminSpaceFormProps extends BaseFormProps<SpaceRequest> {
  initialSpace?: Space;
}

export function AdminSpaceForm({
  initialSpace,
  title,
  submitLabel,
  successMessage,
  onSubmit,
  onCancel,
}: AdminSpaceFormProps) {
  const [name, setName] = useState(initialSpace?.name ?? "");
  const [type, setType] = useState(initialSpace?.type ?? "");
  const [description, setDescription] = useState(initialSpace?.description ?? "");
  const [location, setLocation] = useState(initialSpace?.location ?? "");
  const [available, setAvailable] = useState(initialSpace?.available ?? true);
  const [capacity, setCapacity] = useState(String(initialSpace?.capacity ?? ""));
  const [openingHours, setOpeningHours] = useState(initialSpace?.openingHours ?? "");
  const [closingHours, setClosingHours] = useState(initialSpace?.closingHours ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setMessage(null);
      await onSubmit({
        available,
        capacity: Number(capacity),
        closingHours: closingHours || undefined,
        description: description || undefined,
        location: location || undefined,
        name,
        openingHours: openingHours || undefined,
        type,
      });
      setMessage(successMessage);
    } catch {
      setError("No pudimos guardar el espacio.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <GlassCard variant="dashboard" sx={{ mb: 3 }}>
      <Typography variant="h5">{title}</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2, mt: 2 }}>
        <TextField label="Nombre" required value={name} onChange={(event) => setName(event.target.value)} />
        <TextField label="Tipo" required value={type} onChange={(event) => setType(event.target.value)} />
        <TextField label="Descripcion" multiline minRows={3} value={description} onChange={(event) => setDescription(event.target.value)} />
        <TextField label="Ubicacion" value={location} onChange={(event) => setLocation(event.target.value)} />
        <TextField label="Capacidad" required type="number" value={capacity} onChange={(event) => setCapacity(event.target.value)} />
        <TextField label="Hora de apertura" value={openingHours} onChange={(event) => setOpeningHours(event.target.value)} />
        <TextField label="Hora de cierre" value={closingHours} onChange={(event) => setClosingHours(event.target.value)} />
        <FormControlLabel control={<Switch checked={available} onChange={(event) => setAvailable(event.target.checked)} />} label="Disponible" />
        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          <AppButton disabled={saving} type="submit">
            {saving ? "Guardando" : submitLabel}
          </AppButton>
          {onCancel && (
            <AppButton appVariant="secondary" onClick={onCancel} type="button">
              Cancelar
            </AppButton>
          )}
        </Box>
      </Box>
    </GlassCard>
  );
}

interface AdminNotificationFormProps extends BaseFormProps<NotificationRequest> {
  initialNotification?: UserNotification;
  users: User[];
}

export function AdminNotificationForm({
  initialNotification,
  users,
  title,
  submitLabel,
  successMessage,
  onSubmit,
  onCancel,
}: AdminNotificationFormProps) {
  const [titleValue, setTitleValue] = useState(initialNotification?.title ?? "");
  const [messageValue, setMessageValue] = useState(initialNotification?.message ?? "");
  const [type, setType] = useState(initialNotification?.type ?? "GENERAL");
  const [relatedEntityId, setRelatedEntityId] = useState(String(initialNotification?.relatedEntityId ?? ""));
  const [userId, setUserId] = useState(String(initialNotification?.userId ?? ""));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setMessage(null);
      await onSubmit({
        message: messageValue,
        relatedEntityId: relatedEntityId ? Number(relatedEntityId) : undefined,
        title: titleValue || undefined,
        type: type || undefined,
        userId: Number(userId),
      });
      setMessage(successMessage);
    } catch {
      setError("No pudimos guardar la notificacion.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <GlassCard variant="dashboard" sx={{ mb: 3 }}>
      <Typography variant="h5">{title}</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2, mt: 2 }}>
        <TextField label="Titulo" value={titleValue} onChange={(event) => setTitleValue(event.target.value)} />
        <TextField label="Mensaje" required multiline minRows={3} value={messageValue} onChange={(event) => setMessageValue(event.target.value)} />
        <TextField label="Tipo" value={type} onChange={(event) => setType(event.target.value)} />
        <TextField label="Usuario" required select slotProps={{ select: { native: true } }} value={userId} onChange={(event) => setUserId(event.target.value)}>
          <option value="">Selecciona un usuario</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </TextField>
        <TextField label="Referencia" type="number" value={relatedEntityId} onChange={(event) => setRelatedEntityId(event.target.value)} />
        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          <AppButton disabled={saving} type="submit">
            {saving ? "Guardando" : submitLabel}
          </AppButton>
          {onCancel && (
            <AppButton appVariant="secondary" onClick={onCancel} type="button">
              Cancelar
            </AppButton>
          )}
        </Box>
      </Box>
    </GlassCard>
  );
}
