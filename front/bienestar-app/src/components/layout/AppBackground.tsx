import type { CSSProperties, ReactNode } from "react";
import backgroundImage from "../../assets/images/background.jpg";
import backgroundHomeImage from "../../assets/images/backgroundHome.png";

interface AppBackgroundProps {
  children: ReactNode;
  variant?: "auth" | "dashboard";
}

function AppBackground({
  children,
  variant = "dashboard",
}: AppBackgroundProps) {
  const image =
    variant === "auth" ? backgroundImage : backgroundHomeImage;

  return (
    <div
      className={`app-background app-background-${variant}`}
      style={{
        "--app-background-image": `url(${image})`,
      } as CSSProperties}
    >
      {children}
    </div>
  );
}

export default AppBackground;
