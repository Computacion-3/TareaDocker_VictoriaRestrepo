import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import {
  selectIsAuthenticated,
  selectRoles,
} from "../store/authSlice";
import { getHomePathByRole } from "../utils/roleUtils";

function RootRedirect() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const roles = useSelector(selectRoles);

  if (!isAuthenticated) {
    return <Navigate replace to="/login" />;
  }

  return <Navigate replace to={getHomePathByRole(roles)} />;
}

export default RootRedirect;
