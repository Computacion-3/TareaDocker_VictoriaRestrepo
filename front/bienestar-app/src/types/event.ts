import type { Space } from "./space";

export interface Event {
  id: number;
  name: string;
  description: string;
  eventType: string;
  dateTime: string;
  endDateTime?: string | null;
  capacity?: number | null;
  location?: string | null;
  active: boolean;
  spaces?: Space[];
  createdByName?: string | null;
}

export interface EventRequest {
  name: string;
  description: string;
  eventType?: string;
  dateTime: string;
  endDateTime?: string;
  capacity?: number;
  location: string;
  spaceIds?: number[];
}
