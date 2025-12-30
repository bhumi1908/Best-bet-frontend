"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog";

interface PopupProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    contentClassName?: string;
    headerClassName?: string;
    bodyClassName?: string;
    footerClassName?: string;
}

export function Popup({
    open,
    onOpenChange,
    title,
    description,
    children,
    footer,
    contentClassName,
    headerClassName,
    bodyClassName,
    footerClassName,
}: PopupProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
                    "flex flex-col max-h-[80vh] p-0 !w-[80vw] lg:!w-3xl !max-w-none bg-black border-white/10",
                    contentClassName
                )}
            >
                {/* Close Button */}
                <button
                    type="button"
                    onClick={() => onOpenChange(false)}
                    className="absolute right-4 top-4 z-10 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 disabled:pointer-events-none"
                    aria-label="Close"
                >
                    <X className="h-4 w-4 text-text-primary" />
                    <span className="sr-only">Close</span>
                </button>

                {/* Header */}
                <div className={cn("flex-shrink-0 border-b border-white/10", headerClassName)}>
                    <DialogHeader>
                        <DialogTitle className="text-white text-2xl font-bold">{title}</DialogTitle>
                        {description && <DialogDescription className="text-gray-400">{description}</DialogDescription>}
                    </DialogHeader>
                </div>

                {/* Body - Scrollable */}
                <div
                    className={cn(
                        "flex-1 overflow-y-auto px-2 pt-2 pb-4 min-h-0",
                        bodyClassName
                    )}
                >
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className={cn("flex-shrink-0 py-2 border-t border-border-primary", footerClassName)}>
                        <DialogFooter className="mt-0">
                            {footer}
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}