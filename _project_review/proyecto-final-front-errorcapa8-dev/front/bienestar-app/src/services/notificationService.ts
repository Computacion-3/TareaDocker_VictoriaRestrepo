import api from "./api";
import type { UserNotification } from "../types/notification";

export const getMyNotifications = async (): Promise<UserNotification[]> => {
  const response = await api.get<UserNotification[]>("/notifications/me");

  return response.data;
};
