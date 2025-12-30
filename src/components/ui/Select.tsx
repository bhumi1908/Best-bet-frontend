"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectContextValue {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

const SelectContext = React.createContext<SelectContextValue | null>(null);

function useSelectContext() {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error("Select components must be used within a Select");
  }
  return context;
}

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

function Select({ value, onValueChange, children, disabled = false, className }: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        contentRef.current &&
        !contentRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen, triggerRef, contentRef }}>
      <div className={cn("relative", className)}>{children}</div>
    </SelectContext.Provider>
  );
}

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  size?: "sm" | "default" | "middle";
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: SelectTriggerProps) {
  const { open, setOpen, triggerRef, value } = useSelectContext();

  return (
    <button
      ref={triggerRef}
      type="button"
      data-slot="select-trigger"
      data-size={size}
      onClick={() => setOpen(!open)}
      className={cn(
        "flex w-full items-center justify-between bg-bg-primary gap-2 rounded-lg border border-border-primary bg-bg-card px-3 py-2 text-sm text-text-primary",
        "hover:bg-bg-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-border-accent",
        "disabled:cursor-not-allowed disabled:opacity-50",
        size === "default" || size === "middle" ? "h-9" : size === "sm" ? "h-8" : "h-9",
        open && "ring-2 ring-accent-primary/20 border-border-accent",
        className
      )}
      {...props}
    >
      <span className="flex-1 text-left truncate">{children || value || "Select..."}</span>
      <ChevronDown
        className={cn(
          "w-4 h-4 text-text-tertiary opacity-50 transition-transform shrink-0",
          open && "transform rotate-180"
        )}
      />
    </button>
  );
}

interface SelectValueProps {
  placeholder?: string;
  children?: React.ReactNode;
}

function SelectValue({ placeholder, children }: SelectValueProps) {
  const { value } = useSelectContext();
  return <>{children || value || placeholder || "Select..."}</>;
}

interface DropdownPosition {
  top: number;
  left: number;
  width: number;
  placement: "bottom-left" | "bottom-right" | "top-left" | "top-right";
}

interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
  position?: "popper" | "item-aligned";
  align?: "start" | "center" | "end";
}

