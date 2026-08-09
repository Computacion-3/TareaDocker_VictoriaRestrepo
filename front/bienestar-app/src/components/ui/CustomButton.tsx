import { Button, type ButtonProps } from "@mui/material";
import type { ReactNode } from "react";

interface CustomButtonProps {
  children: ReactNode;
  onClick?: ButtonProps["onClick"];
  variant?: ButtonProps["variant"];
  color?: ButtonProps["color"];
  disabled?: boolean;
}

function CustomButton({
  children,
  onClick,
  variant = "contained",
  color = "primary",
  disabled = false
}: CustomButtonProps) {
  return (
    <Button
      variant={variant}
      color={color}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
}

export default CustomButton;
