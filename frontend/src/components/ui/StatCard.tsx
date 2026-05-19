import { ReactNode } from "react";
import { Card } from "./Card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  accent?: "blue" | "teal" | "amber" | "violet" | "coral";
  sparklineData?: number[];
  className?: string;
}

export function StatCard({ label, value, icon, accent = "blue", sparklineData, className }: StatCardProps) {
  const accentColors = {
    blue: "text-accent-blue",
    teal: "text-accent-teal",
    amber: "text-accent-amber",
    violet: "text-accent-violet",
    coral: "text-accent-coral",
  };

  const strokeColors = {
    blue: "#5b8dff",
    teal: "#00d4aa",
    amber: "#f5a623",
    violet: "#a78bfa",
    coral: "#ff6b6b",
  };

  // Simple SVG sparkline generation
  const renderSparkline = () => {
    if (!sparklineData || sparklineData.length === 0) return null;
    
    const max = Math.max(...sparklineData);
    const min = Math.min(...sparklineData);
    const range = max - min || 1;
    
    const width = 60;
    const height = 24;
    
    const points = sparklineData.map((val, i) => {
      const x = (i / (sparklineData.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    }).join(" ");

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={strokeColors[accent]}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <Card className={cn("p-6 flex flex-col justify-between", className)} glowColor={accent}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-text-muted">{label}</h3>
        {icon && <div className={cn(accentColors[accent], "opacity-80")}>{icon}</div>}
      </div>
      
      <div className="flex items-end justify-between">
        <div className="font-display text-3xl font-bold tracking-tight">
          {value}
        </div>
        {renderSparkline()}
      </div>
    </Card>
  );
}
