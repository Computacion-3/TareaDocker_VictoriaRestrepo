import type { Exercise } from "./exercise";

export interface RoutineExerciseDetail {
  id?: number;
  exerciseId?: number;
  exerciseName?: string;
  sets?: number | null;
  repetitions?: number | null;
  duration?: number | null;
  orderIndex?: number | null;
  notes?: string | null;
}

export interface RoutineExerciseRequest {
  exerciseId: number;
  sets?: number;
  repetitions?: number;
  duration?: number;
  orderIndex?: number;
  notes?: string;
}

export interface Routine {
  id: number;
  name: string;
  description: string;
  ownerId?: number | null;
  ownerName?: string | null;
  createdById?: number | null;
  createdByName?: string | null;
  predefined: boolean;
  active: boolean;
  exercises?: Exercise[];
  exerciseDetails?: RoutineExerciseDetail[];
}

export interface RoutineRequest {
  name: string;
  description: string;
  exerciseDetails?: RoutineExerciseRequest[];
}
