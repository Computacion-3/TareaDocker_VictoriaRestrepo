import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import BarChartIcon from "@mui/icons-material/BarChart";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ChecklistIcon from "@mui/icons-material/Checklist";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import HistoryIcon from "@mui/icons-material/History";
import InsightsIcon from "@mui/icons-material/Insights";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PlaceIcon from "@mui/icons-material/Place";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import { Box, Typography } from "@mui/material";
import StatCard from "../../components/common/StatCard";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/layout/PageHeader";
import { getUpcomingEvents } from "../../services/eventService";
import { getAvailableExercises } from "../../services/exerciseService";
import { getMyHistory } from "../../services/historyService";
import { getMyNotifications } from "../../services/notificationService";
import { getMyProgress } from "../../services/progressService";
import { getMyRecommendations } from "../../services/recommendationService";
import { getMyRoutines } from "../../services/routineService";
import { getSpaces } from "../../services/spaceService";
import { getMyWeeklyStats } from "../../services/statsService";
import UserActionCard, { type UserCardOption } from "./components/UserActionCard";

interface DashboardSummary {
  events: number | null;
  exercises: number | null;
  historyEntries: number | null;
  minutes: number | null;
  notifications: number | null;
  progressEntries: number | null;
  recommendations: number | null;
  routines: number | null;
  spaces: number | null;
}

interface UserHomeCard {
  title: string;
  description: string;
  icon: ReactNode;
  summary: string;
  options: UserCardOption[];
}

const initialSummary: DashboardSummary = {
  events: null,
  exercises: null,
  historyEntries: null,
  minutes: null,
  notifications: null,
  progressEntries: null,
  recommendations: null,
  routines: null,
  spaces: null,
};

const countText = (
  count: number | null,
  singular: string,
  plural: string,
  fallback: string,
  loading: boolean
) => {
  if (loading) {
    return "Cargando informacion";
  }

  if (count === null) {
    return fallback;
  }

  return count === 1 ? `1 ${singular}` : `${count} ${plural}`;
};

function UserDashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary>(initialSummary);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;

    const loadSummary = async () => {
      try {
        setLoading(true);
        setLoadError(false);

        const [
          routines,
          exercises,
          progress,
          history,
          recommendations,
          events,
          spaces,
          notifications,
          weeklyStats,
        ] = await Promise.all([
          getMyRoutines(),
          getAvailableExercises(),
          getMyProgress(),
          getMyHistory(),
          getMyRecommendations(),
          getUpcomingEvents(),
          getSpaces(),
          getMyNotifications(),
          getMyWeeklyStats(),
        ]);

        if (active) {
          setSummary({
            events: events.length,
            exercises: exercises.length,
            historyEntries: history.entries.length,
            minutes: weeklyStats.totalMinutes,
            notifications: notifications.length,
            progressEntries: progress.length,
            recommendations: recommendations.length,
            routines: routines.length,
            spaces: spaces.length,
          });
        }
      } catch {
        if (active) {
          setLoadError(true);
          setSummary(initialSummary);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadSummary();

    return () => {
      active = false;
    };
  }, []);

  const fallback = loadError
    ? "Consulta disponible"
    : "Informacion disponible";

  const cards: UserHomeCard[] = [
    {
      title: "Rutinas",
      description: "Consulta y organiza tus planes de entrenamiento personal.",
      icon: <ChecklistIcon />,
      summary: countText(summary.routines, "rutina activa", "rutinas activas", fallback, loading),
      options: [
        { label: "Ver mis rutinas", to: "/app/routines" },
        { label: "Crear rutina", to: "/app/routines/new" },
        { label: "Adoptar rutina prediseñada", to: "/app/routines" },
      ],
    },
    {
      title: "Ejercicios",
      description: "Explora movimientos y practicas para fortalecer tu actividad fisica.",
      icon: <FitnessCenterIcon />,
      summary: countText(summary.exercises, "ejercicio disponible", "ejercicios disponibles", fallback, loading),
      options: [
        { label: "Ver ejercicios disponibles", to: "/app/exercises" },
        { label: "Crear ejercicio personalizado", to: "/app/exercises" },
      ],
    },
    {
      title: "Progreso",
      description: "Registra y revisa avances de tus entrenamientos.",
      icon: <InsightsIcon />,
      summary: countText(summary.progressEntries, "registro de progreso", "registros de progreso", fallback, loading),
      options: [
        { label: "Registrar progreso", to: "/app/progress" },
        { label: "Ver registros", to: "/app/progress" },
      ],
    },
    {
      title: "Historial",
      description: "Sigue tu recorrido de actividad fisica en el tiempo.",
      icon: <HistoryIcon />,
      summary: countText(summary.historyEntries, "actividad registrada", "actividades registradas", fallback, loading),
      options: [
        { label: "Ver historial de actividad", to: "/app/history" },
      ],
    },
    {
      title: "Estadisticas",
      description: "Visualiza indicadores de participacion y rendimiento.",
      icon: <BarChartIcon />,
      summary: summary.minutes === null
        ? countText(null, "", "", fallback, loading)
        : `${summary.minutes} minutos esta semana`,
      options: [
        { label: "Ver estadisticas semanales y mensuales", to: "/app/stats" },
      ],
    },
    {
      title: "Recomendaciones",
      description: "Recibe orientaciones para mejorar tu entrenamiento.",
      icon: <TipsAndUpdatesIcon />,
      summary: countText(summary.recommendations, "recomendacion", "recomendaciones", fallback, loading),
      options: [
        { label: "Ver recomendaciones", to: "/app/recommendations" },
      ],
    },
    {
      title: "Eventos",
      description: "Explora actividades disponibles en la universidad.",
      icon: <CalendarMonthIcon />,
      summary: countText(summary.events, "evento disponible", "eventos disponibles", fallback, loading),
      options: [
        { label: "Explorar eventos", to: "/app/events" },
      ],
    },
    {
      title: "Espacios",
      description: "Consulta lugares disponibles para actividad fisica.",
      icon: <PlaceIcon />,
      summary: countText(summary.spaces, "espacio disponible", "espacios disponibles", fallback, loading),
      options: [
        { label: "Ver espacios disponibles", to: "/app/spaces" },
      ],
    },
    {
      title: "Reportes",
      description: "Descarga tu reporte personal de progreso.",
      icon: <PictureAsPdfIcon />,
      summary: "Reporte personal disponible para descarga",
      options: [
        { label: "Descargar reporte personal", to: "/app/reports" },
      ],
    },
    {
      title: "Notificaciones",
      description: "Revisa avisos y novedades de tu experiencia de bienestar.",
      icon: <NotificationsIcon />,
      summary: countText(summary.notifications, "notificacion", "notificaciones", fallback, loading),
      options: [
        { label: "Ver notificaciones", to: "/app/notifications" },
      ],
    },
  ];

  return (
    <DashboardLayout role="USER" roleLabel="Usuario">
      <PageHeader
        title="Panel Estudiantil"
        subtitle="Descubre, participa y gestiona tu experiencia de actividad fisica."
      />

      <Box className="stats-grid">
        <StatCard
          helper="Planes de entrenamiento"
          icon={<ChecklistIcon />}
          label="Rutinas"
          value={summary.routines === null ? "--" : String(summary.routines)}
        />
        <StatCard
          helper="Actividad semanal"
          icon={<BarChartIcon />}
          label="Minutos"
          value={summary.minutes === null ? "--" : String(summary.minutes)}
        />
        <StatCard
          helper="Avances registrados"
          icon={<InsightsIcon />}
          label="Progreso"
          value={summary.progressEntries === null ? "--" : String(summary.progressEntries)}
        />
        <StatCard
          helper="Actividades universitarias"
          icon={<CalendarMonthIcon />}
          label="Eventos"
          value={summary.events === null ? "--" : String(summary.events)}
        />
      </Box>

      <Box>
        <Typography color="text.secondary" sx={{ mb: 2 }} variant="body2">
          Accesos principales para gestionar tu experiencia de bienestar.
        </Typography>
        <Box className="module-grid">
          {cards.map((card) => (
            <UserActionCard key={card.title} {...card} />
          ))}
        </Box>
      </Box>
    </DashboardLayout>
  );
}

export default UserDashboardPage;
