export interface Recommendation {
  id: number;
  trainerId: number;
  trainerName: string;
  targetUserId: number;
  targetUserName: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  relatedProgressId?: number | null;
  relatedRoutineId?: number | null;
}

export interface RecommendationRequest {
  title: string;
  message: string;
  relatedProgressId?: number;
  relatedRoutineId?: number;
}
