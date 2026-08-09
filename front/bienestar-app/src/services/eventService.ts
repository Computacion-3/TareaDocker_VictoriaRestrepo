import api from "./api";
import type { Event } from "../types/event";

export const getUpcomingEvents = async (): Promise<Event[]> => {
  const response = await api.get<Event[]>("/events/upcoming");

  return response.data;
};
