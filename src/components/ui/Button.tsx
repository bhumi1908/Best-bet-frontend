"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

export type ButtonType = "default" | "primary" | "dashed" | "text" | "link";
export type ButtonSize = "small" | "middle" | "large";
export type ButtonShape = "default" | "circle" | "round";
export type ButtonHTMLType = "button" | "submit" | "reset";

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  type?: ButtonType | ButtonHTMLType; // Support both for backward compatibility
  size?: ButtonSize;
  shape?: ButtonShape;
  htmlType?: ButtonHTMLType;
  loading?: boolean | { delay?: number };
  danger?: boolean;
  ghost?: boolean;
  block?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const sizeClasses: Record<ButtonSize, { height: string; padding: string; fontSize: string; iconSize: string }> = {
  small: {
    height: "h-7",
    padding: "px-3",
    fontSize: "text-xs",
    iconSize: "w-3.5 h-3.5",
  },
  middle: {
    height: "h-9",
    padding: "px-4",
    fontSize: "text-sm",
    iconSize: "w-4 h-4",
  },
  large: {
    height: "h-10",
    padding: "px-6",
    fontSize: "text-base",
    iconSize: "w-5 h-5",
  },
};

const typeClasses: Record<ButtonType, { base: string; hover: string; active: string; disabled: string }> = {
  default: {
    base: "bg-bg-card border border-border-primary text-text-primary",
    hover: "hover:bg-bg-tertiary hover:border-border-accent",
    active: "active:bg-bg-tertiary",
    disabled: "disabled:bg-bg-card disabled:text-text-muted disabled:border-border-secondary",
  },
  primary: {
    base: "bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-tertiary text-black border-transparent",
    hover: "hover:from-accent-hover hover:via-accent-primary hover:to-accent-secondary",
    active: "active:opacity-90",
    disabled: "disabled:opacity-50 disabled:cursor-not-allowed",
  },
  dashed: {
    base: "bg-transparent border border-dashed border-border-primary text-text-primary",
    hover: "hover:border-border-accent hover:text-accent-primary",
    active: "active:bg-bg-tertiary",
    disabled: "disabled:border-border-secondary disabled:text-text-muted",
  },
  text: {
    base: "bg-transparent border-transparent text-text-primary",
    hover: "hover:bg-bg-tertiary",
    active: "active:bg-bg-secondary",
    disabled: "disabled:text-text-muted disabled:cursor-not-allowed",
  },
  link: {
    base: "bg-transparent border-transparent text-accent-primary p-0 h-auto",
    hover: "hover:text-accent-hover hover:underline",
    active: "active:text-accent-tertiary",
    disabled: "disabled:text-text-muted disabled:cursor-not-allowed disabled:no-underline",
  },
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      type: typeProp,
      size = "middle",
      shape = "default",
      htmlType: htmlTypeProp,
      loading = false,
      danger = false,
      ghost = false,
      block = false,
      icon,
      children,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const [internalLoading, setInternalLoading] = React.useState(false);
    const loadingDelayTimerRef = React.useRef<NodeJS.Timeout | null>(null);

    React.useEffect(() => {
      if (typeof loading === "object" && loading.delay) {
        loadingDelayTimerRef.current = setTimeout(() => {
          setInternalLoading(true);
        }, loading.delay);
        return () => {
          if (loadingDelayTimerRef.current) {
            clearTimeout(loadingDelayTimerRef.current);
          }
        };
      } else {
        setInternalLoading(!!loading);
      }
    }, [loading]);

    // Handle backward compatibility: if type is an HTML type, use it as htmlType
    const htmlTypes: ButtonHTMLType[] = ["button", "submit", "reset"];
    const isHTMLType = typeProp && htmlTypes.includes(typeProp as ButtonHTMLType);

    const buttonType: ButtonType = isHTMLType || !typeProp
      ? "default"
      : (typeProp as ButtonType);
    const htmlType: ButtonHTMLType = htmlTypeProp || (isHTMLType ? (typeProp as ButtonHTMLType) : "button");

    const isDisabled = disabled || internalLoading;

    // Safety checks for valid type and size
    const validType: ButtonType = buttonType && typeClasses[buttonType] ? buttonType : "default";
    const validSize: ButtonSize = size && sizeClasses[size] ? size : "middle";

    const sizeConfig = sizeClasses[validSize];
    const typeConfig = typeClasses[validType];

    const shapeClasses = {
      default: "rounded",
      circle: "rounded-full aspect-square",
      round: "rounded-full",
    };

    const dangerClasses = danger
      ? {
        default: "border-error text-error hover:bg-error-light hover:border-error",
        primary: "bg-error border-error text-white hover:bg-error/90",
        dashed: "border-error text-error border-dashed hover:bg-error-light",
        text: "text-error hover:bg-error-light",
        link: "text-error hover:text-error/80",
      }
      : {};

    const ghostClasses = ghost
      ? {
        default: "bg-transparent border-border-primary",
        primary: "bg-transparent border-accent-primary text-accent-primary hover:bg-accent-primary/10",
        dashed: "bg-transparent",
        text: "bg-transparent",
        link: "bg-transparent",
      }
      : {};

    const baseClasses = `
      cursor-pointer
      w-full
      inline-flex items-center justify-center
      font-semibold
      transition-all duration-200
      focus:outline-none focus:ring-1 focus:ring-1 ${danger ? "focus:ring-error" : "focus:ring-accent-primary"}
      disabled:opacity-50 disabled:cursor-not-allowed
      ${block ? "w-full" : ""}
      ${shapeClasses[shape]}
      ${sizeConfig.height}
      ${validType === "link" ? "" : sizeConfig.padding}
      ${sizeConfig.fontSize}
      ${!danger && !ghost ? typeConfig.base : ""}
      ${!danger && !ghost && !isDisabled ? typeConfig.hover : ""}
      ${!danger && !ghost && !isDisabled ? typeConfig.active : ""}
      ${isDisabled ? typeConfig.disabled : ""}
      ${danger && dangerClasses[validType] ? dangerClasses[validType] : ""}
      ${ghost && ghostClasses[validType] ? ghostClasses[validType] : ""}
      ${validType === "primary" && !danger && !ghost ? "shadow-lg" : ""}
      ${validType === "primary" && !danger && !ghost ? "shadow-accent-primary/20" : ""}
    `.trim().replace(/\s+/g, " ");

    const iconElement = icon && !internalLoading ? (
      <span className={`${children ? "mr-2" : ""} flex items-center`}>{icon}</span>
    ) : null;

    const loadingIcon = internalLoading ? (
      <Loader2 className={`${children ? "mr-2" : ""} ${sizeConfig.iconSize} animate-spin`} />
    ) : null;

    return (
      <button
        ref={ref}
        type={htmlType}
        disabled={isDisabled}
        className={`${baseClasses} ${className}`}
        {...props}
      >
        {loadingIcon || iconElement}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
