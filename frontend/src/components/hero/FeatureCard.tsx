"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: "teal" | "amber" | "violet";
  delay?: number;
}

export function FeatureCard({ title, description, icon: Icon, accent, delay = 0 }: FeatureCardProps) {
  const accentStyles = {
    teal: "text-accent-teal border-accent-teal/30 hover:border-accent-teal/60 hover:shadow-[0_0_30px_rgba(0,212,170,0.15)]",
    amber: "text-accent-amber border-accent-amber/30 hover:border-accent-amber/60 hover:shadow-[0_0_30px_rgba(245,166,35,0.15)]",
    violet: "text-accent-violet border-accent-violet/30 hover:border-accent-violet/60 hover:shadow-[0_0_30px_rgba(167,139,250,0.15)]",
  };

  const iconBgStyles = {
    teal: "bg-accent-teal/10",
    amber: "bg-accent-amber/10",
    violet: "bg-accent-violet/10",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={`glass-card p-6 md:p-8 transition-all duration-500 cursor-pointer ${accentStyles[accent]}`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${iconBgStyles[accent]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-display text-xl font-bold text-white mb-3 tracking-tight">
        {title}
      </h3>
      <p className="text-text-muted leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
