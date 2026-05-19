"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MovieCard } from "./MovieCard";
import type { Recommendation } from "@/types/recommendation";

interface RecommendationRowProps {
  title: string;
  subtitle?: string;
  movies: Recommendation[];
  accentColor?: "blue" | "amber" | "violet" | "teal";
}

export function RecommendationRow({ title, subtitle, movies, accentColor = "blue" }: RecommendationRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth + 200 : scrollLeft + clientWidth - 200;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="mb-12">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="font-display text-xl font-bold tracking-tight text-white mb-1">{title}</h2>
          {subtitle && <p className="text-sm text-text-muted">{subtitle}</p>}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => scroll("left")}
            className="w-8 h-8 rounded-full border border-border bg-bg-surface flex items-center justify-center text-text-muted hover:text-white hover:border-border-bright transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => scroll("right")}
            className="w-8 h-8 rounded-full border border-border bg-bg-surface flex items-center justify-center text-text-muted hover:text-white hover:border-border-bright transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-6 -mx-8 px-8 snap-x hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {movies.map((movie) => (
          <div key={movie.movie_id} className="snap-start shrink-0">
            <MovieCard movie={movie} accentColor={accentColor} />
          </div>
        ))}
      </div>
    </div>
  );
}
