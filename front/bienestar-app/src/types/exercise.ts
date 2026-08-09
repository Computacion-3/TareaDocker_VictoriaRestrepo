export interface Exercise {
  id: number;
  name: string;
  type: string;
  description: string;
  duration?: number | null;
  difficulty: string;
  videoUrl?: string | null;
  active: boolean;
  custom: boolean;
  createdById?: number | null;
  createdByName?: string | null;
}

export interface ExerciseRequest {
  name: string;
  type: string;
  description: string;
  duration?: number;
  difficulty: string;
  videoUrl?: string;
}
