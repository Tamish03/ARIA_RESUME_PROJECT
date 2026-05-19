"use client";

import { HeroSection } from "@/components/hero/HeroSection";
import { FeatureCard } from "@/components/hero/FeatureCard";
import { Brain, Sparkles, Orbit } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-bg-base relative pb-20">
      <HeroSection />
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 -mt-24 relative z-20">
        <FeatureCard 
          title="VAE Taste Encoding" 
          description="Transforms binary rating matrices into a 20-dimensional continuous latent taste space using deep variational inference."
          icon={Brain}
          accent="teal"
          delay={0.2}
        />
        <FeatureCard 
          title="PSO Swarm Search" 
          description="Particle Swarm Optimization navigates a 6-dimensional hyperparameter hyperspace to discover the optimal neural architecture."
          icon={Orbit}
          accent="amber"
          delay={0.4}
        />
        <FeatureCard 
          title="Dream Replay Memory" 
          description="Generative replay via DreamVAE produces synthetic past-task users to prevent catastrophic forgetting during continual learning."
          icon={Sparkles}
          accent="violet"
          delay={0.6}
        />
      </div>
    </main>
  );
}
