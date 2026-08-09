import { useCallback } from "react";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BadgeIcon from "@mui/icons-material/Badge";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import GroupsIcon from "@mui/icons-material/Groups";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PlaceIcon from "@mui/icons-material/Place";
import { Box, Typography } from "@mui/material";
import StatCard from "../../components/common/StatCard";
import { useApiData } from "../../hooks/useApiData";
import {
  getAdminSpaces,
  getAssignments,
  getEvents,
  getExercises,
  getNotifications,
  getRegularUsers,
  getTrainers,
} from "../../services/adminService";
import type { AdminSummary } from "../../types/admin";
import AdminActionCard from "./components/AdminActionCard";
import AdminPage from "./components/AdminPage";

function AdminDashboardPage() {
  const loadSummary = useCallback(async (): Promise<AdminSummary> => {
    const [users, trainers, assignments, exercises, events, spaces, notifications] = await Promise.all([
      getRegularUsers(),
      getTrainers(),
      getAssignments(),
      getExercises(),
      getEvents(),
      getAdminSpaces(),
      getNotifications(),
    ]);

    return {
      assignments: assignments.length,
      events: events.length,
      exercises: exercises.length,
      notifications: notifications.length,
      spaces: spaces.length,
      trainers: trainers.length,
      users: users.length,
    };
  }, []);

  const { data } = useApiData(loadSummary, "No pudimos cargar el resumen administrativo.");

  const stats = [
    { helper: "Comunidad activa", icon: <GroupsIcon />, label: "Usuarios", value: String(data?.users ?? "--") },
    { helper: "Equipo de acompanamiento", icon: <BadgeIcon />, label: "Entrenadores", value: String(data?.trainers ?? "--") },
    { helper: "Actividades programadas", icon: <CalendarMonthIcon />, label: "Eventos", value: String(data?.events ?? "--") },
    { helper: "Lugares disponibles", icon: <PlaceIcon />, label: "Espacios", value: String(data?.spaces ?? "--") },
  ];

  const cards = [
    {
      description: "Administra participantes, altas, ediciones y retiros.",
      icon: <GroupsIcon />,
      options: [
        { label: "Ver usuarios", to: "/admin/users" },
        { label: "Crear usuario", to: "/admin/users/new" },
      ],
      summary: `${data?.users ?? "--"} usuarios registrados`,
      title: "Usuarios",
    },
    {
      description: "Gestiona el equipo entrenador y sus datos de acceso.",
      icon: <ManageAccountsIcon />,
      options: [
        { label: "Ver entrenadores", to: "/admin/trainers" },
        { label: "Crear entrenador", to: "/admin/trainers/new" },
      ],
      summary: `${data?.trainers ?? "--"} entrenadores disponibles`,
      title: "Entrenadores",
    },
    {
      description: "Relaciona usuarios con entrenadores responsables.",
      icon: <AssignmentIcon />,
      options: [{ label: "Gestionar asignaciones", to: "/admin/assignments" }],
      summary: `${data?.assignments ?? "--"} asignaciones registradas`,
      title: "Asignaciones",
    },
    {
      description: "Mantiene el catalogo institucional de ejercicios.",
      icon: <FitnessCenterIcon />,
      options: [{ label: "Gestionar ejercicios", to: "/admin/exercises" }],
      summary: `${data?.exercises ?? "--"} ejercicios en catalogo`,
      title: "Ejercicios",
    },
    {
      description: "Crea y organiza actividades de bienestar.",
      icon: <CalendarMonthIcon />,
      options: [{ label: "Gestionar eventos", to: "/admin/events" }],
      summary: `${data?.events ?? "--"} eventos registrados`,
      title: "Eventos",
    },
    {
      description: "Controla espacios, disponibilidad y capacidad.",
      icon: <PlaceIcon />,
      options: [{ label: "Gestionar espacios", to: "/admin/spaces" }],
      summary: `${data?.spaces ?? "--"} espacios registrados`,
      title: "Espacios",
    },
    {
      description: "Envia avisos a los participantes de bienestar.",
      icon: <NotificationsIcon />,
      options: [{ label: "Gestionar notificaciones", to: "/admin/notifications" }],
      summary: `${data?.notifications ?? "--"} notificaciones registradas`,
      title: "Notificaciones",
    },
    {
      description: "Consulta una vista general de la gestion activa.",
      icon: <BadgeIcon />,
      options: [
        { label: "Usuarios y entrenadores", to: "/admin/users" },
        { label: "Eventos y espacios", to: "/admin/events" },
      ],
      summary: `${(data?.users ?? 0) + (data?.trainers ?? 0)} perfiles activos`,
      title: "Resumen general",
    },
  ];

  return (
    <AdminPage
      title="Panel de control"
      subtitle="Control de usuarios, entrenadores, asignaciones y recursos."
    >
      <Box className="stats-grid">
        {stats.map((stat) => (
          <StatCard key={stat.label} helper={stat.helper} icon={stat.icon} label={stat.label} value={stat.value} />
        ))}
      </Box>
      <Typography color="text.secondary" sx={{ mb: 2 }} variant="body2">
        Accesos principales para gestionar la operacion de bienestar.
      </Typography>
      <Box className="module-grid">
        {cards.map((card) => (
          <AdminActionCard key={card.title} {...card} />
        ))}
      </Box>
    </AdminPage>
  );
}

export default AdminDashboardPage;
