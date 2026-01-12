import { cn } from "@/lib/utils";
import { formatWinningNumbers } from "@/utilities/formatting";

interface WinningNumbersProps {
  numbers: string;
  className?: string;
  numberClassName?: string;
  size?: "small" | "medium" | "large";
}

/**
 * Reusable component for displaying winning numbers
 * Formats and displays numbers as circular badges
 */
export const WinningNumbers: React.FC<WinningNumbersProps> = ({
  numbers,
  className,
  numberClassName,
  size = "medium",
}) => {
  const formattedNumbers = formatWinningNumbers(numbers);

  const sizeClasses = {
    small: "w-6 h-6 text-xs",
    medium: "w-8 sm:w-10 h-8 sm:h-10 text-md",
    large: "w-12 h-12 text-lg",
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {formattedNumbers.map((num, idx) => (
        <span
          key={idx}
          className={cn(
            "rounded-full flex items-center justify-center font-semibold border-2 bg-yellow-400 text-black border-yellow-400",
            sizeClasses[size],
            numberClassName
          )}
        >
          {Number(num)}
        </span>
      ))}
    </div>
  );
};
