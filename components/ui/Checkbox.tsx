"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || `checkbox-${Math.random().toString(36).substring(7)}`;

    return (
      <div className="w-full">
        <label
          htmlFor={inputId}
          className="flex items-start gap-3 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center mt-0.5">
            <input
              ref={ref}
              type="checkbox"
              id={inputId}
              className={cn(
                "peer h-5 w-5 shrink-0 rounded border border-gray-300 bg-white appearance-none cursor-pointer",
                "transition-all duration-200",
                "checked:bg-primary checked:border-primary",
                "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1",
                "disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50",
                error && "border-danger",
                className
              )}
              {...props}
            />
            <svg
              className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          {label && (
            <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors select-none">
              {label}
            </span>
          )}
        </label>
        {error && <p className="mt-1.5 text-sm text-danger">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
