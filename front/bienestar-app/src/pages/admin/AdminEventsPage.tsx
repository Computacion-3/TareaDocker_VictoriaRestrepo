import { useCallback, useState } from "react";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import { Alert, Box, Typography } from "@mui/material";
import AppButton from "../../components/common/AppButton";
import GlassCard from "../../components/common/GlassCard";
import { useApiData } from "../../hooks/useApiData";
import { createEvent, deleteEvent, getEvents, updateEvent } from "../../services/adminService";
import type { Event } from "../../types/event";
import AdminDataSection from "./components/AdminDataSection";
import { AdminEventForm } from "./components/AdminForms";
import AdminPage from "./components/AdminPage";

const formatDate = (value: string) => new Date(value).toLocaleString("es-CO");

function AdminEventsPage() {
  const [selected, setSelected] = useState<Event | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const loadEvents = useCallback(() => getEvents(), []);
  const { data, error, loading, reload } = useApiData(loadEvents, "No pudimos cargar los eventos.");

  const handleDelete = async (eventId: number) => {
    try {
      setMessage(null);
      setActionError(null);
      await deleteEvent(eventId);
      await reload();
      setMessage("Evento eliminado correctamente.");
    } catch {
      setActionError("No pudimos eliminar el evento.");
    }
  };

  return (
    <AdminPage title="Eventos" subtitle="Gestiona actividades institucionales y deportivas.">
      <AdminEventForm
        key={selected?.id ?? "new-event"}
        initialEvent={selected ?? undefined}
        title={selected ? "Editar evento" : "Nuevo evento"}
        submitLabel={selected ? "Guardar cambios" : "Crear evento"}
        successMessage={selected ? "Evento actualizado correctamente." : "Evento creado correctamente."}
        onCancel={selected ? () => setSelected(null) : undefined}
        onSubmit={async (payload) => {
          if (selected) {
            await updateEvent(selected.id, payload);
            setSelected(null);
          } else {
            await createEvent(payload);
          }
          await reload();
        }}
      />
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      {actionError && <Alert severity="error" sx={{ mb: 2 }}>{actionError}</Alert>}
      <AdminDataSection<Event>
        data={data}
        emptyDescription="Crea el primer evento para publicarlo en bienestar."
        emptyTitle="Sin eventos registrados"
        error={error}
        loading={loading}
        render={(items) => (
          <Box className="module-grid">
            {items.map((event) => (
              <GlassCard key={event.id} variant="dashboard">
                <Typography variant="h5">{event.name}</Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">
                  {formatDate(event.dateTime)} - {event.location ?? "Lugar por confirmar"}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1, lineHeight: 1.6 }}>
                  {event.description}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                  <AppButton appVariant="secondary" startIcon={<EditIcon />} onClick={() => setSelected(event)}>
                    Editar
                  </AppButton>
                  <AppButton appVariant="ghost" startIcon={<DeleteOutlinedIcon />} onClick={() => void handleDelete(event.id)}>
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

export default AdminEventsPage;
