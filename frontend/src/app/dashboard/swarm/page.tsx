"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { SwarmField3D } from "@/components/visualizations/SwarmField3D";
import { AUCChart } from "@/components/visualizations/AUCChart";
import { Card } from "@/components/ui/Card";
import { useSwarmData } from "@/hooks/useSwarmData";
import { Activity, Cpu, Network, Gauge } from "lucide-react";

export default function SwarmPage() {
  const { history, best, comparison, isLoading } = useSwarmData();
  const particleCount = history.length
    ? new Set(history.map((entry) => entry.particle_id)).size
    : 12;
  const iterationCount = history.length
    ? Math.max(...history.map((entry) => entry.iteration))
    : 10;
  const networksTrained = history.length || particleCount * iterationCount;
  const bestAuc = best?.auc ?? 0.9345;
  const architectureSteps = (
    best?.architecture_description ??
    "Input(8) -> Dense(416) -> BN -> ReLU -> Dropout(0.45) -> Dense(203) -> BN -> ReLU -> Dropout(0.27) -> Dense(1) -> Sigmoid"
  ).split(" -> ");
  const chartData = comparison?.pso.map((p, i) => ({
    iter: p.iter,
    auc: p.auc,
    randomAuc: comparison.random[i]?.auc,
  }));

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Swarm Intelligence"
        description="Particle Swarm Optimization navigating hyperparameter space to maximize engagement AUC."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="p-3 bg-accent-amber/10 rounded-lg text-accent-amber"><Network /></div>
          <div><div className="text-2xl font-bold">{particleCount}</div><div className="text-xs text-text-muted uppercase">Particles</div></div>
        </div>
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="p-3 bg-accent-amber/10 rounded-lg text-accent-amber"><Activity /></div>
          <div><div className="text-2xl font-bold">{iterationCount}</div><div className="text-xs text-text-muted uppercase">Iterations</div></div>
        </div>
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="p-3 bg-accent-amber/10 rounded-lg text-accent-amber"><Cpu /></div>
          <div><div className="text-2xl font-bold">{networksTrained}</div><div className="text-xs text-text-muted uppercase">Networks Trained</div></div>
        </div>
        <div className="glass-card p-4 flex items-center gap-4 border-accent-amber/30">
          <div className="p-3 bg-accent-amber/20 rounded-lg text-accent-amber"><Gauge /></div>
          <div><div className="text-2xl font-bold text-accent-amber">{bestAuc.toFixed(4)}</div><div className="text-xs text-text-muted uppercase">Best AUC</div></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-[500px] p-0 overflow-hidden flex flex-col" glowColor="amber">
          <div className="flex justify-between items-center p-6 pb-2">
            <h3 className="font-display font-bold text-accent-amber">3D Hyperparameter Space</h3>
            <span className="text-xs font-mono text-text-muted">Live PSO (6D -&gt; 3D Projection)</span>
          </div>
          <div className="flex-1 relative">
            <SwarmField3D />
            <div className="absolute top-3 left-3 bg-bg-base/70 backdrop-blur-sm border border-accent-amber/20 rounded-lg px-3 py-1.5">
              <div className="text-[10px] text-accent-amber/70 uppercase tracking-wider">Active Swarm</div>
              <div className="font-mono text-sm font-bold text-accent-amber">
                {isLoading ? "Loading..." : `${particleCount} Particles`}
              </div>
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="p-6 flex-1">
            <h3 className="font-display font-bold mb-4">Convergence: PSO vs Random Search</h3>
            <div className="h-64">
              {chartData ? <AUCChart data={chartData} /> : <AUCChart />}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-display font-bold mb-4">Winning Architecture (gbest)</h3>

            <div className="bg-bg-base border border-border rounded-lg p-4 font-mono text-sm mb-6 flex overflow-x-auto whitespace-nowrap">
              {architectureSteps.map((step, index) => (
                <span key={`${step}-${index}`} className="inline-flex items-center">
                  <span
                    className={
                      step.startsWith("Input")
                        ? "text-text-muted"
                        : step.startsWith("Dropout")
                          ? "text-accent-violet"
                          : step.startsWith("Dense")
                            ? "text-accent-blue"
                            : step.startsWith("Sigmoid")
                              ? "text-accent-amber"
                              : "text-accent-teal"
                    }
                  >
                    {step}
                  </span>
                  {index < architectureSteps.length - 1 && (
                    <span className="mx-2 text-accent-teal">-&gt;</span>
                  )}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-bg-surface rounded border border-border">
                <div className="text-xs text-text-muted mb-1">Learning Rate</div>
                <div className="font-mono text-accent-teal">{best?.lr ?? "0.00123"}</div>
              </div>
              <div className="p-3 bg-bg-surface rounded border border-border">
                <div className="text-xs text-text-muted mb-1">L2 Regularization</div>
                <div className="font-mono text-accent-teal">{best?.l2 ?? "1e-5"}</div>
              </div>
              <div className="p-3 bg-bg-surface rounded border border-border">
                <div className="text-xs text-text-muted mb-1">Batch Size</div>
                <div className="font-mono text-accent-teal">{best?.batch_size ?? "128"}</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
