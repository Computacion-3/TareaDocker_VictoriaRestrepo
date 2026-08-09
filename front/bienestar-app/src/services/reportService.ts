import api from "./api";

export const downloadMyProgressReport = async (): Promise<Blob> => {
  const response = await api.get<Blob>("/reports/progress/me/pdf", {
    responseType: "blob",
  });

  return response.data;
};
