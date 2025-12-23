"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialogContext() {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used within a Dialog");
  }
  return context;
}

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

function Dialog({ open, onOpenChange, children }: DialogProps) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {open && <>{children}</>}
    </DialogContext.Provider>
  );
}

interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  asChild?: boolean;
}

function DialogTrigger({ children, asChild, ...props }: DialogTriggerProps) {
  const { onOpenChange } = useDialogContext();
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        onOpenChange(true);
        props.onClick?.(e);
      },
    } as any);
  }

  return (
    <button
      type="button"
      onClick={() => onOpenChange(true)}
      {...props}
    >
      {children}
    </button>
  );
}

interface DialogOverlayProps {
  className?: string;
}

function DialogOverlay({ className }: DialogOverlayProps) {
  const { open, onOpenChange } = useDialogContext();

  if (!open) return null;

  return (
    <div
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/50",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      onClick={() => onOpenChange(false)}
    />
  );
}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  showCloseButton?: boolean;
}

function DialogContent({
  className,
  children,
  showCloseButton = false,
  ...props
}: DialogContentProps) {
  const { open, onOpenChange } = useDialogContext();
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      // Focus the content when opened
      setTimeout(() => {
        contentRef.current?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <>
      <DialogOverlay />
      <div
        ref={contentRef}
        data-slot="dialog-content"
        className={cn(
          "fixed top-[50%] left-[50%] z-50 w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] rounded-lg border border-border-primary bg-bg-card p-6 shadow-lg outline-none sm:max-w-lg",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          className
        )}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
        {...props}
      >
        {children}
        {showCloseButton && (
          <button
            type="button"
            data-slot="dialog-close"
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 disabled:pointer-events-none"
          >
            <X className="w-4 h-4 text-text-primary" />
            <span className="sr-only">Close</span>
          </button>
        )}
      </div>
    </>
  );
}

function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col mb-4", className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-row justify-end gap-3 mt-6",
        className
      )}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      data-slot="dialog-title"
      className={cn("text-lg font-semibold text-text-primary mb-0.5", className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="dialog-description"
      className={cn("text-sm text-text-muted", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
};

