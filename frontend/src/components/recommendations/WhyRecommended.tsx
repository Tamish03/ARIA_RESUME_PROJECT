"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Users } from "lucide-react";
import { formatPercent } from "@/lib/utils";

interface WhyRecommendedProps {
  isOpen: boolean;
  onClose: () => void;
  similarity: number;
  topDims: { dim: string; name: string; contribution: number }[];
  neighbors: number[];
}

export function WhyRecommended({ isOpen, onClose, similarity, topDims, neighbors }: WhyRecommendedProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-bg-base/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 md:left-auto md:right-8 md:bottom-8 md:w-96 bg-bg-surface border border-border md:rounded-2xl rounded-t-2xl z-50 shadow-2xl overflow-hidden"
          >
            <div className="p-5 border-b border-border flex justify-between items-center bg-bg-card">
              <h3 className="font-display font-bold">Why Recommended?</h3>
              <button onClick={onClose} className="p-1 hover:bg-bg-base rounded-md transition-colors text-text-muted hover:text-text">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <div className="text-sm text-text-muted mb-1">Z-Space Cosine Similarity</div>
                <div className="font-display text-4xl font-bold text-accent-blue">
                  {formatPercent(similarity)}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold mb-3">Top Contributing Dimensions</div>
                <div className="space-y-3">
                  {topDims.map((dim) => (
                    <div key={dim.dim}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-mono text-text-muted">{dim.dim} <span className="text-text font-sans ml-1">{dim.name}</span></span>
                        <span className="font-mono text-accent-teal">+{dim.contribution.toFixed(2)}</span>
                      </div>
                      <div className="h-1.5 bg-bg-base rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent-teal rounded-full" 
                          style={{ width: `${dim.contribution * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-sm font-semibold mb-3">
                  <Users className="w-4 h-4 text-accent-violet" />
                  Nearest Taste Neighbors
                </div>
                <div className="flex gap-2">
                  {neighbors.map((id) => (
                    <div key={id} className="bg-bg-base border border-border px-3 py-1.5 rounded-lg text-xs font-mono">
                      User {id}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
