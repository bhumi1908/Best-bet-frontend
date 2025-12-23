"use client";

import * as React from "react";
import { X, Eye, EyeOff } from "lucide-react";

export type InputSize = "small" | "middle" | "large";
export type InputStatus = "" | "error" | "warning";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "prefix" | "suffix"> {
  size?: InputSize;
  addonBefore?: React.ReactNode;
  addonAfter?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  allowClear?: boolean;
  showCount?: boolean;
  maxLength?: number;
  status?: InputStatus;
  bordered?: boolean;
  className?: string;
  onPressEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const sizeClasses: Record<InputSize, { height: string; padding: string; fontSize: string; iconSize: string }> = {
  small: {
    height: "h-7",
    padding: "px-2.5",
    fontSize: "text-xs",
    iconSize: "w-3.5 h-3.5",
  },
  middle: {
    height: "h-9",
    padding: "px-3",
    fontSize: "text-sm",
    iconSize: "w-4 h-4",
  },
  large: {
    height: "h-10",
    padding: "px-4",
    fontSize: "text-base",
    iconSize: "w-5 h-5",
  },
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = "middle",
      addonBefore,
      addonAfter,
      prefix,
      suffix,
      allowClear = false,
      showCount = false,
      maxLength,
      status = "",
      bordered = true,
      className = "",
      disabled,
      readOnly,
      type = "text",
      value,
      defaultValue,
      onChange,
      onPressEnter,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(value || defaultValue || "");
    const [showPassword, setShowPassword] = React.useState(false);
    const [focused, setFocused] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current!);

    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;
    const isPassword = type === "password";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isControlled) {
        setInternalValue("");
      }
      if (inputRef.current) {
        const nativeEvent = new Event("input", { bubbles: true });
        Object.defineProperty(nativeEvent, "target", {
          value: inputRef.current,
          enumerable: true,
        });
        Object.defineProperty(inputRef.current, "value", {
          value: "",
          writable: true,
          configurable: true,
        });
        if (onChange) {
          const syntheticEvent = {
            ...nativeEvent,
            target: inputRef.current,
            currentTarget: inputRef.current,
          } as unknown as React.ChangeEvent<HTMLInputElement>;
          onChange(syntheticEvent);
        }
        inputRef.current.focus();
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && onPressEnter) {
        onPressEnter(e);
      }
      props.onKeyDown?.(e);
    };

    const sizeConfig = sizeClasses[size];

    const statusClasses = {
      "": "",
      error: "border-error focus:border-error focus:ring-error/50",
      warning: "border-warning focus:border-warning focus:ring-warning/50",
    };

    const inputClasses = `
      w-full
      ${sizeConfig.height}
      ${sizeConfig.fontSize}
      ${bordered ? "border" : "border-0"}
      ${bordered ? "border-border-secondary" : ""}
      bg-bg-primary
      text-text-primary
      placeholder:text-text-muted
      focus:outline-none
      focus:ring-2
      focus:ring-border-accent
      transition-all
      disabled:opacity-50
      disabled:cursor-not-allowed
      read-only:bg-bg-secondary
      ${statusClasses[status]}
      ${focused && !status ? "border-border-accent" : ""}
    `.trim().replace(/\s+/g, " ");

    const wrapperClasses = `
      inline-flex items-center
      w-full
      ${bordered ? "border border-border-primary rounded-lg" : ""}
      ${bordered ? statusClasses[status] : ""}
      ${focused && !status ? "border-border-accent ring-1 ring-border-accent" : ""}
      ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      transition-all
    `.trim().replace(/\s+/g, " ");

    const addonClasses = `
      ${sizeConfig.height}
      ${sizeConfig.fontSize}
      px-3
      border border-border-primary
      bg-bg-secondary
      text-text-tertiary
      flex items-center
      ${bordered ? "" : "border-0"}
    `.trim().replace(/\s+/g, " ");

    const hasAddon = addonBefore || addonAfter;
    const hasAffix = prefix || suffix || allowClear || isPassword;
    const displayValue = currentValue?.toString() || "";
    const showClear = allowClear && displayValue && !disabled && !readOnly;

    const inputElement = (
      <div className={`relative ${hasAddon ? "flex-1" : ""} ${wrapperClasses}`}>
        {prefix && (
          <span className={`flex items-center ${sizeConfig.padding} text-text-tertiary`}>
            {prefix}
          </span>
        )}
        <input
          ref={inputRef}
          type={isPassword && showPassword ? "text" : type}
          value={currentValue}
          defaultValue={defaultValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          disabled={disabled}
          readOnly={readOnly}
          maxLength={maxLength}
          className={`
            ${inputClasses}
            ${prefix ? "pl-0" : sizeConfig.padding}
            ${suffix || showClear || isPassword ? "pr-0" : sizeConfig.padding}
            ${hasAddon ? "rounded-none" : "rounded-lg"}
            ${hasAffix ? "border-0" : ""}
            ${className}
          `.trim().replace(/\s+/g, " ")}
          {...props}
        />
        {(isPassword || showClear || suffix) && <div className="flex items-center gap-1 pr-2 absolute right-0 top-1/2 -translate-y-1/2">
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`${sizeConfig.iconSize} text-text-tertiary hover:text-text-primary transition-colors`}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className={sizeConfig.iconSize} /> : <Eye className={sizeConfig.iconSize} />}
            </button>
          )}
          {showClear && (
            <button
              type="button"
              onClick={handleClear}
              className={`${sizeConfig.iconSize} text-text-tertiary hover:text-text-primary transition-colors`}
              tabIndex={-1}
            >
              <X className={sizeConfig.iconSize} />
            </button>
          )}
          {suffix && !showClear && !isPassword && (
            <span className={`flex items-center ${sizeConfig.padding} text-text-tertiary`}>
              {suffix}
            </span>
          )}
        </div>}
      </div>
    );

    if (hasAddon) {
      return (
        <div className="inline-flex items-stretch w-full">
          {addonBefore && (
            <div className={`${addonClasses} rounded-l-lg border-r-0`}>{addonBefore}</div>
          )}
          {inputElement}
          {addonAfter && (
            <div className={`${addonClasses} rounded-r-lg border-l-0`}>{addonAfter}</div>
          )}
        </div>
      );
    }

    if (showCount && maxLength) {
      return (
        <div className="w-full">
          {inputElement}
          <div className="text-right mt-1 text-xs text-text-tertiary">
            {displayValue.length} / {maxLength}
          </div>
        </div>
      );
    }

    return inputElement;
  }
);

Input.displayName = "Input";
