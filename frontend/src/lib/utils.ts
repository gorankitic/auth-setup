import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getInitials = (name: string = "") => {
  const parts = name.trim().split(" ").filter(Boolean);

  // parts       = ["Goran", "Kitic"]
  // parts[0]    = "Goran"
  // parts[0][0] = "G"
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0][0].toUpperCase();

  const first = parts[0][0];
  const last = parts[parts.length - 1][0];

  return (first + last).toUpperCase();
}