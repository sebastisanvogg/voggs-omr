import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind-aware className concatenator. Resolves duplicate utility
 * conflicts in favor of the last one (`twMerge` semantics).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
