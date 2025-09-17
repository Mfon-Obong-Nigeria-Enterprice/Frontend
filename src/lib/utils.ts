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


export function timeAgo(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  let diffMs = now.getTime() - past.getTime();

  const inFuture = diffMs < 0;
  if (inFuture) diffMs = Math.abs(diffMs);

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  let result = "";
  if (days > 0) {
    result = `${days} ${days === 1 ? "day" : "days"}`;
  } else if (hours > 0) {
    result = `${hours} ${hours === 1 ? "hour" : "hours"}`;
  } else if (minutes > 0) {
    result = `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  } else {
    result = `${seconds} ${seconds === 1 ? "second" : "seconds"}`;
  }

  return inFuture ? `in ${result}` : `${result} ago`;
}

export function formatUptime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hours}h ${minutes}m ${secs}s`;
}