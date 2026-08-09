import api from "./api";
import type {
  Routine,
  RoutineExerciseDetail,
  RoutineExerciseRequest,
  RoutineRequest,
} from "../types/routine";

export const getMyRoutines = async (): Promise<Routine[]> => {
  const response = await api.get<Routine[]>("/routines/me");

  return response.data;
};

export const getRoutineTemplates = async (): Promise<Routine[]> => {
  const response = await api.get<Routine[]>("/routines/templates");

  return response.data;
};

export const createRoutine = async (
  routine: RoutineRequest
): Promise<Routine> => {
  const response = await api.post<Routine>("/routines", routine);

  return response.data;
};

export const createRoutineTemplate = async (
  routine: RoutineRequest
): Promise<Routine> => {
  const response = await api.post<Routine>("/routines/templates", routine);

  return response.data;
};

export const updateRoutine = async (
  routineId: number,
  routine: RoutineRequest
): Promise<Routine> => {
  const response = await api.put<Routine>(`/routines/${routineId}`, routine);

  return response.data;
};

export const adoptRoutineTemplate = async (
  templateId: number
): Promise<Routine> => {
  const response = await api.post<Routine>(`/routines/templates/${templateId}/adopt`);

  return response.data;
};

export const addExerciseToRoutine = async (
  routineId: number,
  exercise: RoutineExerciseRequest
): Promise<RoutineExerciseDetail> => {
  const response = await api.post<RoutineExerciseDetail>(
    `/routine-exercises/routine/${routineId}`,
    exercise
  );

  return response.data;
};
