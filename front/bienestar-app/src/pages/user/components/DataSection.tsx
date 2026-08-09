import type { ReactNode } from "react";
import EmptyState from "../../../components/common/EmptyState";
import ErrorMessage from "../../../components/common/ErrorMessage";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

interface DataSectionProps<T> {
  data: T[] | null | undefined;
  emptyDescription?: string;
  emptyTitle: string;
  error: string | null;
  loading: boolean;
  render: (items: T[]) => ReactNode;
}

function DataSection<T>({
  data,
  emptyDescription,
  emptyTitle,
  error,
  loading,
  render,
}: DataSectionProps<T>) {
  if (loading) {
    return <LoadingSpinner label="Cargando informacion" />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!data || data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return <>{render(data)}</>;
}

export default DataSection;
