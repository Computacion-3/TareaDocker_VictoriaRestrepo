import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import ModuleCard from "../../components/common/ModuleCard";
import StatCard from "../../components/common/StatCard";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/layout/PageHeader";
import type { DashboardRole } from "../../components/layout/RoleBasedNavigation";

interface DashboardModule {
  title: string;
  description: string;
  icon: ReactNode;
  status?: string;
  actionLabel?: string;
}

interface DashboardStat {
  label: string;
  value: string;
  icon: ReactNode;
  helper?: string;
}

interface RoleDashboardPageProps {
  role: DashboardRole;
  roleLabel: string;
  title: string;
  subtitle: string;
  stats: DashboardStat[];
  modules: DashboardModule[];
}

function RoleDashboardPage({
  role,
  roleLabel,
  title,
  subtitle,
  stats,
  modules,
}: RoleDashboardPageProps) {
  return (
    <DashboardLayout role={role} roleLabel={roleLabel}>
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={
          <Typography
            sx={{
              border: "1px solid rgba(96, 165, 250, 0.3)",
              borderRadius: "var(--radius-pill)",
              color: "#93c5fd",
              fontSize: "0.78rem",
              fontWeight: 700,
              px: 1.5,
              py: 0.65,
            }}
          >
            {roleLabel}
          </Typography>
        }
      />

      <Box className="stats-grid">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            helper={stat.helper}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
          />
        ))}
      </Box>

      <Box>
        <Typography color="text.secondary" sx={{ mb: 2 }} variant="body2">
          Accesos principales para gestionar tu experiencia de bienestar.
        </Typography>
        <Box className="module-grid">
          {modules.map((module) => (
            <ModuleCard
              actionLabel={module.actionLabel}
              key={module.title}
              description={module.description}
              icon={module.icon}
              status={module.status}
              title={module.title}
            />
          ))}
        </Box>
      </Box>
    </DashboardLayout>
  );
}

export default RoleDashboardPage;
