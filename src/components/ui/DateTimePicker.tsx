"use client";

import * as React from "react";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";

interface DateTimePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  showDate?: boolean;
  showTime?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Select date and time",
  className,
  disabled = false,
  showDate = true,
  showTime = true,
  minDate,
  maxDate,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(value);
  const [currentMonth, setCurrentMonth] = React.useState(value || new Date());
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const popoverRef = React.useRef<HTMLDivElement>(null);
  const hoursScrollRef = React.useRef<HTMLDivElement>(null);
  const minutesScrollRef = React.useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = React.useState(false);
  const [position, setPosition] = React.useState({ top: 0, left: 0, width: 0 });

  // Time state (24-hour format)
  const [hours, setHours] = React.useState(value ? value.getHours() : 0);
  const [minutes, setMinutes] = React.useState(value ? value.getMinutes() : 0);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (value) {
      setSelectedDate(value);
      if (showTime) {
        setHours(value.getHours());
        setMinutes(value.getMinutes());
      }
    }
  }, [value, showTime]);

  // Calculate position
  const calculatePosition = React.useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    const viewportHeight = window.innerHeight;

    const popoverHeight = 400;
    const gap = 8;

    const spaceBelow = viewportHeight - rect.bottom;
    const shouldPlaceAbove = spaceBelow < popoverHeight && rect.top > spaceBelow;

    const top = shouldPlaceAbove
      ? rect.top + scrollY - popoverHeight - gap
      : rect.bottom + scrollY + gap;

    setPosition({
      top,
      left: rect.left + scrollX,
      width: showDate && showTime ? 460 : showDate ? 320 : 160,
    });
  }, [showDate, showTime]);

  React.useEffect(() => {
    if (open) {
      calculatePosition();

      const handleResize = () => calculatePosition();
      const handleScroll = () => calculatePosition();

      window.addEventListener("resize", handleResize);
      window.addEventListener("scroll", handleScroll, true);

      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", handleScroll, true);
      };
    }
  }, [open, calculatePosition]);

  // Click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const formatDisplayValue = () => {
    if (!selectedDate) return placeholder;

    const parts: string[] = [];

    if (showDate) {
      parts.push(selectedDate.toLocaleDateString());
    }

    if (showTime) {
      const h = selectedDate.getHours();
      const m = selectedDate.getMinutes();
      const timeStr = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
      parts.push(timeStr);
    }

    return parts.join(" ");
  };

  const handleDateSelect = (date: Date) => {
    let newDate = new Date(date);
    
    if (showTime && selectedDate) {
      newDate.setHours(selectedDate.getHours());
      newDate.setMinutes(selectedDate.getMinutes());
    } else if (showTime) {
      newDate.setHours(hours);
      newDate.setMinutes(minutes);
    }

    setSelectedDate(newDate);
    onChange?.(newDate);

    if (!showTime) {
      setOpen(false);
    }
  };

  const handleTimeChange = () => {
    const date = selectedDate || new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    setSelectedDate(date);
    onChange?.(date);
  };

  React.useEffect(() => {
    if (selectedDate && showTime) {
      handleTimeChange();
    }
  }, [hours, minutes]);

  // Auto-scroll to selected time when picker opens
  React.useEffect(() => {
    if (open && showTime) {
      setTimeout(() => {
        if (hoursScrollRef.current) {
          const hourButton = hoursScrollRef.current.querySelector(`[data-value="${hours}"]`);
          if (hourButton) {
            hourButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
        if (minutesScrollRef.current) {
          const minuteButton = minutesScrollRef.current.querySelector(`[data-value="${minutes}"]`);
          if (minuteButton) {
            minuteButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }, 100);
    }
  }, [open, showTime]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-9 w-9" />);
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSelected =
        selectedDate &&
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === month &&
        selectedDate.getFullYear() === year;
      const isToday =
        new Date().getDate() === day &&
        new Date().getMonth() === month &&
        new Date().getFullYear() === year;
      
      const isDisabled = 
        (minDate && date < minDate) || 
        (maxDate && date > maxDate);

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => !isDisabled && handleDateSelect(date)}
          disabled={isDisabled}
          className={cn(
            "h-9 w-9 rounded-md text-sm transition-colors cursor-pointer",
            "hover:bg-bg-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary/20",
            isSelected && "bg-accent-primary text-white hover:bg-accent-primary/90",
            isToday && !isSelected && "border border-accent-primary",
            isDisabled && "opacity-30 cursor-not-allowed hover:bg-transparent"
          )}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const renderTimePicker = () => {
    const hoursArray = Array.from({ length: 24 }, (_, i) => i);
    const minutesArray = Array.from({ length: 60 }, (_, i) => i);

    const scrollbarStyles = {
      scrollbarWidth: 'thin' as const,
      scrollbarColor: '#374151 transparent',
    };

    return (
      <div className="p-4 border-l border-border-primary w-[160px]">
        <div className="flex gap-2 h-[300px]">
          {/* Hours Column */}
          <div className="flex-1 flex flex-col">
            <div className="text-xs text-text-muted mb-2 text-center">Hour</div>
            <div 
              ref={hoursScrollRef}
              className="flex-1 overflow-y-auto pr-1 time-picker-scroll"
              style={scrollbarStyles}
            >
              <div className="flex flex-col">
                {hoursArray.map((hour) => (
                  <button
                    key={hour}
                    type="button"
                    data-value={hour}
                    onClick={() => setHours(hour)}
                    className={cn(
                      "py-2 px-3 text-center text-sm transition-colors rounded mb-1 cursor-pointer",
                      hours === hour
                        ? "border border-accent-primary text-white font-medium text-accent-primary"
                        : "text-text-primary hover:bg-bg-tertiary"
                    )}
                  >
                    {hour.toString().padStart(2, "0")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Minutes Column */}
          <div className="flex-1 flex flex-col">
            <div className="text-xs text-text-muted mb-2 text-center">Minute</div>
            <div 
              ref={minutesScrollRef}
              className="flex-1 overflow-y-auto pr-1 time-picker-scroll"
              style={scrollbarStyles}
            >
              <div className="flex flex-col">
                {minutesArray.map((minute) => (
                  <button
                    key={minute}
                    type="button"
                    data-value={minute}
                    onClick={() => setMinutes(minute)}
                    className={cn(
                      "py-2 px-3 text-center text-sm transition-colors rounded mb-1 cursor-pointer",
                      minutes === minute
                        ? "border border-accent-primary text-white font-medium text-accent-primary"
                        : "text-text-primary hover:bg-bg-tertiary"
                    )}
                  >
                    {minute.toString().padStart(2, "0")}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const popoverContent = (
    <div
      ref={popoverRef}
      className="fixed z-50 rounded-lg border border-border-primary bg-bg-card shadow-lg animate-in fade-in-0 zoom-in-95"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
      }}
    >
      <div className="flex">
        {showDate && (
          <div className="p-3">
            {/* Month/Year header */}
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={() => {
                  const newMonth = new Date(currentMonth);
                  newMonth.setMonth(newMonth.getMonth() - 1);
                  setCurrentMonth(newMonth);
                }}
                className="h-8 w-8 rounded hover:bg-bg-tertiary flex items-center justify-center text-lg"
              >
                ‹
              </button>
              <div className="text-sm font-medium text-text-primary">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
              <button
                type="button"
                onClick={() => {
                  const newMonth = new Date(currentMonth);
                  newMonth.setMonth(newMonth.getMonth() + 1);
                  setCurrentMonth(newMonth);
                }}
                className="h-8 w-8 rounded hover:bg-bg-tertiary flex items-center justify-center text-lg"
              >
                ›
              </button>
            </div>

            {/* Day names */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div key={day} className="h-9 w-9 flex items-center justify-center text-xs text-text-muted">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
          </div>
        )}

        {showTime && renderTimePicker()}
      </div>

      {/* Footer with action buttons */}
      {(showDate || showTime) && (
        <div className="flex items-center justify-between p-3 border-t border-border-primary">
          <button
            type="button"
            onClick={() => {
              setSelectedDate(undefined);
              onChange?.(undefined);
              setOpen(false);
            }}
            className="text-xs text-text-muted hover:text-text-primary transition-colors"
          >
            Clear
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                setSelectedDate(now);
                setCurrentMonth(now);
                if (showTime) {
                  setHours(now.getHours());
                  setMinutes(now.getMinutes());
                }
                onChange?.(now);
              }}
              className="px-3 py-1.5 text-xs rounded border border-border-primary hover:bg-bg-tertiary transition-colors"
            >
              Now
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-1.5 text-sm rounded bg-accent-primary text-white hover:bg-accent-primary/90 transition-colors font-medium"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <style>{`
        .time-picker-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .time-picker-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .time-picker-scroll::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 3px;
        }
        .time-picker-scroll::-webkit-scrollbar-thumb:hover {
          background: #4B5563;
        }
      `}</style>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-lg border border-border-primary bg-bg-primary px-3 py-2 text-sm text-text-primary",
          "hover:bg-bg-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-border-accent",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "h-9",
          open && "ring-2 ring-accent-primary/20 border-border-accent",
          className
        )}
      >
        <span className={cn("flex-1 text-left", !selectedDate && "text-text-muted")}>
          {formatDisplayValue()}
        </span>
        <div className="flex items-center gap-1 text-text-tertiary">
          {showDate && <CalendarIcon className="w-4 h-4" />}
          {showTime && <Clock className="w-4 h-4" />}
        </div>
      </button>

      {open && mounted && typeof document !== "undefined" && createPortal(popoverContent, document.body)}
    </>
  );
}

