import { Button, type ButtonProps } from "@mui/material";

type AppButtonVariant = "primary" | "secondary" | "ghost";

interface AppButtonProps extends Omit<ButtonProps, "variant"> {
  appVariant?: AppButtonVariant;
}

function AppButton({
  appVariant = "primary",
  children,
  sx,
  ...buttonProps
}: AppButtonProps) {
  const isPrimary = appVariant === "primary";
  const isGhost = appVariant === "ghost";

  return (
    <Button
      {...buttonProps}
      variant={isPrimary ? "contained" : "outlined"}
      className={isPrimary ? "glass-button" : undefined}
      sx={{
        borderColor:
          isGhost ? "transparent" : "rgba(255, 255, 255, 0.16)",
        borderRadius: "var(--radius-md)",
        color: "#fff",
        background:
          appVariant === "secondary"
            ? "rgba(255, 255, 255, 0.06)"
            : isGhost
              ? "transparent"
              : undefined,
        px: 2,
        transition: "transform 0.2s ease, background 0.2s ease, border-color 0.2s ease",
        "&:hover": {
          borderColor: "rgba(255, 255, 255, 0.28)",
          transform: isPrimary ? undefined : "translateY(-1px)",
          background:
            appVariant === "secondary"
              ? "rgba(255, 255, 255, 0.1)"
              : isGhost
                ? "rgba(255, 255, 255, 0.08)"
              : undefined,
        },
        ...sx,
      }}
    >
      {children}
    </Button>
  );
}

export default AppButton;
