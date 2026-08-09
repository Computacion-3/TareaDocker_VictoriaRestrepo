import type { UserRole } from "./auth";

export interface User {
  id: number;
  name: string;
  email: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  roleId?: number;
  roleName?: UserRole;
}
