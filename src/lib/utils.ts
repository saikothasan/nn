import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names and resolves Tailwind CSS conflicts.
 * * @param inputs - Class names, arrays, or objects compatible with clsx
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
