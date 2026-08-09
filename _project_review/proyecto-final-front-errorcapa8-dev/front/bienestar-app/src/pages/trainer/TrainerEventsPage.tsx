import { useCallback } from "react";
import { Box, Typography } from "@mui/material";
import GlassCard from "../../components/common/GlassCard";
import { useApiData } from "../../hooks/useApiData";
import { getUpcomingEvents } from "../../services/eventService";
import type { Event } from "../../types/event";
import TrainerDataSection from "./components/TrainerDataSection";
import TrainerPage from "./components/TrainerPage";
import { formatDateTime } from "./formatters";

function TrainerEventsPage() {
  const loadEvents = useCallback(() => getUpcomingEvents(), []);
  const { data, error, loading } = useApiData(loadEvents, "No pudimos cargar los eventos.");

  return (
    <TrainerPage
      title="Eventos"
      subtitle="Explora actividades disponibles para tus acompanamientos."
    >
      <TrainerDataSection<Event>
        data={data}
        emptyDescription="Vuelve a consultar pronto para encontrar nuevas actividades."
        emptyTitle="No hay eventos disponibles"
        error={error}
        loading={loading}
        render={(items) => (
          <Box className="module-grid">
            {items.map((event) => (
              <GlassCard key={event.id} variant="dashboard">
                <Typography variant="h5">{event.name}</Typography>
                <Typography color="text.secondary" sx={{ mt: 1, lineHeight: 1.6 }}>
                  {event.description}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 2 }} variant="body2">
                  {formatDateTime(event.dateTime)} - {event.location ?? "Lugar por confirmar"}
                </Typography>
              </GlassCard>
            ))}
          </Box>
        )}
      />
    </TrainerPage>
  );
}

export default TrainerEventsPage;
