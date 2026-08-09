import type { User } from "./user";

export interface Role {
  id: number;
  name: string;
  description?: string;
}

export interface UserRequest {
  name: string;
  email: string;
  password: string;
  roleId: number;
}

export interface TrainerAssignment {
  id: number;
  trainerId: number;
  trainerName: string;
  assignedUserId: number;
  assignedUserName: string;
  assignedAt?: string;
  active: boolean;
}

export interface TrainerAssignmentRequest {
  trainerId: number;
  assignedUserId: number;
  active?: boolean;
}

export interface AdminSummary {
  assignments: number;
  events: number;
  exercises: number;
  notifications: number;
  spaces: number;
  trainers: number;
  users: number;
}

export interface AdminUserData {
  roles: Role[];
  users: User[];
}
