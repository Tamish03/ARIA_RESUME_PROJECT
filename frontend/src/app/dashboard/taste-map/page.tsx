"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { LatentSpaceMap } from "@/components/visualizations/LatentSpaceMap";
import { TasteRadar } from "@/components/visualizations/TasteRadar";
import { EmbeddingBars } from "@/components/visualizations/EmbeddingBars";
import { Card } from "@/components/ui/Card";

export default function TasteMapPage() {
  return (
    <div className="space-y-8 pb-12 h-[calc(100vh-64px)] flex flex-col">
      <PageHeader 
        title="Latent Taste Space" 
        description="2D UMAP projection of the 20-dimensional VAE latent space. Each point is a user's taste profile."
      />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        <Card className="lg:col-span-7 relative overflow-hidden flex flex-col">
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            {["Sci-Fi", "Drama", "Action", "Comedy", "Romance"].map((g, i) => (
              <div key={g} className="flex items-center gap-1.5 text-xs bg-bg-base/80 backdrop-blur px-2 py-1 rounded border border-border">
                <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: ["#5b8dff", "#a78bfa", "#ff6b6b", "#f5a623", "#00d4aa"][i] }} />
                {g}
              </div>
            ))}
          </div>
          <div className="flex-1 relative min-h-[400px]">
            <LatentSpaceMap />
          </div>
        </Card>

        <div className="lg:col-span-5 flex flex-col gap-6 overflow-y-auto pr-2 hide-scrollbar">
          <Card className="p-6 shrink-0">
            <h3 className="font-display font-bold mb-6 text-accent-teal">Latent Dimensions</h3>
            <EmbeddingBars />
          </Card>

          <Card className="p-6 shrink-0">
            <h3 className="font-display font-bold mb-4 text-accent-teal">Taste Radar</h3>
            <TasteRadar />
          </Card>
          
          <Card className="p-6 shrink-0">
            <h3 className="font-display font-bold mb-4">Nearest Taste Neighbors</h3>
            <div className="space-y-3">
              {[
                { id: 142, sim: 94, genre: "Sci-Fi / Auteur" },
                { id: 378, sim: 91, genre: "Drama / Indie" },
                { id: 891, sim: 88, genre: "Thriller / Slow-cinema" },
              ].map((n) => (
                <div key={n.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-bg-card transition-colors cursor-pointer border border-transparent hover:border-border">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent-teal to-accent-blue flex items-center justify-center font-bold text-sm">
                    U{n.id}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">User {n.id} <span className="text-accent-teal ml-2">{n.sim}% match</span></div>
                    <div className="text-xs text-text-muted">{n.genre}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
