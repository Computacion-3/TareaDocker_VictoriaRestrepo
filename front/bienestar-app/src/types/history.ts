export interface HistorySummary {
  totalProgressEntries: number;
  totalMinutes: number;
  totalRepetitions: number;
  averageEffortLevel?: number | null;
  lastActivityDate?: string | null;
  completedRoutineCount: number;
  activeRoutineCount: number;
}

export interface HistoryEntry {
  progressId: number;
  date: string;
  periodType?: string | null;
  routineId?: number | null;
  routineName?: string | null;
  exerciseId?: number | null;
  exerciseName?: string | null;
  repetitions?: number | null;
  timeMinutes?: number | null;
  effortLevel: string;
  weight?: number | null;
  notes?: string | null;
}

export interface ActivityHistory {
  userId: number;
  userName: string;
  email: string;
  summary: HistorySummary;
  entries: HistoryEntry[];
}
