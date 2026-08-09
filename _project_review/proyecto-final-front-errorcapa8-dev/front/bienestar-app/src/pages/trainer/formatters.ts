export const formatDate = (value?: string | null) => {
  if (!value) {
    return "Fecha por confirmar";
  }

  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

export const formatDateTime = (value?: string | null) => {
  if (!value) {
    return "Fecha por confirmar";
  }

  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};
