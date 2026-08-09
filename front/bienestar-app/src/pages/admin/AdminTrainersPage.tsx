import { useCallback, useState } from "react";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import { Alert, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AppButton from "../../components/common/AppButton";
import GlassCard from "../../components/common/GlassCard";
import { useApiData } from "../../hooks/useApiData";
import { deleteUser, getTrainers } from "../../services/adminService";
import type { User } from "../../types/user";
import AdminDataSection from "./components/AdminDataSection";
import AdminPage from "./components/AdminPage";

function AdminTrainersPage() {
  const navigate = useNavigate();
  const loadTrainers = useCallback(() => getTrainers(), []);
  const { data, error, loading, reload } = useApiData(loadTrainers, "No pudimos cargar los entrenadores.");
  const [message, setMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleDelete = async (trainerId: number) => {
    try {
      setMessage(null);
      setActionError(null);
      await deleteUser(trainerId);
      await reload();
      setMessage("Entrenador eliminado correctamente.");
    } catch {
      setActionError("No pudimos eliminar el entrenador.");
    }
  };

  return (
    <AdminPage
      title="Entrenadores"
      subtitle="Gestiona el equipo de acompanamiento de bienestar."
      actions={
        <AppButton startIcon={<AddCircleOutlinedIcon />} onClick={() => navigate("/admin/trainers/new")}>
          Nuevo entrenador
        </AppButton>
      }
    >
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      {actionError && <Alert severity="error" sx={{ mb: 2 }}>{actionError}</Alert>}
      <AdminDataSection<User>
        data={data}
        emptyDescription="Crea el primer entrenador para iniciar asignaciones."
        emptyTitle="Sin entrenadores registrados"
        error={error}
        loading={loading}
        render={(items) => (
          <Box className="module-grid">
            {items.map((trainer) => (
              <GlassCard key={trainer.id} variant="dashboard">
                <Typography variant="h5">{trainer.name}</Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">
                  {trainer.email}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">
                  Estado: {trainer.active === false ? "Inactivo" : "Activo"}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                  <AppButton appVariant="secondary" startIcon={<EditIcon />} onClick={() => navigate(`/admin/trainers/${trainer.id}/edit`)}>
                    Editar
                  </AppButton>
                  <AppButton appVariant="ghost" startIcon={<DeleteOutlinedIcon />} onClick={() => void handleDelete(trainer.id)}>
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

export default AdminTrainersPage;
