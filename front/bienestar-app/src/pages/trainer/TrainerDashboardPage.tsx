import { useCallback } from "react";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import BarChartIcon from "@mui/icons-material/BarChart";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import GroupsIcon from "@mui/icons-material/Groups";
import InsightsIcon from "@mui/icons-material/Insights";
import PlaceIcon from "@mui/icons-material/Place";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import ViewListIcon from "@mui/icons-material/ViewList";
import { Box, Typography } from "@mui/material";
import StatCard from "../../components/common/StatCard";
import { useApiData } from "../../hooks/useApiData";
import { getUpcomingEvents } from "../../services/eventService";
import { getRoutineTemplates } from "../../services/routineService";
import { getSpaces } from "../../services/spaceService";
import {
  getAssignedUserProgress,
  getAssignedUserRecommendations,
  getAssignedUserRoutines,
  getMyAssignedUsers,
} from "../../services/trainerService";
import TrainerActionCard from "./components/TrainerActionCard";
import TrainerPage from "./components/TrainerPage";

interface TrainerHomeSummary {
  events: number;
  progress: number;
  recommendations: number;
  routines: number;
  spaces: number;
  templates: number;
  users: number;
}

const summaryText = (count: number | undefined, singular: string, plural: string) => {
  if (count === undefined) {
    return "Cargando informacion";
  }

  return count === 1 ? `1 ${singular}` : `${count} ${plural}`;
};

function TrainerDashboardPage() {
  const loadSummary = useCallback(async (): Promise<TrainerHomeSummary> => {
    const [users, templates, events, spaces] = await Promise.all([
      getMyAssignedUsers(),
      getRoutineTemplates(),
      getUpcomingEvents(),
      getSpaces(),
    ]);
    const [routinesGroups, progressGroups, recommendationGroups] = await Promise.all([
      Promise.all(users.map((user) => getAssignedUserRoutines(user.id))),
      Promise.all(users.map((user) => getAssignedUserProgress(user.id))),
      Promise.all(users.map((user) => getAssignedUserRecommendations(user.id))),
    ]);

    return {
      events: events.length,
      progress: progressGroups.flat().length,
      recommendations: recommendationGroups.flat().length,
      routines: routinesGroups.flat().length,
      spaces: spaces.length,
      templates: templates.length,
      users: users.length,
    };
  }, []);

  const { data } = useApiData(loadSummary, "No pudimos cargar el resumen del entrenador.");

  const cards = [
    {
      title: "Usuarios asignados",
      description: "Consulta los estudiantes que tienes en seguimiento.",
      icon: <GroupsIcon />,
      summary: summaryText(data?.users, "usuario asignado", "usuarios asignados"),
      options: [
        { label: "Ver usuarios asignados", to: "/trainer/users" },
        { label: "Revisar detalle de usuario", to: "/trainer/users" },
      ],
    },
    {
      title: "Seguimiento de progreso",
      description: "Revisa avances y actividad de tus usuarios asignados.",
      icon: <InsightsIcon />,
      summary: summaryText(data?.progress, "registro de progreso", "registros de progreso"),
      options: [
        { label: "Ver progreso de usuarios", to: "/trainer/users" },
        { label: "Revisar historial", to: "/trainer/users" },
      ],
    },
    {
      title: "Rutinas de usuarios",
      description: "Consulta planes de entrenamiento asociados a tus estudiantes.",
      icon: <AssignmentTurnedInIcon />,
      summary: summaryText(data?.routines, "rutina de usuario", "rutinas de usuarios"),
      options: [
        { label: "Ver rutinas de usuarios", to: "/trainer/users" },
        { label: "Revisar rutinas predisenadas", to: "/trainer/templates" },
      ],
    },
    {
      title: "Estadisticas de usuarios",
      description: "Consulta indicadores semanales y mensuales por usuario.",
      icon: <BarChartIcon />,
      summary: "Indicadores disponibles por usuario",
      options: [
        { label: "Ver estadisticas de usuarios", to: "/trainer/users" },
      ],
    },
    {
      title: "Recomendaciones",
      description: "Envia y consulta orientaciones para tus usuarios asignados.",
      icon: <TipsAndUpdatesIcon />,
      summary: summaryText(data?.recommendations, "recomendacion", "recomendaciones"),
      options: [
        { label: "Ver recomendaciones enviadas", to: "/trainer/recommendations" },
        { label: "Crear recomendacion", to: "/trainer/recommendations/new" },
      ],
    },
    {
      title: "Rutinas predisenadas",
      description: "Consulta y crea planes reutilizables de entrenamiento.",
      icon: <ViewListIcon />,
      summary: summaryText(data?.templates, "rutina predisenada", "rutinas predisenadas"),
      options: [
        { label: "Ver rutinas predisenadas", to: "/trainer/templates" },
      ],
    },
    {
      title: "Eventos",
      description: "Explora actividades disponibles en la universidad.",
      icon: <CalendarMonthIcon />,
      summary: summaryText(data?.events, "evento disponible", "eventos disponibles"),
      options: [
        { label: "Explorar eventos", to: "/trainer/events" },
      ],
    },
    {
      title: "Espacios",
      description: "Consulta lugares disponibles para actividad fisica.",
      icon: <PlaceIcon />,
      summary: summaryText(data?.spaces, "espacio disponible", "espacios disponibles"),
      options: [
        { label: "Ver espacios disponibles", to: "/trainer/spaces" },
      ],
    },
  ];

  return (
    <TrainerPage
      title="Panel de Entrenador"
      subtitle="Gestiona acompanamiento, recomendaciones y progreso de usuarios."
    >
      <Box className="stats-grid">
        <StatCard
          helper="Estudiantes en seguimiento"
          icon={<GroupsIcon />}
          label="Usuarios"
          value={data ? String(data.users) : "--"}
        />
        <StatCard
          helper="Registros revisables"
          icon={<InsightsIcon />}
          label="Progreso"
          value={data ? String(data.progress) : "--"}
        />
        <StatCard
          helper="Orientaciones enviadas"
          icon={<TipsAndUpdatesIcon />}
          label="Recomendaciones"
          value={data ? String(data.recommendations) : "--"}
        />
        <StatCard
          helper="Actividades disponibles"
          icon={<CalendarMonthIcon />}
          label="Eventos"
          value={data ? String(data.events) : "--"}
        />
      </Box>

      <Box>
        <Typography color="text.secondary" sx={{ mb: 2 }} variant="body2">
          Accesos principales para gestionar tu acompanamiento.
        </Typography>
        <Box className="module-grid">
          {cards.map((card) => (
            <TrainerActionCard key={card.title} {...card} />
          ))}
        </Box>
      </Box>
    </TrainerPage>
  );
}

export default TrainerDashboardPage;
