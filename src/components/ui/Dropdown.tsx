"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropdownContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  position: { top: number; left: number } | null;
  setPosition: (position: { top: number; left: number } | null) => void;
}

const DropdownContext = React.createContext<DropdownContextValue | null>(null);

function useDropdownContext() {
  const context = React.useContext(DropdownContext);
  if (!context) {
    throw new Error("Dropdown components must be used within a Dropdown");
  }
  return context;
}

interface DropdownProps {
  children: React.ReactNode;
  className?: string;
}

export function Dropdown({ children, className }: DropdownProps) {
  const [open, setOpen] = React.useState(false);
  const [position, setPosition] = React.useState<{ top: number; left: number } | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  // Calculate position function
  const calculatePosition = React.useCallback(() => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const gap = 4; // Gap between trigger and dropdown

    // Get actual dropdown dimensions if available, otherwise use estimates
    let dropdownHeight = 150; // Default estimate
    let dropdownWidth = 200; // Default estimate

    if (contentRef.current) {
      const contentRect = contentRef.current.getBoundingClientRect();
      dropdownHeight = contentRect.height || dropdownHeight;
      dropdownWidth = contentRect.width || dropdownWidth;
    }

    // Calculate initial position (below, aligned to right)
    let top = triggerRect.bottom + gap;
    let left = triggerRect.right - dropdownWidth;

    // Flip to top if not enough space below
    const spaceBelow = viewportHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;
    
    if (spaceBelow < dropdownHeight + gap && spaceAbove > dropdownHeight + gap) {
      top = triggerRect.top - dropdownHeight - gap;
    }

    // Adjust horizontal position if it goes off-screen
    if (left < 8) {
      // If too far left, align to left edge of trigger
      left = triggerRect.left;
    } else if (left + dropdownWidth > viewportWidth - 8) {
      // If too far right, align to right edge of viewport
      left = viewportWidth - dropdownWidth - 8;
    }

    setPosition({ top, left });
  }, []);

  // Calculate position when dropdown opens
  React.useEffect(() => {
    if (open && triggerRef.current) {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        calculatePosition();
        // Recalculate after a short delay to get actual dimensions
        setTimeout(() => {
          calculatePosition();
        }, 0);
      });
    } else {
      setPosition(null);
    }
  }, [open, calculatePosition]);

  // Recalculate position on scroll or resize
  React.useEffect(() => {
    if (!open) return;

    const handleScroll = () => {
      calculatePosition();
    };

    const handleResize = () => {
      calculatePosition();
    };

    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [open, calculatePosition]);

  // Handle click outside
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
      // Use setTimeout to avoid immediate closure
      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [open]);

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [open]);

  return (
    <DropdownContext.Provider
      value={{ open, setOpen, triggerRef, contentRef, position, setPosition }}
    >
      <div className={cn("relative", className)}>{children}</div>
    </DropdownContext.Provider>
  );
}

interface DropdownTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  icon?: React.ReactNode;
}

export function DropdownTrigger({ className, children, icon, ...props }: DropdownTriggerProps) {
  const { open, setOpen, triggerRef } = useDropdownContext();

  return (
    <button
      ref={triggerRef}
      type="button"
      data-slot="dropdown-trigger"
      onClick={() => setOpen(!open)}
      className={cn(
        "flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg",
        "bg-bg-card border border-border-primary text-text-primary",
        "hover:bg-bg-tertiary hover:border-border-accent",
        "focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-border-accent",
        "transition-colors",
        open && "ring-2 ring-accent-primary/20 border-border-accent",
        className
      )}
      {...props}
    >
      {children || icon}
    </button>
  );
}

interface DropdownContentProps {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "right";
}

export function DropdownContent({ children, className, align = "right" }: DropdownContentProps) {
  const { open, position, contentRef, triggerRef, setPosition } = useDropdownContext();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Recalculate position after content is rendered
  React.useEffect(() => {
    if (open && contentRef.current && position) {
      const recalculate = () => {
        if (!contentRef.current || !triggerRef.current) return;
        
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const contentRect = contentRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const gap = 4;

        let top = triggerRect.bottom + gap;
        let left = triggerRect.right - contentRect.width;

        // Flip to top if not enough space
        const spaceBelow = viewportHeight - triggerRect.bottom;
        const spaceAbove = triggerRect.top;
        
        if (spaceBelow < contentRect.height + gap && spaceAbove > contentRect.height + gap) {
          top = triggerRect.top - contentRect.height - gap;
        }

        // Adjust horizontal
        if (left < 8) {
          left = triggerRect.left;
        } else if (left + contentRect.width > viewportWidth - 8) {
          left = viewportWidth - contentRect.width - 8;
        }

        setPosition({ top, left });
      };

      // Recalculate after render
      requestAnimationFrame(() => {
        recalculate();
      });
    }
  }, [open, position, contentRef, setPosition]);

  if (!open || !position || !mounted) return null;

  const content = (
    <div
      ref={contentRef}
      data-slot="dropdown-content"
      className={cn(
        "fixed z-[9999] min-w-[180px] rounded-lg border border-border-primary bg-bg-card shadow-lg bg-bg-secondary p-2",
        className
      )}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {children}
    </div>
  );

  return createPortal(content, document.body);
}

interface DropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  danger?: boolean;
}

export function DropdownItem({ children, icon, danger, className, ...props }: DropdownItemProps) {
  const { setOpen } = useDropdownContext();

  return (
    <button
      type="button"
      onClick={(e) => {
        setOpen(false);
        props.onClick?.(e);
      }}
      className={cn(
        "w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors cursor-pointer rounded-lg hover:bg-bg-tertiary",
        "hover:bg-bg-tertiary",
        danger
          ? "text-red-400 hover:text-red-300 hover:bg-red-500/10"
          : "text-text-primary hover:text-text-secondary",
        className
      )}
      {...props}
    >
      {icon && <span className="w-4 h-4 shrink-0">{icon}</span>}
      <span className="flex-1">{children}</span>
    </button>
  );
}
