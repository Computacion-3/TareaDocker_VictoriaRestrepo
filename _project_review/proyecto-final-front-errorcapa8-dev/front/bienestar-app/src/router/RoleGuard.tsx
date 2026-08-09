import type { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

import {
  selectIsAuthenticated,
  selectRoles,
} from "../store/authSlice";
import type { RoleName } from "../types/auth";
import { hasRole } from "../utils/roleUtils";

interface RoleGuardProps {
  allowedRoles: RoleName[];
  children: ReactNode;
}

function RoleGuard({
  allowedRoles,
  children,
}: RoleGuardProps) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const roles = useSelector(selectRoles);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  if (!hasRole(roles, allowedRoles)) {
    return <Navigate replace to="/unauthorized" />;
  }

  return children;
}

export default RoleGuard;
