import { useCallback } from "react";
import { Box } from "@mui/material";
import { useApiData } from "../../hooks/useApiData";
import { getMyAssignedUsers } from "../../services/trainerService";
import type { User } from "../../types/user";
import AssignedUserCard from "./components/AssignedUserCard";
import TrainerDataSection from "./components/TrainerDataSection";
import TrainerPage from "./components/TrainerPage";

function TrainerUsersPage() {
  const loadUsers = useCallback(() => getMyAssignedUsers(), []);
  const { data, error, loading } = useApiData(loadUsers, "No pudimos cargar tus usuarios asignados.");

  return (
    <TrainerPage
      title="Usuarios asignados"
      subtitle="Consulta los estudiantes que tienes en seguimiento."
    >
      <TrainerDataSection<User>
        data={data}
        emptyDescription="Cuando tengas usuarios asignados, apareceran aqui."
        emptyTitle="Aun no tienes usuarios asignados"
        error={error}
        loading={loading}
        render={(items) => (
          <Box className="module-grid">
            {items.map((user) => (
              <AssignedUserCard key={user.id} user={user} />
            ))}
          </Box>
        )}
      />
    </TrainerPage>
  );
}

export default TrainerUsersPage;
