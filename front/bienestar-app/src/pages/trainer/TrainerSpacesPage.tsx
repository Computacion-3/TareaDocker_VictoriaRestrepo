import { useCallback } from "react";
import { Box, Typography } from "@mui/material";
import GlassCard from "../../components/common/GlassCard";
import { useApiData } from "../../hooks/useApiData";
import { getSpaces } from "../../services/spaceService";
import type { Space } from "../../types/space";
import TrainerDataSection from "./components/TrainerDataSection";
import TrainerPage from "./components/TrainerPage";

function TrainerSpacesPage() {
  const loadSpaces = useCallback(() => getSpaces(), []);
  const { data, error, loading } = useApiData(loadSpaces, "No pudimos cargar los espacios.");

  return (
    <TrainerPage
      title="Espacios"
      subtitle="Consulta lugares disponibles para actividad fisica y acompanamiento."
    >
      <TrainerDataSection<Space>
        data={data}
        emptyDescription="Los espacios disponibles apareceran aqui."
        emptyTitle="No hay espacios disponibles"
        error={error}
        loading={loading}
        render={(items) => (
          <Box className="module-grid">
            {items.map((space) => (
              <GlassCard key={space.id} variant="dashboard">
                <Typography variant="h5">{space.name}</Typography>
                <Typography color="text.secondary" sx={{ mt: 1, lineHeight: 1.6 }}>
                  {space.description}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 2 }} variant="body2">
                  {space.location} - Capacidad {space.capacity} - {space.available ? "Disponible" : "No disponible"}
                </Typography>
              </GlassCard>
            ))}
          </Box>
        )}
      />
    </TrainerPage>
  );
}

export default TrainerSpacesPage;
