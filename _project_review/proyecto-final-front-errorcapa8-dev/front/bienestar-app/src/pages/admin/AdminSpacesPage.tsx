import { useCallback, useState } from "react";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import { Alert, Box, Typography } from "@mui/material";
import AppButton from "../../components/common/AppButton";
import GlassCard from "../../components/common/GlassCard";
import { useApiData } from "../../hooks/useApiData";
import { createSpace, deleteSpace, getAdminSpaces, updateSpace } from "../../services/adminService";
import type { Space } from "../../types/space";
import AdminDataSection from "./components/AdminDataSection";
import { AdminSpaceForm } from "./components/AdminForms";
import AdminPage from "./components/AdminPage";

function AdminSpacesPage() {
  const [selected, setSelected] = useState<Space | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const loadSpaces = useCallback(() => getAdminSpaces(), []);
  const { data, error, loading, reload } = useApiData(loadSpaces, "No pudimos cargar los espacios.");

  const handleDelete = async (spaceId: number) => {
    try {
      setMessage(null);
      setActionError(null);
      await deleteSpace(spaceId);
      await reload();
      setMessage("Espacio eliminado correctamente.");
    } catch {
      setActionError("No pudimos eliminar el espacio.");
    }
  };

  return (
    <AdminPage title="Espacios" subtitle="Gestiona espacios deportivos, disponibilidad y capacidad.">
      <AdminSpaceForm
        key={selected?.id ?? "new-space"}
        initialSpace={selected ?? undefined}
        title={selected ? "Editar espacio" : "Nuevo espacio"}
        submitLabel={selected ? "Guardar cambios" : "Crear espacio"}
        successMessage={selected ? "Espacio actualizado correctamente." : "Espacio creado correctamente."}
        onCancel={selected ? () => setSelected(null) : undefined}
        onSubmit={async (payload) => {
          if (selected) {
            await updateSpace(selected.id, payload);
            setSelected(null);
          } else {
            await createSpace(payload);
          }
          await reload();
        }}
      />
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      {actionError && <Alert severity="error" sx={{ mb: 2 }}>{actionError}</Alert>}
      <AdminDataSection<Space>
        data={data}
        emptyDescription="Crea el primer espacio para organizar disponibilidad."
        emptyTitle="Sin espacios registrados"
        error={error}
        loading={loading}
        render={(items) => (
          <Box className="module-grid">
            {items.map((space) => (
              <GlassCard key={space.id} variant="dashboard">
                <Typography variant="h5">{space.name}</Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">
                  {space.type} - {space.location}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">
                  Capacidad: {space.capacity} - {space.available ? "Disponible" : "No disponible"}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                  <AppButton appVariant="secondary" startIcon={<EditIcon />} onClick={() => setSelected(space)}>
                    Editar
                  </AppButton>
                  <AppButton appVariant="ghost" startIcon={<DeleteOutlinedIcon />} onClick={() => void handleDelete(space.id)}>
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

export default AdminSpacesPage;
