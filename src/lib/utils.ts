/**
 * Utility function to merge class names
 * Similar to clsx but simpler for our use case
 */
export function cn(...inputs: (string | undefined | null | boolean)[]): string {
  return inputs
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

