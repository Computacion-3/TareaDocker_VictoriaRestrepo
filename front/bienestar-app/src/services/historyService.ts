import api from "./api";
import type { ActivityHistory } from "../types/history";

export const getMyHistory = async (): Promise<ActivityHistory> => {
  const response = await api.get<ActivityHistory>("/history/me");

  return response.data;
};

export const getHistoryByUser = async (userId: number): Promise<ActivityHistory> => {
  const response = await api.get<ActivityHistory>(`/history/users/${userId}`);

  return response.data;
};
