export interface ProgressEntry {
  id: number;
  date: string;
  periodType?: string | null;
  repetitions?: number | null;
  timeMinutes?: number | null;
  effortLevel: string;
  weight?: number | null;
  notes?: string | null;
  routineId?: number | null;
  routineName?: string | null;
  exerciseId?: number | null;
  exerciseName?: string | null;
}

export interface ProgressRequest {
  date: string;
  periodType?: string;
  repetitions?: number;
  timeMinutes?: number;
  effortLevel: string;
  weight?: number;
  notes?: string;
  routineId?: number;
  exerciseId?: number;
}
