import { Box, CircularProgress, Typography } from "@mui/material";

interface LoadingSpinnerProps {
  label?: string;
}

function LoadingSpinner({ label = "Cargando" }: LoadingSpinnerProps) {
  return (
    <Box
      sx={{
        display: "grid",
        minHeight: 160,
        placeItems: "center",
        gap: 1.5,
      }}
    >
      <CircularProgress />
      <Typography color="text.secondary" variant="body2">
        {label}
      </Typography>
    </Box>
  );
}

export default LoadingSpinner;
