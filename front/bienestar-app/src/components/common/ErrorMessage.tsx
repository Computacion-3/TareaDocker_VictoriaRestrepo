import { Alert } from "@mui/material";

interface ErrorMessageProps {
  message: string;
}

function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <Alert
      severity="error"
      sx={{
        border: "1px solid rgba(252, 165, 165, 0.28)",
        borderRadius: "var(--radius-sm)",
        mb: 1,
        bgcolor: "rgba(127, 29, 29, 0.28)",
        color: "#fecaca",
      }}
    >
      {message}
    </Alert>
  );
}

export default ErrorMessage;
