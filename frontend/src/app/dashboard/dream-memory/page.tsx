"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { DreamCycleViz } from "@/components/visualizations/DreamCycleViz";
import { DreamOrb } from "@/components/visualizations/DreamOrb";
import { Card } from "@/components/ui/Card";
import { ShieldAlert, Database, RefreshCcw } from "lucide-react";

const architectureNodes = [
  { label: "User(16D)", tone: "base" },
  { label: "Dense(64)", tone: "violet" },
  { label: "Dense(32)", tone: "violet" },
  { label: "Sample", sub: "[mu, sigma2]", tone: "sample" },
  { label: "Dense(32)", tone: "teal" },
  { label: "Dense(64)", tone: "teal" },
  { label: "x-hat(16D)", tone: "base" },
];

export default function DreamMemoryPage() {
  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Dream Replay Memory"
        description="Generative replay pipeline addressing catastrophic forgetting in continual learning."
      />

      <div className="bg-accent-coral/10 border border-accent-coral/30 rounded-xl p-4 flex items-start gap-4 mb-8">
        <div className="p-2 bg-accent-coral/20 rounded-full text-accent-coral shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-semibold text-accent-coral mb-1">Catastrophic Forgetting Warning</h4>
          <p className="text-sm text-text-muted">
            Without Dream Replay, old users are forgotten. With it, ARIA remembers forever.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Card className="p-0 overflow-hidden" glowColor="violet">
            <div className="flex justify-between items-center p-5 pb-0">
              <h3 className="font-display font-bold text-accent-violet">DreamVAE Latent Space</h3>
              <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">Live Generation</span>
            </div>
            <div className="h-[320px] relative">
              <DreamOrb />
              <div className="absolute bottom-3 left-3 bg-bg-base/60 backdrop-blur-sm border border-border rounded-lg px-3 py-1.5">
                <div className="text-[10px] text-accent-violet/70 uppercase tracking-wider">Latent Manifold</div>
                <div className="text-[10px] text-text-muted">8D to Synthetic Users</div>
              </div>
              <div className="absolute top-3 right-3 bg-accent-violet/10 backdrop-blur-sm border border-accent-violet/20 rounded-lg px-3 py-1.5">
                <div className="text-[10px] text-accent-violet/70 uppercase tracking-wider">Dreams</div>
                <div className="font-mono text-sm font-bold text-accent-violet">247 generated</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 flex flex-col items-center justify-center bg-bg-surface/50" glowColor="violet">
            <h3 className="font-display font-bold text-accent-violet mb-4 self-start w-full">Continual Learning Cycle</h3>
            <div className="w-full">
              <DreamCycleViz />
            </div>
          </Card>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-5">
              <div className="flex items-center gap-2 text-text-muted mb-2">
                <Database className="w-4 h-4" /> Real Users
              </div>
              <div className="text-2xl font-mono font-bold mb-1">
                450 <span className="text-sm text-text-muted font-sans font-normal">(Task 1)</span>
              </div>
              <div className="text-2xl font-mono font-bold">
                250 <span className="text-sm text-text-muted font-sans font-normal">(Task 2)</span>
              </div>
            </Card>
            <Card className="p-5 border-accent-violet/30 bg-accent-violet/5" glowColor="violet">
              <div className="flex items-center gap-2 text-accent-violet mb-2">
                <RefreshCcw className="w-4 h-4" /> Generated Dreams
              </div>
              <div className="text-4xl font-mono font-bold text-accent-violet mb-1">247</div>
              <div className="text-xs text-text-muted">Synthetic Task 1 Users</div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="font-display font-bold mb-5">DreamVAE Architecture</h3>
            <div className="grid min-h-[440px] grid-cols-1 gap-5 rounded-xl border border-border bg-bg-base p-5 lg:grid-cols-[15rem_minmax(0,1fr)]">
              <div className="relative flex flex-col items-stretch justify-between gap-3">
                <div className="absolute left-1/2 top-10 bottom-10 w-px -translate-x-1/2 bg-gradient-to-b from-border via-accent-violet/50 to-accent-teal/50" />
                {architectureNodes.map((node, idx) => (
                  <div key={node.label + '-' + idx} className="relative z-10 flex justify-center">
                    <div
                      className={
                        node.tone === "violet"
                          ? "flex min-h-11 w-32 flex-col items-center justify-center rounded border border-accent-violet/35 bg-accent-violet/10 font-mono text-xs text-accent-violet"
                          : node.tone === "teal"
                            ? "flex min-h-11 w-32 flex-col items-center justify-center rounded border border-accent-teal/35 bg-accent-teal/10 font-mono text-xs text-accent-teal"
                            : node.tone === "sample"
                              ? "flex min-h-16 w-36 flex-col items-center justify-center rounded border border-accent-violet/50 bg-gradient-to-br from-accent-violet/20 to-accent-teal/20 font-mono text-xs shadow-[0_0_18px_rgba(167,139,250,0.26)]"
                              : "flex min-h-11 w-32 flex-col items-center justify-center rounded border border-border bg-bg-surface font-mono text-xs"
                      }
                    >
                      <span className="font-bold">{node.label}</span>
                      {node.sub && <span className="mt-1 text-[10px] text-text-muted">{node.sub}</span>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex min-w-0 flex-col justify-center rounded-lg border border-border/70 bg-bg-surface/40 p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-accent-violet">Encoder</div>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  User vectors compress into a compact latent distribution where the model stores taste uncertainty instead of a single brittle point.
                </p>
                <div className="my-5 h-px bg-border" />
                <div className="text-xs font-bold uppercase tracking-wider text-accent-teal">Decoder</div>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  The decoder reconstructs synthetic users from sampled latent states, giving Dream Replay memory for continual learning.
                </p>
                <div className="mt-6 rounded-lg border border-accent-violet/20 bg-accent-violet/5 p-4 text-sm italic text-text-muted">
                  &quot;Encodes users as continuous distributions, not fixed points&quot;
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-display font-bold mb-4">Task 1 Retention Performance</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-text-muted">Without Dream Replay</span>
                  <span className="text-accent-coral font-bold font-mono">34%</span>
                </div>
                <div className="h-2 bg-bg-base rounded-full overflow-hidden">
                  <div className="h-full bg-accent-coral w-[34%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-text-muted">With Dream Replay</span>
                  <span className="text-accent-teal font-bold font-mono">89%</span>
                </div>
                <div className="h-2 bg-bg-base rounded-full overflow-hidden">
                  <div className="h-full bg-accent-teal w-[89%]" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
