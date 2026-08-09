import { useCallback } from "react";
import { Typography } from "@mui/material";
import { useApiData } from "../../hooks/useApiData";
import { getUpcomingEvents } from "../../services/eventService";
import type { Event } from "../../types/event";
import DataSection from "./components/DataSection";
import ResourceGrid from "./components/ResourceGrid";
import UserPage from "./components/UserPage";
import { formatDateTime } from "./formatters";

function EventsPage() {
  const loadEvents = useCallback(() => getUpcomingEvents(), []);
  const { data, error, loading } = useApiData(loadEvents, "No pudimos cargar los eventos por ahora.");

  return (
    <UserPage
      title="Eventos"
      subtitle="Explora actividades disponibles para participar en la universidad."
    >
      <DataSection<Event>
        data={data}
        emptyDescription="Vuelve a consultar pronto para encontrar nuevas actividades."
        emptyTitle="No hay eventos disponibles"
        error={error}
        loading={loading}
        render={(items) => (
          <ResourceGrid
            items={items}
            renderDescription={(event) => event.description}
            renderMeta={(event) => (
              <Typography color="text.secondary" variant="body2">
                {formatDateTime(event.dateTime)} · {event.location ?? "Lugar por confirmar"}
              </Typography>
            )}
            renderTitle={(event) => event.name}
          />
        )}
      />
    </UserPage>
  );
}

export default EventsPage;
