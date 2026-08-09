export interface RoutineSummary {
  id: number;
  name: string;
  difficulty: string;
}

export interface EventSummary {
  id: number;
  title: string;
  date: string;
}

export interface ExerciseSummary {
  id: number;
  name: string;
  category: string;
}

export interface ProgressSummary {
  id: number;
  weight: number;
  date: string;
}
