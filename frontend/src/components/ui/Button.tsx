import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  glow?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", glow = false, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none";
    
    const variants: Record<string, string> = {
      primary: "bg-accent-blue text-white hover:bg-opacity-90",
      secondary: "bg-bg-surface text-text hover:bg-bg-card border border-border",
      outline: "border border-accent-blue text-accent-blue hover:bg-accent-blue hover:bg-opacity-10",
      ghost: "text-text-muted hover:text-text hover:bg-bg-card",
    };
    
    const sizes: Record<string, string> = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4",
      lg: "h-12 px-6 text-lg",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          glow && variant === "primary" ? "shadow-[0_0_15px_rgba(91,141,255,0.5)]" : "",
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

export { Button };
