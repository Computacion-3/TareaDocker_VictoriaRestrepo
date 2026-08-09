import api from "./api";
import type { UserStats } from "../types/stats";

export const getMyWeeklyStats = async (): Promise<UserStats> => {
  const response = await api.get<UserStats>("/stats/me/weekly");

  return response.data;
};

export const getMyMonthlyStats = async (): Promise<UserStats> => {
  const response = await api.get<UserStats>("/stats/me/monthly");

  return response.data;
};

export const getWeeklyStatsByUser = async (userId: number): Promise<UserStats> => {
  const response = await api.get<UserStats>(`/stats/users/${userId}/weekly`);

  return response.data;
};

export const getMonthlyStatsByUser = async (userId: number): Promise<UserStats> => {
  const response = await api.get<UserStats>(`/stats/users/${userId}/monthly`);

  return response.data;
};
