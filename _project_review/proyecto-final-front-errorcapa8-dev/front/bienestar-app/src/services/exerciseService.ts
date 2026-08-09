import api from "./api";
import type { Exercise, ExerciseRequest } from "../types/exercise";

export const getAvailableExercises = async (): Promise<Exercise[]> => {
  const response = await api.get<Exercise[]>("/exercises/available");

  return response.data;
};

export const getMyCustomExercises = async (): Promise<Exercise[]> => {
  const response = await api.get<Exercise[]>("/exercises/custom/me");

  return response.data;
};

export const createCustomExercise = async (
  exercise: ExerciseRequest
): Promise<Exercise> => {
  const response = await api.post<Exercise>("/exercises/custom", exercise);

  return response.data;
};
