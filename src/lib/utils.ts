import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getColor(value: number, isDatabase: boolean): string {
  if (isDatabase) {
    if (value > 200) return "#ef4444";
    if (value > 150) return "#eab308";
    return "#22c55e";
  } else {
    if (value >= 90) return "#ef4444";
    if (value >= 80) return "#eab308";
    return "#22c55e";
  }
}

export function getProgressColor(value: number, isDatabase: boolean): string {
  if (isDatabase) {
    if (value > 200) return "bg-red-500";
    if (value > 150) return "bg-yellow-500";
    return "bg-green-500";
  } else {
    if (value >= 90) return "bg-red-500";
    if (value >= 80) return "bg-yellow-500";
    return "bg-green-500";
  }
}

export function formatUptime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hours}h ${minutes}m ${secs}s`;
}