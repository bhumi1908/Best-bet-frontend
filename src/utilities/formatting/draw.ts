/**
 * Gets the draw type label from draw time enum (MID or EVE)
 * @param drawTime - Draw time enum: 'MID' or 'EVE'
 * @returns Draw type label: 'Midday' or 'Evening'
 */
export const getDrawType = (drawTime: string): "Midday" | "Evening" => {
  if (drawTime === "MID") {
    return "Midday";
  }
  return "Evening";
};

/**
 * Formats draw time for display (e.g., "12:00 PM" or "11:00 PM")
 * @param drawTime - Draw time enum: 'MID' or 'EVE'
 * @returns Formatted time string
 */
export const formatDrawTime = (drawTime: string): string => {
  if (drawTime === "MID") {
    return "12:00 PM";
  }
  return "11:00 PM";
};

/**
 * Gets draw time label with enum (e.g., "Midday (MID)" or "Evening (EVE)")
 * @param drawTime - Draw time enum: 'MID' or 'EVE'
 * @returns Formatted label string
 */
export const getDrawTimeLabel = (drawTime: string): string => {
  return drawTime === "MID" ? "Midday (MID)" : "Evening (EVE)";
};

/**
 * Formats winning numbers string to array of single digits
 * Removes any non-digit characters and splits into array
 * @param numbers - Winning numbers string (e.g., "123" or "1-2-3")
 * @returns Array of single digit strings
 */
export const formatWinningNumbers = (numbers: string): string[] => {
  // Remove any non-digit characters first, then split into single digits
  return numbers.replace(/\D/g, "").split("");
};
