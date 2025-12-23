"use client";

import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectContextValue {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
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
}

function Select({ value, onValueChange, children, disabled = false }: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        const content = document.querySelector('[data-slot="select-content"]');
        if (content && !content.contains(event.target as Node)) {
          setOpen(false);
        }
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen, triggerRef }}>
      <div className="relative">{children}</div>
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
  const { open, setOpen, triggerRef } = useSelectContext();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [positionStyle, setPositionStyle] = React.useState<React.CSSProperties>({});

  React.useEffect(() => {
    if (open && triggerRef.current && contentRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      let top = triggerRect.bottom + 4;
      let left = triggerRect.left;

      // Adjust if content would overflow bottom
      if (top + contentRect.height > viewportHeight) {
        top = triggerRect.top - contentRect.height - 4;
      }

      // Adjust if content would overflow right
      if (left + contentRect.width > viewportWidth) {
        left = viewportWidth - contentRect.width - 8;
      }

      // Adjust if content would overflow left
      if (left < 8) {
        left = 8;
      }
      setPositionStyle({
        position: "absolute",
        top: "100%",
        left: 0,
        marginTop: "4px",
        width: "100%",
        zIndex: 50,
      });

    }
  }, [open, triggerRef]);

  if (!open) return null;

  return (
    <div
      ref={contentRef}
      data-slot="select-content"
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-lg border border-border-primary bg-bg-card text-text-primary shadow-lg",
        "animate-in fade-in-0 zoom-in-95",
        className
      )}
      style={positionStyle}
    >
      <div className="p-1">{children}</div>
    </div>
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
