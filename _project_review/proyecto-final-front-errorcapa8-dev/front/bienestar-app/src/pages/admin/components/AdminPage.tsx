import type { ReactNode } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import PageHeader from "../../../components/layout/PageHeader";

interface AdminPageProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  actions?: ReactNode;
}

function AdminPage({ title, subtitle, children, actions }: AdminPageProps) {
  return (
    <DashboardLayout role="ADMIN" roleLabel="Administrador">
      <PageHeader title={title} subtitle={subtitle} actions={actions} />
      {children}
    </DashboardLayout>
  );
}

export default AdminPage;
