import { useCallback } from "react";
import { Typography } from "@mui/material";
import { useApiData } from "../../hooks/useApiData";
import { getSpaces } from "../../services/spaceService";
import type { Space } from "../../types/space";
import DataSection from "./components/DataSection";
import ResourceGrid from "./components/ResourceGrid";
import UserPage from "./components/UserPage";
import { yesNo } from "./formatters";

function SpacesPage() {
  const loadSpaces = useCallback(() => getSpaces(), []);
  const { data, error, loading } = useApiData(loadSpaces, "No pudimos cargar los espacios por ahora.");

  return (
    <UserPage
      title="Espacios"
      subtitle="Consulta lugares disponibles para actividad fisica y bienestar."
    >
      <DataSection<Space>
        data={data}
        emptyDescription="Los espacios disponibles apareceran aqui."
        emptyTitle="No hay espacios disponibles"
        error={error}
        loading={loading}
        render={(items) => (
          <ResourceGrid
            items={items}
            renderDescription={(space) => space.description}
            renderMeta={(space) => (
              <Typography color="text.secondary" variant="body2">
                {space.location} · Capacidad {space.capacity} · {yesNo(space.available)}
              </Typography>
            )}
            renderTitle={(space) => space.name}
          />
        )}
      />
    </UserPage>
  );
}

export default SpacesPage;
