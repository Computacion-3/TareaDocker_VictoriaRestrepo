import { useCallback, useState } from "react";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import { Alert, Box, Typography } from "@mui/material";
import AppButton from "../../components/common/AppButton";
import GlassCard from "../../components/common/GlassCard";
import { useApiData } from "../../hooks/useApiData";
import { createExercise, deleteExercise, getExercises, updateExercise } from "../../services/adminService";
import type { Exercise } from "../../types/exercise";
import AdminDataSection from "./components/AdminDataSection";
import { AdminExerciseForm } from "./components/AdminForms";
import AdminPage from "./components/AdminPage";

function AdminExercisesPage() {
  const [selected, setSelected] = useState<Exercise | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const loadExercises = useCallback(() => getExercises(), []);
  const { data, error, loading, reload } = useApiData(loadExercises, "No pudimos cargar los ejercicios.");

  const handleDelete = async (exerciseId: number) => {
    try {
      setMessage(null);
      setActionError(null);
      await deleteExercise(exerciseId);
      await reload();
      setMessage("Ejercicio eliminado correctamente.");
    } catch {
      setActionError("No pudimos eliminar el ejercicio.");
    }
  };

  return (
    <AdminPage
      title="Ejercicios"
      subtitle="Gestiona el catalogo institucional de ejercicios."
    >
      <AdminExerciseForm
        key={selected?.id ?? "new-exercise"}
        initialExercise={selected ?? undefined}
        title={selected ? "Editar ejercicio" : "Nuevo ejercicio"}
        submitLabel={selected ? "Guardar cambios" : "Crear ejercicio"}
        successMessage={selected ? "Ejercicio actualizado correctamente." : "Ejercicio creado correctamente."}
        onCancel={selected ? () => setSelected(null) : undefined}
        onSubmit={async (payload) => {
          if (selected) {
            await updateExercise(selected.id, payload);
            setSelected(null);
          } else {
            await createExercise(payload);
          }
          await reload();
        }}
      />
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      {actionError && <Alert severity="error" sx={{ mb: 2 }}>{actionError}</Alert>}
      <AdminDataSection<Exercise>
        data={data}
        emptyDescription="Crea el primer ejercicio para alimentar el catalogo."
        emptyTitle="Sin ejercicios registrados"
        error={error}
        loading={loading}
        render={(items) => (
          <Box className="module-grid">
            {items.map((exercise) => (
              <GlassCard key={exercise.id} variant="dashboard">
                <Typography variant="h5">{exercise.name}</Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">
                  {exercise.type} - {exercise.difficulty}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1, lineHeight: 1.6 }}>
                  {exercise.description}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                  <AppButton appVariant="secondary" startIcon={<EditIcon />} onClick={() => setSelected(exercise)}>
                    Editar
                  </AppButton>
                  <AppButton appVariant="ghost" startIcon={<DeleteOutlinedIcon />} onClick={() => void handleDelete(exercise.id)}>
                    Eliminar
                  </AppButton>
                </Box>
              </GlassCard>
            ))}
          </Box>
        )}
      />
    </AdminPage>
  );
}

export default AdminExercisesPage;
