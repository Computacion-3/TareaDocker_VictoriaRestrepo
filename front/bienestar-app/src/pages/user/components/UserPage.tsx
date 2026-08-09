import type { ReactNode } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import PageHeader from "../../../components/layout/PageHeader";

interface UserPageProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  actions?: ReactNode;
}

function UserPage({
  title,
  subtitle,
  children,
  actions,
}: UserPageProps) {
  return (
    <DashboardLayout role="USER" roleLabel="Usuario">
      <PageHeader title={title} subtitle={subtitle} actions={actions} />
      {children}
    </DashboardLayout>
  );
}

export default UserPage;
