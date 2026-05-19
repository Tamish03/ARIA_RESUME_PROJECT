"use client";

import { useSyncExternalStore } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const data = [
  { dim: "Genre Affinity", you: 85, cluster: 65 },
  { dim: "Rating Intensity", you: 62, cluster: 70 },
  { dim: "Viewing Breadth", you: 90, cluster: 55 },
  { dim: "Recency Bias", you: 30, cluster: 45 },
  { dim: "Franchise Pull", you: 45, cluster: 60 },
  { dim: "Indie Tendency", you: 70, cluster: 40 },
  { dim: "Auteur Preference", you: 80, cluster: 50 },
  { dim: "Rewatch Drive", you: 55, cluster: 65 },
];

function subscribeToClientRender() {
  return () => {};
}

export function TasteRadar() {
  const isClient = useSyncExternalStore(
    subscribeToClientRender,
    () => true,
    () => false
  );

  if (!isClient) return <div className="h-[300px] flex items-center justify-center text-text-muted">Loading Radar...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis 
            dataKey="dim" 
            tick={{ fill: "rgba(232,234,240,0.5)", fontSize: 10, fontFamily: "var(--font-dm-sans)" }} 
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          
          <Radar
            name="Cluster Avg"
            dataKey="cluster"
            stroke="#00d4aa"
            strokeWidth={2}
            strokeDasharray="4 4"
            fill="none"
          />
          <Radar
            name="You"
            dataKey="you"
            stroke="#5b8dff"
            strokeWidth={2}
            fill="#5b8dff"
            fillOpacity={0.25}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
