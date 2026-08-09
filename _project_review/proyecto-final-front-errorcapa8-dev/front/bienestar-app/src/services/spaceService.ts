import api from "./api";
import type { Space } from "../types/space";

export const getSpaces = async (): Promise<Space[]> => {
  const response = await api.get<Space[]>("/spaces");

  return response.data;
};
