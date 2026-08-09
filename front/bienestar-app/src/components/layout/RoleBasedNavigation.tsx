import { Box, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export type DashboardRole = "USER" | "TRAINER" | "ADMIN";

interface RoleBasedNavigationProps {
  role: DashboardRole;
}

interface RoleItem {
  label: string;
  to?: string;
}

const roleItems: Record<DashboardRole, RoleItem[]> = {
  USER: [
    { label: "Inicio", to: "/app" },
    { label: "Rutinas", to: "/app/routines" },
    { label: "Ejercicios", to: "/app/exercises" },
    { label: "Progreso", to: "/app/progress" },
    { label: "Eventos", to: "/app/events" },
  ],
  TRAINER: [
    { label: "Inicio", to: "/trainer" },
    { label: "Usuarios", to: "/trainer/users" },
    { label: "Recomendaciones", to: "/trainer/recommendations" },
    { label: "Rutinas", to: "/trainer/templates" },
    { label: "Eventos", to: "/trainer/events" },
    { label: "Espacios", to: "/trainer/spaces" },
  ],
  ADMIN: [
    { label: "Inicio", to: "/admin" },
    { label: "Usuarios", to: "/admin/users" },
    { label: "Entrenadores", to: "/admin/trainers" },
    { label: "Asignaciones", to: "/admin/assignments" },
    { label: "Ejercicios", to: "/admin/exercises" },
    { label: "Eventos", to: "/admin/events" },
    { label: "Espacios", to: "/admin/spaces" },
    { label: "Notificaciones", to: "/admin/notifications" },
  ],
};

function RoleBasedNavigation({ role }: RoleBasedNavigationProps) {
  return (
    <Box aria-label="Navegacion por rol" className="role-nav" component="nav">
      {roleItems[role].map((item) => (
        <Typography
          component={item.to ? RouterLink : "span"}
          key={item.label}
          sx={{
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "var(--radius-pill)",
            color: "rgba(255, 255, 255, 0.62)",
            fontSize: "0.78rem",
            px: 1.25,
            py: 0.55,
            textDecoration: "none",
            transition: "color 0.2s ease, border-color 0.2s ease",
            whiteSpace: "nowrap",
            "&:hover": item.to
              ? {
                  borderColor: "rgba(255, 255, 255, 0.2)",
                  color: "#bfdbfe",
                }
              : undefined,
          }}
          to={item.to}
        >
          {item.label}
        </Typography>
      ))}
    </Box>
  );
}

export default RoleBasedNavigation;
