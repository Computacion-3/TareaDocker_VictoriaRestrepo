import api from "./api";
import type { ProgressEntry, ProgressRequest } from "../types/progress";
import type { Recommendation } from "../types/recommendation";
import type { Routine } from "../types/routine";
import type { User } from "../types/user";

export interface TrainerRoutineAssignmentRequest {
  templateId?: number;
  routineId?: number;
  name?: string;
  description?: string;
}

export const getMyAssignedUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>("/trainers/me/users");

  return response.data;
};

export const getAssignedUserRoutines = async (
  userId: number
): Promise<Routine[]> => {
  const response = await api.get<Routine[]>(`/trainers/me/users/${userId}/routines`);

  return response.data;
};

export const assignRoutineToUser = async (
  userId: number,
  assignment: TrainerRoutineAssignmentRequest
): Promise<Routine> => {
  const response = await api.post<Routine>(
    `/trainers/me/users/${userId}/routines`,
    assignment
  );

  return response.data;
};

export const getAssignedUserProgress = async (
  userId: number
): Promise<ProgressEntry[]> => {
  const response = await api.get<ProgressEntry[]>(`/trainers/me/users/${userId}/progress`);

  return response.data;
};

export const createAssignedUserProgress = async (
  userId: number,
  progress: ProgressRequest
): Promise<ProgressEntry> => {
  const response = await api.post<ProgressEntry>(
    `/trainers/me/users/${userId}/progress`,
    progress
  );

  return response.data;
};

export const getAssignedUserRecommendations = async (
  userId: number
): Promise<Recommendation[]> => {
  const response = await api.get<Recommendation[]>(
    `/trainers/me/users/${userId}/recommendations`
  );

  return response.data;
};
