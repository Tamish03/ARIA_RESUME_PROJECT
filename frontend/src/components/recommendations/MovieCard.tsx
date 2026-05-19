"use client";

import { useState } from "react";
import type { MouseEvent } from "react";
import { motion } from "framer-motion";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { WhyRecommended } from "./WhyRecommended";
import { formatPercent } from "@/lib/utils";

interface MovieCardProps {
  movie: {
    movie_id: number;
    title: string;
    year: number;
    genres: string[];
    match_score: number;
    similarity_dims?: number[];
  };
  accentColor?: "blue" | "amber" | "violet" | "teal";
}

// Generate a deterministic gradient string based on movie ID and title
function getMovieGradient(id: number, title: string) {
  const hues = [220, 260, 320, 180, 150, 40, 350];
  const hue1 = hues[id % hues.length];
  const hue2 = hues[(id + title.length) % hues.length];
  return `linear-gradient(135deg, hsl(${hue1}, 70%, 20%), hsl(${hue2}, 60%, 15%))`;
}

export function MovieCard({ movie, accentColor = "blue" }: MovieCardProps) {
  const [isWhyOpen, setIsWhyOpen] = useState(false);
  const gradient = getMovieGradient(movie.movie_id, movie.title);

  const borderColors = {
    blue: "hover:border-accent-blue/50",
    amber: "hover:border-accent-amber/50",
    violet: "hover:border-accent-violet/50",
    teal: "hover:border-accent-teal/50",
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.04, y: -5 }}
        className={`relative w-[200px] h-[280px] rounded-xl overflow-hidden flex flex-col bg-bg-surface border border-border cursor-pointer group transition-colors duration-300 ${borderColors[accentColor]}`}
      >
        <div 
          className="h-[65%] w-full relative"
          style={{ background: gradient }}
        >
          {/* Subtle noise overlay */}
          <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
          
          {/* Why overlay button on hover */}
          <div className="absolute inset-0 bg-bg-base/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
            <Button 
              size="sm" 
              variant="secondary" 
              className="scale-90 group-hover:scale-100 transition-transform shadow-xl"
              onClick={(e: MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); setIsWhyOpen(true); }}
            >
              Why recommended?
            </Button>
          </div>
        </div>

        <div className="p-3 flex-1 flex flex-col justify-between z-10 bg-bg-surface">
          <div>
            <h4 className="font-display font-medium text-[13px] leading-tight line-clamp-1" title={movie.title}>
              {movie.title}
            </h4>
            <div className="text-[11px] text-text-muted mt-0.5">{movie.year}</div>
          </div>
          
          <div className="flex gap-1 overflow-hidden mt-2">
            {movie.genres.slice(0, 2).map((g) => (
              <Badge key={g} variant="gray" className="text-[9px] px-1.5 py-0">
                {g}
              </Badge>
            ))}
          </div>

          <div className="mt-2">
            <div className="flex justify-between items-center text-[10px] mb-1 font-mono">
              <span className="text-text-muted">Match</span>
              <span className={`text-accent-${accentColor} font-bold`}>{formatPercent(movie.match_score)}</span>
            </div>
            <div className="h-1 bg-bg-base rounded-full overflow-hidden">
              <div 
                className={`h-full bg-accent-${accentColor} rounded-full`}
                style={{ width: `${movie.match_score * 100}%` }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      <WhyRecommended 
        isOpen={isWhyOpen} 
        onClose={() => setIsWhyOpen(false)}
        similarity={movie.match_score}
        topDims={[
          { dim: "z3", name: "Sci-Fi Affinity", contribution: 0.85 },
          { dim: "z7", name: "Auteur Preference", contribution: 0.72 },
          { dim: "z12", name: "Pacing", contribution: 0.61 }
        ]}
        neighbors={[142, 378, 891]}
      />
    </>
  );
}
