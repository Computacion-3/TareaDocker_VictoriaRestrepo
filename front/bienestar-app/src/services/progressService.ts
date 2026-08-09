import api from "./api";
import type { ProgressEntry, ProgressRequest } from "../types/progress";

export const getMyProgress = async (): Promise<ProgressEntry[]> => {
  const response = await api.get<ProgressEntry[]>("/progress/me");

  return response.data;
};

export const createProgress = async (
  progress: ProgressRequest
): Promise<ProgressEntry> => {
  const response = await api.post<ProgressEntry>("/progress", progress);

  return response.data;
};
