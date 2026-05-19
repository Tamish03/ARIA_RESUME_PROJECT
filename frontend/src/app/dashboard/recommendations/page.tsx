"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { RecommendationRow } from "@/components/recommendations/RecommendationRow";
import { useRecommendations } from "@/hooks/useRecommendations";
import { Brain } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useActiveUser } from "@/context/ActiveUserContext";

export default function RecommendationsPage() {
  const { activeUserId } = useActiveUser();
  const [filter, setFilter] = useState("All");
  const { recommendations, isLoading } = useRecommendations(activeUserId, filter);

  
  // Mocking multiple lists based on different techniques
  const vaePicks = recommendations.slice(0, 8);
  const swarmPicks = recommendations.slice(4, 12).map(r => ({...r, match_score: r.match_score - 0.02}));
  const dreamPicks = recommendations.slice(2, 10).map(r => ({...r, match_score: r.match_score - 0.05}));

  const genres = ["All", "Sci-Fi", "Drama", "Action", "Thriller", "Comedy"];

  return (
    <div className="space-y-8 pb-12">
      <PageHeader 
        title={`Recommended for ${activeUserId === 943 ? "Rahul" : "User " + activeUserId}`} 
        description="Personalized movie curation powered by ARIA's multi-stage ML architecture."
      >
        <div className="flex items-center gap-2 bg-bg-surface border border-border px-3 py-1.5 rounded-full">
          <Brain className="w-4 h-4 text-accent-teal" />
          <span className="text-xs font-semibold">VAE + PSO Classifier</span>
        </div>
      </PageHeader>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-b border-border/50 mb-8 sticky top-16 bg-bg-base/90 backdrop-blur-md z-20">
        <div className="flex gap-2">
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setFilter(g)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
                filter === g 
                  ? "bg-text text-bg-base border-text" 
                  : "bg-transparent text-text-muted border-border hover:border-text-muted"
              )}
            >
              {g}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <span>Sort by:</span>
            <select className="bg-bg-surface border border-border rounded px-2 py-1 outline-none focus:border-accent-blue">
              <option>Match %</option>
              <option>Recency</option>
              <option>Diversity</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Explore Mode</span>
            <div className="w-10 h-5 bg-bg-surface border border-border rounded-full relative cursor-pointer">
              <div className="w-4 h-4 rounded-full bg-text-muted absolute left-0.5 top-0.5" />
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20 text-text-muted">Synthesizing recommendations...</div>
      ) : (
        <div className="space-y-4">
          <RecommendationRow 
            title="Your Taste Vector Says..." 
            subtitle="Based on VAE latent space encoding"
            movies={vaePicks}
            accentColor="teal"
          />
          
          <RecommendationRow 
            title="Swarm-Discovered Picks" 
            subtitle="Ranked by PSO-optimized classifier"
            movies={swarmPicks}
            accentColor="amber"
          />
          
          <RecommendationRow 
            title="Dream Memory Recalls" 
            subtitle="Cross-task similarities via DreamVAE"
            movies={dreamPicks}
            accentColor="violet"
          />
        </div>
      )}
    </div>
  );
}
