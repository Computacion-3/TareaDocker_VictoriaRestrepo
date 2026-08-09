import type { ReactNode } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import PageHeader from "../../../components/layout/PageHeader";

interface TrainerPageProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  actions?: ReactNode;
}

function TrainerPage({
  title,
  subtitle,
  children,
  actions,
}: TrainerPageProps) {
  return (
    <DashboardLayout role="TRAINER" roleLabel="Entrenador">
      <PageHeader title={title} subtitle={subtitle} actions={actions} />
      {children}
    </DashboardLayout>
  );
}

export default TrainerPage;
