import { useCallback, useState } from "react";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import { Alert, Box, Typography } from "@mui/material";
import AppButton from "../../components/common/AppButton";
import GlassCard from "../../components/common/GlassCard";
import { useApiData } from "../../hooks/useApiData";
import {
  createAssignment,
  deleteAssignment,
  getAssignments,
  getRegularUsers,
  getTrainers,
  updateAssignment,
} from "../../services/adminService";
import type { TrainerAssignment } from "../../types/admin";
import type { User } from "../../types/user";
import { AdminAssignmentForm } from "./components/AdminForms";
import AdminDataSection from "./components/AdminDataSection";
import AdminPage from "./components/AdminPage";

interface AssignmentData {
  assignments: TrainerAssignment[];
  trainers: User[];
  users: User[];
}

function AdminAssignmentsPage() {
  const [selected, setSelected] = useState<TrainerAssignment | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const loadAssignments = useCallback(async (): Promise<AssignmentData> => {
    const [assignments, trainers, users] = await Promise.all([
      getAssignments(),
      getTrainers(),
      getRegularUsers(),
    ]);

    return { assignments, trainers, users };
  }, []);

  const { data, error, loading, reload } = useApiData(loadAssignments, "No pudimos cargar las asignaciones.");

  const handleDelete = async (assignmentId: number) => {
    try {
      setMessage(null);
      setActionError(null);
      await deleteAssignment(assignmentId);
      await reload();
      setMessage("Asignacion eliminada correctamente.");
    } catch {
      setActionError("No pudimos eliminar la asignacion.");
    }
  };

  return (
    <AdminPage
      title="Asignaciones"
      subtitle="Relaciona usuarios con entrenadores responsables."
    >
      {data && (
        <AdminAssignmentForm
          key={selected?.id ?? "new-assignment"}
          initialAssignment={selected ?? undefined}
          trainers={data.trainers}
          users={data.users}
          title={selected ? "Editar asignacion" : "Nueva asignacion"}
          submitLabel={selected ? "Guardar cambios" : "Crear asignacion"}
          successMessage={selected ? "Asignacion actualizada correctamente." : "Asignacion creada correctamente."}
          onCancel={selected ? () => setSelected(null) : undefined}
          onSubmit={async (payload) => {
            if (selected) {
              await updateAssignment(selected.id, payload);
              setSelected(null);
            } else {
              await createAssignment(payload);
            }
            await reload();
          }}
        />
      )}
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      {actionError && <Alert severity="error" sx={{ mb: 2 }}>{actionError}</Alert>}
      <AdminDataSection<TrainerAssignment>
        data={data?.assignments}
        emptyDescription="Crea una asignacion para conectar usuarios con entrenadores."
        emptyTitle="Sin asignaciones registradas"
        error={error}
        loading={loading}
        render={(items) => (
          <Box className="module-grid">
            {items.map((assignment) => (
              <GlassCard key={assignment.id} variant="dashboard">
                <Typography variant="h5">{assignment.assignedUserName}</Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">
                  Entrenador: {assignment.trainerName}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">
                  Estado: {assignment.active ? "Activa" : "Inactiva"}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                  <AppButton appVariant="secondary" startIcon={<EditIcon />} onClick={() => setSelected(assignment)}>
                    Editar
                  </AppButton>
                  <AppButton appVariant="ghost" startIcon={<DeleteOutlinedIcon />} onClick={() => void handleDelete(assignment.id)}>
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

export default AdminAssignmentsPage;
