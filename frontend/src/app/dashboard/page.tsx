"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { TasteRadar } from "@/components/visualizations/TasteRadar";
import { AUCChart } from "@/components/visualizations/AUCChart";
import { DreamCycleViz } from "@/components/visualizations/DreamCycleViz";
import { SwarmField3D } from "@/components/visualizations/SwarmField3D";
import { DreamOrb } from "@/components/visualizations/DreamOrb";
import { MovieCard } from "@/components/recommendations/MovieCard";
import { useUser } from "@/hooks/useUser";
import { useRecommendations } from "@/hooks/useRecommendations";
import { Layers, Activity, BrainCircuit, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useActiveUser } from "@/context/ActiveUserContext";

export default function DashboardHome() {
  const { activeUserId } = useActiveUser();
  const { user } = useUser(activeUserId);
  const { recommendations, isLoading: recsLoading } = useRecommendations(activeUserId);


  return (
    <div className="space-y-8 pb-12">
      <PageHeader 
        title="System Overview" 
        description="Real-time telemetry for the ARIA recommendation engine."
      />

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Taste Dimensions" 
          value="20" 
          icon={<Layers />} 
          accent="teal"
          sparklineData={[4, 6, 8, 5, 9, 3, 7, 10, 4, 8, 6]}
        />
        <StatCard 
          label="Swarm AUC" 
          value="0.9345" 
          icon={<Activity />} 
          accent="amber"
          sparklineData={[0.75, 0.78, 0.81, 0.85, 0.87, 0.89, 0.91, 0.92, 0.93, 0.9345]}
        />
        <StatCard 
          label="Dream Users" 
          value="247" 
          icon={<BrainCircuit />} 
          accent="violet"
          sparklineData={[0, 20, 50, 100, 150, 180, 210, 230, 240, 247]}
        />
        <StatCard 
          label="Engagement Score" 
          value={user ? `${user.engagement_score}%` : "93%"} 
          icon={<Zap />} 
          accent="blue"
          sparklineData={[80, 82, 85, 84, 88, 90, 89, 92, 91, 93]}
        />
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-8 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display font-bold text-lg">Live Recommendation Feed</h3>
            <Link href="/dashboard/recommendations">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            {recsLoading ? (
              <div className="text-center text-text-muted">Loading recommendations...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center">
                {recommendations.slice(0, 3).map((rec) => (
                  <MovieCard key={rec.movie_id} movie={rec} accentColor="blue" />
                ))}
              </div>
            )}
          </div>
        </Card>

        <Card className="lg:col-span-4 p-6 flex flex-col" glowColor="teal">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-display font-bold text-lg text-accent-teal">Taste Summary</h3>
          </div>
          <div className="flex-1 flex items-center justify-center -mx-4">
            <TasteRadar />
          </div>
          <Link href="/dashboard/taste-map" className="mt-4 text-center">
            <Button variant="outline" size="sm" className="w-full text-accent-teal border-accent-teal hover:bg-accent-teal">
              Explore full map →
            </Button>
          </Link>
        </Card>
      </div>

      {/* Bottom Row — 3D Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Swarm Intelligence Panel */}
        <Card className="p-0 overflow-hidden min-w-0" glowColor="amber">
          <div className="flex justify-between items-center p-6 pb-0">
            <h3 className="font-display font-bold text-lg text-accent-amber">Swarm Convergence</h3>
            <Link href="/dashboard/swarm">
              <span className="text-xs text-accent-amber cursor-pointer hover:underline">View details →</span>
            </Link>
          </div>
          {/* 3D PSO swarm field */}
          <div className="h-72 relative">
            <SwarmField3D />
            {/* Floating AUC overlay */}
            <div className="absolute bottom-3 right-3 bg-bg-base/80 backdrop-blur-sm border border-border rounded-lg p-3 w-56 max-w-[calc(100%-1.5rem)]">
              <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1">AUC Convergence</div>
              <div className="h-20">
                <AUCChart />
              </div>
            </div>
            {/* Best config badge */}
            <div className="absolute top-3 right-3 bg-accent-amber/10 backdrop-blur-sm border border-accent-amber/20 rounded-lg px-3 py-1.5">
              <div className="text-[10px] text-accent-amber/70 uppercase tracking-wider">Playback</div>
              <div className="font-mono text-sm font-bold text-accent-amber">Converging</div>
            </div>
          </div>
        </Card>

        {/* Dream Memory Panel */}
        <Card className="p-0 overflow-hidden min-w-0" glowColor="violet">
          <div className="flex justify-between items-center p-6 pb-0">
            <h3 className="font-display font-bold text-lg text-accent-violet">Dream Memory</h3>
            <Link href="/dashboard/dream-memory">
              <span className="text-xs text-accent-violet cursor-pointer hover:underline">Manage →</span>
            </Link>
          </div>
          <div className="grid h-[380px] grid-cols-1 xl:grid-cols-[minmax(0,1fr)_13rem]">
            {/* 3D Dream Orb */}
            <div className="relative min-w-0">
              <DreamOrb />
              {/* Latent Space label */}
              <div className="absolute bottom-3 left-3 bg-bg-base/60 backdrop-blur-sm border border-border rounded-lg px-3 py-1.5">
                <div className="text-[10px] text-accent-violet/70 uppercase tracking-wider">DreamVAE Latent Space</div>
                <div className="text-[10px] text-text-muted">Generative Replay Active</div>
              </div>
            </div>
            {/* Stats overlay */}
            <div className="hidden xl:flex min-w-0 flex-col justify-start gap-3 border-l border-border/50 p-4">
              <div className="rounded-lg border border-border bg-bg-base/50 p-3">
                <div className="text-[10px] text-text-muted uppercase tracking-wider">Task 1 Remembered</div>
                <div className="mt-1 font-mono text-xl font-bold">450</div>
              </div>
              <div className="rounded-lg border border-border bg-bg-base/50 p-3">
                <div className="text-[10px] text-text-muted uppercase tracking-wider">Dreams Generated</div>
                <div className="mt-1 font-mono text-xl font-bold text-accent-violet">247</div>
              </div>
              <div className="rounded-lg border border-border bg-bg-base/50 p-3">
                <div className="text-[10px] text-text-muted uppercase tracking-wider">Forgetting Down</div>
                <div className="mt-1 font-mono text-xl font-bold text-accent-teal">67%</div>
              </div>
              <div className="mt-auto border-t border-border pt-3">
                <DreamCycleViz compact />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
