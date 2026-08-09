import type { ReactNode } from "react";
import AppBackground from "./AppBackground";
import Topbar from "./Topbar";
import type { DashboardRole } from "./RoleBasedNavigation";

interface DashboardLayoutProps {
  children: ReactNode;
  role: DashboardRole;
  roleLabel: string;
}

function DashboardLayout({
  children,
  role,
  roleLabel,
}: DashboardLayoutProps) {
  return (
    <AppBackground variant="dashboard">
      <div className="dashboard-shell">
        <Topbar role={role} roleLabel={roleLabel} />
        <main className="dashboard-content">
          <div className="dashboard-main">
            {children}
          </div>
        </main>
      </div>
    </AppBackground>
  );
}

export default DashboardLayout;
