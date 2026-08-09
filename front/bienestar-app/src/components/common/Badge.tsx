import { Chip, type ChipProps } from "@mui/material";

type BadgeTone = "default" | "success" | "warning" | "danger" | "info";

interface BadgeProps extends Omit<ChipProps, "color"> {
  tone?: BadgeTone;
}

const toneColors: Record<BadgeTone, string> = {
  default: "rgba(148, 163, 184, 0.16)",
  success: "rgba(134, 239, 172, 0.16)",
  warning: "rgba(253, 230, 138, 0.16)",
  danger: "rgba(252, 165, 165, 0.16)",
  info: "rgba(96, 165, 250, 0.16)",
};

function Badge({ tone = "default", sx, ...props }: BadgeProps) {
  return (
    <Chip
      {...props}
      size={props.size ?? "small"}
      sx={{
        border: "1px solid rgba(255, 255, 255, 0.12)",
        background: toneColors[tone],
        color: "rgba(255, 255, 255, 0.86)",
        fontWeight: 700,
        ...sx,
      }}
    />
  );
}

export default Badge;
