import { useCallback, useState } from "react";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import { Alert, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AppButton from "../../components/common/AppButton";
import GlassCard from "../../components/common/GlassCard";
import { useApiData } from "../../hooks/useApiData";
import { deleteUser, getRegularUsers } from "../../services/adminService";
import type { User } from "../../types/user";
import AdminDataSection from "./components/AdminDataSection";
import AdminPage from "./components/AdminPage";

function AdminUsersPage() {
  const navigate = useNavigate();
  const loadUsers = useCallback(() => getRegularUsers(), []);
  const { data, error, loading, reload } = useApiData(loadUsers, "No pudimos cargar los usuarios.");
  const [message, setMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleDelete = async (userId: number) => {
    try {
      setMessage(null);
      setActionError(null);
      await deleteUser(userId);
      await reload();
      setMessage("Usuario eliminado correctamente.");
    } catch {
      setActionError("No pudimos eliminar el usuario.");
    }
  };

  return (
    <AdminPage
      title="Usuarios"
      subtitle="Gestiona participantes registrados en bienestar."
      actions={
        <AppButton startIcon={<AddCircleOutlinedIcon />} onClick={() => navigate("/admin/users/new")}>
          Nuevo usuario
        </AppButton>
      }
    >
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      {actionError && <Alert severity="error" sx={{ mb: 2 }}>{actionError}</Alert>}
      <AdminDataSection<User>
        data={data}
        emptyDescription="Crea el primer participante para empezar la gestion."
        emptyTitle="Sin usuarios registrados"
        error={error}
        loading={loading}
        render={(items) => (
          <Box className="module-grid">
            {items.map((user) => (
              <GlassCard key={user.id} variant="dashboard">
                <Typography variant="h5">{user.name}</Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">
                  {user.email}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">
                  Estado: {user.active === false ? "Inactivo" : "Activo"}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                  <AppButton appVariant="secondary" startIcon={<EditIcon />} onClick={() => navigate(`/admin/users/${user.id}/edit`)}>
                    Editar
                  </AppButton>
                  <AppButton appVariant="ghost" startIcon={<DeleteOutlinedIcon />} onClick={() => void handleDelete(user.id)}>
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

export default AdminUsersPage;
