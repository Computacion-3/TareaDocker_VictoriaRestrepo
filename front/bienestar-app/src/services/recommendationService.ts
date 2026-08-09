import api from "./api";
import type { Recommendation, RecommendationRequest } from "../types/recommendation";

export const getMyRecommendations = async (): Promise<Recommendation[]> => {
  const response = await api.get<Recommendation[]>("/recommendations/me");

  return response.data;
};

export const getRecommendationsByUser = async (
  userId: number
): Promise<Recommendation[]> => {
  const response = await api.get<Recommendation[]>(`/recommendations/user/${userId}`);

  return response.data;
};

export const createRecommendationForUser = async (
  userId: number,
  recommendation: RecommendationRequest
): Promise<Recommendation> => {
  const response = await api.post<Recommendation>(
    `/recommendations/users/${userId}`,
    recommendation
  );

  return response.data;
};
