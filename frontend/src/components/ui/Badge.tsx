import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "blue" | "teal" | "amber" | "violet" | "coral" | "gray";
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "gray", children, ...props }, ref) => {
    const variants = {
      blue: "bg-accent-blue/20 text-accent-blue border-accent-blue/30",
      teal: "bg-accent-teal/20 text-accent-teal border-accent-teal/30",
      amber: "bg-accent-amber/20 text-accent-amber border-accent-amber/30",
      violet: "bg-accent-violet/20 text-accent-violet border-accent-violet/30",
      coral: "bg-accent-coral/20 text-accent-coral border-accent-coral/30",
      gray: "bg-bg-surface text-text-muted border-border",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);
Badge.displayName = "Badge";

export { Badge };
