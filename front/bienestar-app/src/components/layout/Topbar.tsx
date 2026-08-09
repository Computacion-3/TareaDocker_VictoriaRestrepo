import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AppButton from "../common/AppButton";
import logoIcesi from "../../assets/images/logoIcesi.png";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  logout,
  selectRoles,
  selectUser,
} from "../../store/authSlice";
import { persistor } from "../../store/store";
import { getPrimaryRole } from "../../utils/roleUtils";
import { clearPersistedSession } from "../../utils/storage";
import RoleBasedNavigation, { type DashboardRole } from "./RoleBasedNavigation";

interface TopbarProps {
  role: DashboardRole;
  roleLabel: string;
}

function Topbar({
  role,
  roleLabel,
}: TopbarProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const roles = useAppSelector(selectRoles);
  const primaryRole = getPrimaryRole(roles);
  const displayRole = primaryRole ?? role;
  const displayName = user?.name || user?.email || roleLabel;

  const handleLogout = async () => {
    dispatch(logout());
    await persistor.purge();
    clearPersistedSession();
    void navigate("/login");
  };

  return (
    <Box
      className="glass-nav"
      component="header"
      sx={{ position: "fixed", top: 0, zIndex: "var(--z-navbar)" }}
    >
      <Box className="topbar-inner">
        <Box sx={{ alignItems: "center", display: "flex", gap: 1.5 }}>
          <Typography className="gradient-title" variant="h5">
            Bienestar
          </Typography>
          <Box
            component="img"
            src={logoIcesi}
            alt="Universidad Icesi"
            sx={{
              filter: "brightness(0) invert(1)",
              height: 32,
              objectFit: "contain",
              opacity: 0.86,
              width: "auto",
            }}
          />
        </Box>

        <RoleBasedNavigation role={role} />

        <Box className="topbar-actions">
          <Typography
            color="text.secondary"
            sx={{ display: { xs: "none", sm: "block" } }}
            variant="body2"
          >
            {`${displayName} - ${displayRole}`}
          </Typography>
          <Box
            aria-label={`Avatar ${roleLabel}`}
            sx={{
              alignItems: "center",
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "50%",
              display: "flex",
              fontWeight: 700,
              height: 40,
              justifyContent: "center",
              width: 40,
            }}
          >
            {displayName.charAt(0)}
          </Box>
          <AppButton appVariant="secondary" onClick={handleLogout} sx={{ minHeight: 36 }}>
            Logout
          </AppButton>
        </Box>
      </Box>
    </Box>
  );
}

export default Topbar;
