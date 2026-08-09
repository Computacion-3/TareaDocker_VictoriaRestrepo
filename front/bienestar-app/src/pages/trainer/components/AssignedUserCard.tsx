import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AppButton from "../../../components/common/AppButton";
import GlassCard from "../../../components/common/GlassCard";
import type { User } from "../../../types/user";

interface AssignedUserCardProps {
  user: User;
}

function AssignedUserCard({ user }: AssignedUserCardProps) {
  const navigate = useNavigate();

  return (
    <GlassCard variant="dashboard" sx={{ display: "flex", flexDirection: "column", gap: 2, minHeight: 190 }}>
      <Box sx={{ flex: 1 }}>
        <Typography variant="h5">{user.name}</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.75 }}>
          {user.email}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">
          {user.active ? "Activo" : "Inactivo"}
        </Typography>
      </Box>
      <AppButton appVariant="secondary" onClick={() => navigate(`/trainer/users/${user.id}`)}>
        Ver detalle
      </AppButton>
    </GlassCard>
  );
}

export default AssignedUserCard;
