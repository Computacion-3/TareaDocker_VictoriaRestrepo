import { useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import LoadingSpinner from "../components/common/LoadingSpinner";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchMeThunk } from "../features/auth/authThunks";
import {
  logout,
  selectIsAuthenticated,
  selectToken,
} from "../store/authSlice";
import { clearPersistedSession } from "../utils/storage";

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const token = useAppSelector(selectToken);
  const location = useLocation();
  const navigate = useNavigate();
  const [validatingSession, setValidatingSession] =
    useState(Boolean(token));

  useEffect(() => {
    let isMounted = true;

    if (!token) {
      return undefined;
    }

    void dispatch(fetchMeThunk())
      .catch(() => {
        dispatch(logout());
        clearPersistedSession();
        void navigate("/login", { replace: true, state: { from: location } });
      })
      .finally(() => {
        if (isMounted) {
          setValidatingSession(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [dispatch, location, navigate, token]);

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  if (validatingSession) {
    return <LoadingSpinner label="Validando sesion" />;
  }

  return children;
}

export default ProtectedRoute;
