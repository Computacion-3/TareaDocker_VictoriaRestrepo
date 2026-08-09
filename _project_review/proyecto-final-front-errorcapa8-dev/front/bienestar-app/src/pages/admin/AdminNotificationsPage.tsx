import { useCallback, useState } from "react";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import { Alert, Box, Typography } from "@mui/material";
import AppButton from "../../components/common/AppButton";
import GlassCard from "../../components/common/GlassCard";
import { useApiData } from "../../hooks/useApiData";
import {
  createNotification,
  deleteNotification,
  getNotifications,
  getRegularUsers,
  updateNotification,
} from "../../services/adminService";
import type { UserNotification } from "../../types/notification";
import type { User } from "../../types/user";
import AdminDataSection from "./components/AdminDataSection";
import { AdminNotificationForm } from "./components/AdminForms";
import AdminPage from "./components/AdminPage";

interface NotificationData {
  notifications: UserNotification[];
  users: User[];
}

function AdminNotificationsPage() {
  const [selected, setSelected] = useState<UserNotification | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const loadNotifications = useCallback(async (): Promise<NotificationData> => {
    const [notifications, users] = await Promise.all([getNotifications(), getRegularUsers()]);
    return { notifications, users };
  }, []);
  const { data, error, loading, reload } = useApiData(loadNotifications, "No pudimos cargar las notificaciones.");

  const handleDelete = async (notificationId: number) => {
    try {
      setMessage(null);
      setActionError(null);
      await deleteNotification(notificationId);
      await reload();
      setMessage("Notificacion eliminada correctamente.");
    } catch {
      setActionError("No pudimos eliminar la notificacion.");
    }
  };

  return (
    <AdminPage title="Notificaciones" subtitle="Gestiona avisos enviados a participantes.">
      {data && (
        <AdminNotificationForm
          key={selected?.id ?? "new-notification"}
          initialNotification={selected ?? undefined}
          users={data.users}
          title={selected ? "Editar notificacion" : "Nueva notificacion"}
          submitLabel={selected ? "Guardar cambios" : "Enviar notificacion"}
          successMessage={selected ? "Notificacion actualizada correctamente." : "Notificacion enviada correctamente."}
          onCancel={selected ? () => setSelected(null) : undefined}
          onSubmit={async (payload) => {
            if (selected) {
              await updateNotification(selected.id, payload);
              setSelected(null);
            } else {
              await createNotification(payload);
            }
            await reload();
          }}
        />
      )}
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      {actionError && <Alert severity="error" sx={{ mb: 2 }}>{actionError}</Alert>}
      <AdminDataSection<UserNotification>
        data={data?.notifications}
        emptyDescription="Crea la primera notificacion para informar a los participantes."
        emptyTitle="Sin notificaciones registradas"
        error={error}
        loading={loading}
        render={(items) => (
          <Box className="module-grid">
            {items.map((notification) => (
              <GlassCard key={notification.id} variant="dashboard">
                <Typography variant="h5">{notification.title || "Aviso"}</Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">
                  Para: {notification.userName}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1, lineHeight: 1.6 }}>
                  {notification.message}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                  <AppButton appVariant="secondary" startIcon={<EditIcon />} onClick={() => setSelected(notification)}>
                    Editar
                  </AppButton>
                  <AppButton appVariant="ghost" startIcon={<DeleteOutlinedIcon />} onClick={() => void handleDelete(notification.id)}>
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

export default AdminNotificationsPage;
