import api from "./api";
import type {
  Role,
  TrainerAssignment,
  TrainerAssignmentRequest,
  UserRequest,
} from "../types/admin";
import type { Event, EventRequest } from "../types/event";
import type { Exercise, ExerciseRequest } from "../types/exercise";
import type { UserNotification, NotificationRequest } from "../types/notification";
import type { Space, SpaceRequest } from "../types/space";
import type { User } from "../types/user";

export const getRoles = async (): Promise<Role[]> => {
  const response = await api.get<Role[]>("/roles");
  return response.data;
};

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>("/users");
  return response.data;
};

export const getRegularUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>("/users/regular");
  return response.data;
};

export const getTrainers = async (): Promise<User[]> => {
  const response = await api.get<User[]>("/users/trainers");
  return response.data;
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await api.get<User>(`/users/${id}`);
  return response.data;
};

export const createUser = async (user: UserRequest): Promise<User> => {
  const response = await api.post<User>("/users", user);
  return response.data;
};

export const updateUser = async (id: number, user: UserRequest): Promise<User> => {
  const response = await api.put<User>(`/users/${id}`, user);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}`);
};

export const getAssignments = async (): Promise<TrainerAssignment[]> => {
  const response = await api.get<TrainerAssignment[]>("/trainer-assignments");
  return response.data;
};

export const createAssignment = async (
  assignment: TrainerAssignmentRequest
): Promise<TrainerAssignment> => {
  const response = await api.post<TrainerAssignment>("/trainer-assignments", assignment);
  return response.data;
};

export const updateAssignment = async (
  id: number,
  assignment: TrainerAssignmentRequest
): Promise<TrainerAssignment> => {
  const response = await api.put<TrainerAssignment>(`/trainer-assignments/${id}`, assignment);
  return response.data;
};

export const deleteAssignment = async (id: number): Promise<void> => {
  await api.delete(`/trainer-assignments/${id}`);
};

export const getExercises = async (): Promise<Exercise[]> => {
  const response = await api.get<Exercise[]>("/exercises");
  return response.data;
};

export const createExercise = async (exercise: ExerciseRequest): Promise<Exercise> => {
  const response = await api.post<Exercise>("/exercises", exercise);
  return response.data;
};

export const updateExercise = async (
  id: number,
  exercise: ExerciseRequest
): Promise<Exercise> => {
  const response = await api.put<Exercise>(`/exercises/${id}`, exercise);
  return response.data;
};

export const deleteExercise = async (id: number): Promise<void> => {
  await api.delete(`/exercises/${id}`);
};

export const getEvents = async (): Promise<Event[]> => {
  const response = await api.get<Event[]>("/events");
  return response.data;
};

export const createEvent = async (event: EventRequest): Promise<Event> => {
  const response = await api.post<Event>("/events", event);
  return response.data;
};

export const updateEvent = async (id: number, event: EventRequest): Promise<Event> => {
  const response = await api.put<Event>(`/events/${id}`, event);
  return response.data;
};

export const deleteEvent = async (id: number): Promise<void> => {
  await api.delete(`/events/${id}`);
};

export const getAdminSpaces = async (): Promise<Space[]> => {
  const response = await api.get<Space[]>("/spaces");
  return response.data;
};

export const createSpace = async (space: SpaceRequest): Promise<Space> => {
  const response = await api.post<Space>("/spaces", space);
  return response.data;
};

export const updateSpace = async (id: number, space: SpaceRequest): Promise<Space> => {
  const response = await api.put<Space>(`/spaces/${id}`, space);
  return response.data;
};

export const deleteSpace = async (id: number): Promise<void> => {
  await api.delete(`/spaces/${id}`);
};

export const getNotifications = async (): Promise<UserNotification[]> => {
  const response = await api.get<UserNotification[]>("/notifications");
  return response.data;
};

export const createNotification = async (
  notification: NotificationRequest
): Promise<UserNotification> => {
  const response = await api.post<UserNotification>("/notifications", notification);
  return response.data;
};

export const updateNotification = async (
  id: number,
  notification: NotificationRequest
): Promise<UserNotification> => {
  const response = await api.put<UserNotification>(`/notifications/${id}`, notification);
  return response.data;
};

export const deleteNotification = async (id: number): Promise<void> => {
  await api.delete(`/notifications/${id}`);
};
