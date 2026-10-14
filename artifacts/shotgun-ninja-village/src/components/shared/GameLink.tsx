import type { ReactNode } from "react";
import { gameDestination } from "@/data/game";

export function GameLink({
  children = "Visit game launch site",
  className,
  onClick,
}: {
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <a
      href={gameDestination.url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={onClick}
    >
      {children}
      <span className="sr-only"> — launch pending; opens in a new tab</span>
    </a>
  );
}
