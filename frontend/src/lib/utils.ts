import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { UAParser } from "ua-parser-js";

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

export const parseUserAgent = (ua: string) => {
  const parser = new UAParser(ua);
  const browser = parser.getBrowser();
  const os = parser.getOS();
  const device = parser.getDevice();

  return {
    browser: browser.name || "Unknown Browser",
    os: os.name || "Unknown OS",
    device: device.type || "desktop"
  };
}

export const getAvatarUrl = (uuid?: string | null) => {
  if (!uuid) return null;

  // Uploadcare optimized avatar transformation
  return `https://ucarecdn.com/${uuid}/-/scale_crop/256x256/smart/-/quality/smart/-/format/auto/`;
};