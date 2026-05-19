import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

export interface CardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  glowColor?: "blue" | "teal" | "amber" | "violet" | "coral" | "none";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, glowColor = "none", children, ...props }, ref) => {
    const glowStyles: Record<string, string> = {
      blue: "hover:border-accent-blue hover:shadow-[0_0_20px_rgba(91,141,255,0.2)]",
      teal: "hover:border-accent-teal hover:shadow-[0_0_20px_rgba(0,212,170,0.2)]",
      amber: "hover:border-accent-amber hover:shadow-[0_0_20px_rgba(245,166,35,0.2)]",
      violet: "hover:border-accent-violet hover:shadow-[0_0_20px_rgba(167,139,250,0.2)]",
      coral: "hover:border-accent-coral hover:shadow-[0_0_20px_rgba(255,107,107,0.2)]",
      none: "",
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "glass-card overflow-hidden transition-all duration-300",
          glowStyles[glowColor],
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
Card.displayName = "Card";

export { Card };
