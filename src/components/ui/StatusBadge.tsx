import { Check, X } from "lucide-react";

export const StatusBadge = ({
  active,
  activeText = "Active",
  inactiveText = "Inactive",
}: {
  active: boolean;
  activeText?: string;
  inactiveText?: string;
}) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
      active
        ? "bg-green-500/20 text-green-400 border-green-500/30"
        : "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }`}
  >
    {active ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
    {active ? activeText : inactiveText}
  </span>
);