function SelectContent({
  children,
  className,
  position = "popper",
  align = "start",
}: SelectContentProps) {
  const { open, setOpen, triggerRef, contentRef } = useSelectContext();
  const [mounted, setMounted] = React.useState(false);
  const [dropdownPosition, setDropdownPosition] = React.useState<DropdownPosition | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const isOpenRef = React.useRef(open);

  // Mount check for portal
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate dropdown position with smart positioning logic
  const calculatePosition = React.useCallback(() => {
    if (!triggerRef.current) return;

    // getBoundingClientRect() returns viewport-relative coordinates
    // Since we use 'fixed' positioning, we need viewport coordinates (not document coordinates)
    const rect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Always try to get actual height from DOM first
    let dropdownHeight = 200; // Default fallback
    if (contentRef.current) {
      const currentHeight = contentRef.current.offsetHeight;
      if (currentHeight > 0) {
        dropdownHeight = currentHeight;
      }
    }

    const dropdownWidth = rect.width; // Match trigger width
    const gap = 8; // 8px gap between trigger and dropdown

    // Calculate available space
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    // Determine vertical placement (top or bottom)
    // Prefer bottom placement when there's sufficient space
    const minRequiredSpace = 100; // Minimum space needed (reduced for better UX)
    const canPlaceBelow = spaceBelow >= minRequiredSpace;
    const shouldPlaceAbove = !canPlaceBelow && spaceAbove > spaceBelow;

    // Determine horizontal placement
    let placement: "bottom-left" | "bottom-right" | "top-left" | "top-right";
    let left: number;
    let width: number;

    // Calculate left position - align with trigger's left edge
    // Use viewport coordinates directly (no scroll offset needed for fixed positioning)
    left = rect.left;
    width = dropdownWidth;

    // Ensure dropdown doesn't overflow viewport horizontally
    const rightEdge = left + width;
    if (rightEdge > viewportWidth) {
      // Shift left to fit in viewport
      left = Math.max(8, viewportWidth - width - 8);
    }

    // Ensure dropdown doesn't overflow viewport on the left
    if (left < 8) {
      left = 8;
    }

    // Set placement based on vertical position
    if (shouldPlaceAbove) {
      placement = "top-left";
    } else {
      placement = "bottom-left";
    }

    // Calculate top position using viewport coordinates
    // When opening upward: position dropdown's bottom edge 8px above trigger's top edge
    // When opening downward: position dropdown's top edge 8px below trigger's bottom edge
    const top = shouldPlaceAbove
      ? rect.top - dropdownHeight - gap
      : rect.bottom + gap;

    setDropdownPosition({
      top,
      left,
      width,
      placement,
    });
  }, [triggerRef, contentRef]);

  // Update isOpenRef when open changes
  React.useEffect(() => {
    isOpenRef.current = open;
  }, [open]);

  // Update position when opening, scrolling, or window resizes
  React.useEffect(() => {
    if (!open) {
      setDropdownPosition(null);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    // Calculate position immediately and multiple times to catch height changes
    calculatePosition();

    // Recalculate after a short delay to catch any DOM updates
    const timeoutId1 = setTimeout(() => {
      calculatePosition();
    }, 0);

    const timeoutId2 = setTimeout(() => {
      calculatePosition();
    }, 10);

    // Use requestAnimationFrame for continuous position tracking during scroll
    const updatePosition = () => {
      if (isOpenRef.current && triggerRef.current) {
        calculatePosition();
        rafRef.current = requestAnimationFrame(updatePosition);
      } else {
        rafRef.current = null;
      }
    };

    // Start continuous tracking
    rafRef.current = requestAnimationFrame(updatePosition);

    const handleResize = () => {
      calculatePosition();
    };

    const handleScroll = () => {
      calculatePosition();
    };

    // Listen to scroll events on window and all scrollable containers
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);
    document.addEventListener("scroll", handleScroll, true);

    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [open, calculatePosition, triggerRef]);

  if (!open || !mounted || typeof document === "undefined") return null;

  // If no position yet, render off-screen to measure
  const style = dropdownPosition
    ? {
      top: `${dropdownPosition.top}px`,
      left: `${dropdownPosition.left}px`,
      width: `${dropdownPosition.width}px`,
    }
    : {
      // Render off-screen for initial measurement
      top: "-9999px",
      left: "-9999px",
      visibility: "hidden" as const,
    };

  return createPortal(
    <div
      ref={contentRef}
      data-slot="select-content"
      className={cn(
        "fixed z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-lg border border-border-primary bg-bg-card text-text-primary shadow-lg",
        dropdownPosition && "animate-in fade-in-0 zoom-in-95",
        className
      )}
      style={style}
    >
      <div className="p-1 max-h-96 overflow-y-auto">{children}</div>
    </div>,
    document.body
  );
}

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
}

function SelectItem({ value, children, disabled = false, className, ...props }: SelectItemProps) {
  const { value: selectedValue, onValueChange, setOpen } = useSelectContext();
  const isSelected = selectedValue === value;

  return (
    <div
      data-slot="select-item"
      onClick={() => {
        if (!disabled) {
          onValueChange(value);
          setOpen(false);
        }
      }}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
        "hover:bg-bg-tertiary focus:bg-bg-tertiary",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && <Check className="h-4 w-4 text-accent-primary" />}
      </span>
      <span>{children}</span>
    </div>
  );
}

interface SelectGroupProps {
  children: React.ReactNode;
  className?: string;
}

function SelectGroup({ children, className }: SelectGroupProps) {
  return (
    <div data-slot="select-group" className={cn("", className)}>
      {children}
    </div>
  );
}

interface SelectLabelProps {
  children: React.ReactNode;
  className?: string;
}

function SelectLabel({ children, className }: SelectLabelProps) {
  return (
    <div
      data-slot="select-label"
      className={cn("px-2 py-1.5 text-xs font-medium text-text-muted", className)}
    >
      {children}
    </div>
  );
}

interface SelectSeparatorProps {
  className?: string;
}

function SelectSeparator({ className }: SelectSeparatorProps) {
  return (
    <div
      data-slot="select-separator"
      className={cn("bg-border-primary -mx-1 my-1 h-px", className)}
    />
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
