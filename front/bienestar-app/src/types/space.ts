export interface Space {
  id: number;
  name: string;
  type: string;
  description: string;
  location: string;
  available: boolean;
  capacity: number;
  openingHours?: string | null;
  closingHours?: string | null;
  active: boolean;
}

export interface SpaceRequest {
  name: string;
  type: string;
  description?: string;
  location?: string;
  available: boolean;
  capacity: number;
  openingHours?: string;
  closingHours?: string;
}
