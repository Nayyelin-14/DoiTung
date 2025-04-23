import { clsx } from "clsx";
import { OrbitProgress } from "react-loading-indicators";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatDuration = (duration) => {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.round(duration % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const SpinLoader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <OrbitProgress color="#32cd32" size="medium" text="" textColor="" />;
    </div>
  );
};
