export interface StatsPoint {
  label: string;
  date: string;
  totalMinutes: number;
  totalRepetitions: number;
  averageEffortLevel?: number | null;
  entriesCount: number;
}

export interface UserStats {
  userId: number;
  userName: string;
  period: string;
  startDate: string;
  endDate: string;
  totalProgressEntries: number;
  totalMinutes: number;
  totalRepetitions: number;
  averageEffortLevel?: number | null;
  totalWeightVolume?: number | null;
  points: StatsPoint[];
}
