"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, Brain, Save, Sparkles, RefreshCcw, GraduationCap, Infinity } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, name: "OBSERVE", desc: "Process real Task-2 users", icon: Eye },
  { id: 2, name: "LEARN", desc: "Train classifier on new data", icon: Brain },
  { id: 3, name: "REMEMBER", desc: "Access VAE distribution", icon: Save },
  { id: 4, name: "DREAM", desc: "Sample synthetic Task-1 users", icon: Sparkles },
  { id: 5, name: "REPLAY", desc: "Mix real & dreamed data", icon: RefreshCcw },
  { id: 6, name: "LEARN AGAIN", desc: "Retrain on combined set", icon: GraduationCap },
  { id: 7, name: "GROW FOREVER", desc: "Prevent catastrophic forgetting", icon: Infinity },
];

type DreamCycleVizProps = {
  compact?: boolean;
};

export function DreamCycleViz({ compact = false }: DreamCycleVizProps) {
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev % 7) + 1);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  if (compact) {
    return (
      <div className="w-full space-y-2">
        <div className="grid grid-cols-7 gap-1.5">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = activeStep === step.id;
            const isPast = activeStep > step.id;

            return (
              <button
                key={step.id}
                type="button"
                aria-label={step.name}
                onClick={() => setActiveStep(step.id)}
                className={cn(
                  "h-8 w-8 shrink-0 rounded-full border flex items-center justify-center transition-all",
                  isActive
                    ? "bg-accent-violet text-white border-accent-violet shadow-[0_0_14px_rgba(167,139,250,0.45)]"
                    : isPast
                      ? "bg-accent-violet/10 text-accent-violet border-accent-violet/40"
                      : "bg-bg-base text-text-muted border-border"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            );
          })}
        </div>
        <div className="min-h-12 rounded-lg border border-border bg-bg-base/60 p-2.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-accent-violet">
            {steps[activeStep - 1].name}
          </div>
          <div className="mt-1 text-[11px] leading-snug text-text-muted">
            {steps[activeStep - 1].desc}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-4 py-4 w-full max-w-sm mx-auto">
      {/* Background connecting line */}
      <div className="absolute left-[23px] top-8 bottom-8 w-0.5 bg-border z-0" />
      
      {/* Animated progress line */}
      <motion.div 
        className="absolute left-[23px] top-8 w-0.5 bg-accent-violet z-0"
        initial={{ height: "0%" }}
        animate={{ height: `${((activeStep - 1) / 6) * 100}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />

      {steps.map((step) => {
        const isActive = activeStep === step.id;
        const isPast = activeStep > step.id;
        const Icon = step.icon;
        
        return (
          <div key={step.id} className="relative z-10 flex items-center gap-4 group cursor-pointer" onClick={() => setActiveStep(step.id)}>
            <div 
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                isActive ? "bg-accent-violet border-accent-violet/50 shadow-[0_0_15px_rgba(167,139,250,0.5)] text-white" : 
                isPast ? "bg-bg-surface border-accent-violet text-accent-violet" : "bg-bg-base border-border text-text-muted"
              )}
            >
              <Icon className="w-5 h-5" />
            </div>
            
            <motion.div 
              className={cn(
                "flex-1 p-3 rounded-xl border transition-all duration-300",
                isActive ? "bg-accent-violet/10 border-accent-violet/30" : "bg-bg-card border-border hover:border-border-bright"
              )}
              animate={{ x: isActive ? 5 : 0 }}
            >
              <div className={cn("text-sm font-bold tracking-wider", isActive ? "text-accent-violet" : "text-text")}>
                {step.name}
              </div>
              <div className="text-xs text-text-muted mt-1">
                {step.desc}
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
