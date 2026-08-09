import { useCallback } from "react";
import { Typography } from "@mui/material";
import { useApiData } from "../../hooks/useApiData";
import { getMyNotifications } from "../../services/notificationService";
import type { UserNotification } from "../../types/notification";
import DataSection from "./components/DataSection";
import ResourceGrid from "./components/ResourceGrid";
import UserPage from "./components/UserPage";
import { formatDateTime } from "./formatters";

function NotificationsPage() {
  const loadNotifications = useCallback(() => getMyNotifications(), []);
  const { data, error, loading } = useApiData(loadNotifications, "No pudimos cargar tus notificaciones por ahora.");

  return (
    <UserPage
      title="Notificaciones"
      subtitle="Revisa avisos y novedades relacionados con tu bienestar."
    >
      <DataSection<UserNotification>
        data={data}
        emptyDescription="No hay notificaciones disponibles por ahora."
        emptyTitle="Sin notificaciones"
        error={error}
        loading={loading}
        render={(items) => (
          <ResourceGrid
            items={items}
            renderDescription={(notification) => notification.message}
            renderMeta={(notification) => (
              <Typography color="text.secondary" variant="body2">
                {notification.read ? "Leida" : "Nueva"} · {formatDateTime(notification.createdAt)}
              </Typography>
            )}
            renderTitle={(notification) => notification.title}
          />
        )}
      />
    </UserPage>
  );
}

export default NotificationsPage;
