"use client";

import { motion } from "framer-motion";

const dimensions = [
  { id: "z1", name: "Genre Affinity", value: 0.82 },
  { id: "z2", name: "Rating Intensity", value: 0.61 },
  { id: "z3", name: "Viewing Breadth", value: 0.89 },
  { id: "z4", name: "Recency Bias", value: 0.31 },
  { id: "z5", name: "Franchise Pull", value: 0.44 },
  { id: "z6", name: "Indie Tendency", value: 0.71 },
  { id: "z7", name: "Auteur Preference", value: 0.80 },
  { id: "z8", name: "Rewatch Drive", value: 0.52 },
];

export function EmbeddingBars() {
  return (
    <div className="space-y-4">
      {dimensions.map((dim, index) => (
        <div key={dim.id} className="flex items-center gap-4 group">
          <div className="w-32 flex items-center justify-between">
            <span className="font-mono text-xs text-accent-teal/70 group-hover:text-accent-teal transition-colors">
              {dim.id}
            </span>
            <span className="text-xs text-text-muted group-hover:text-text transition-colors">
              {dim.name}
            </span>
          </div>
          
          <div className="flex-1 h-2 bg-bg-surface rounded-full overflow-hidden relative">
            <motion.div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-accent-blue to-accent-teal rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${dim.value * 100}%` }}
              transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
            />
          </div>
          
          <div className="w-12 text-right font-mono text-xs font-semibold text-text">
            {dim.value.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}
