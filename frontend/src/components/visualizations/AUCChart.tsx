"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { motion } from "framer-motion";

interface AUCChartProps {
  data?: { iter: number; auc: number; randomAuc?: number }[];
}

// Default mock data if none provided
const defaultData = Array.from({ length: 10 }).map((_, i) => ({
  iter: i + 1,
  auc: i === 9 ? 0.9345 : 0.75 + i * 0.018 + Math.random() * 0.02,
  randomAuc: 0.70 + i * 0.008 + Math.random() * 0.01,
}));

function subscribeToClientRender() {
  return () => {};
}

export function AUCChart({ data = defaultData }: AUCChartProps) {
  const [visibleCount, setVisibleCount] = useState(2);
  const isClient = useSyncExternalStore(
    subscribeToClientRender,
    () => true,
    () => false
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      setVisibleCount((current) => {
        if (current >= data.length) return data.length;
        return current + 1;
      });
    }, 900);
    return () => window.clearInterval(interval);
  }, [data.length]);

  const visibleData = useMemo(
    () => data.slice(0, Math.max(2, Math.min(visibleCount, data.length))),
    [data, visibleCount]
  );

  if (!isClient) return <div className="flex h-full min-h-0 items-center justify-center text-text-muted">Loading Chart...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full h-full min-h-0"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={visibleData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="iter" 
            tick={{ fill: "rgba(232,234,240,0.5)", fontSize: 10 }}
            axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            tickLine={false}
          />
          <YAxis 
            domain={[0.6, 1.0]} 
            tick={{ fill: "rgba(232,234,240,0.5)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(val: number) => val.toFixed(2)}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: "#0d0f1c", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }}
            itemStyle={{ color: "#e8eaf0" }}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", color: "rgba(232,234,240,0.7)" }} />
          <Line 
            type="monotone" 
            name="PSO Best"
            dataKey="auc" 
            stroke="#f5a623" 
            strokeWidth={3} 
            dot={{ r: 3, fill: "#f5a623", strokeWidth: 0 }} 
            activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
            isAnimationActive={true}
            animationDuration={1500}
          />
          {data[0]?.randomAuc != null && (
            <Line 
              type="monotone" 
              name="Random Search"
              dataKey="randomAuc" 
              stroke="#e8eaf0" 
              strokeOpacity={0.3}
              strokeWidth={2} 
              dot={false}
              isAnimationActive={true}
              animationDuration={1500}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
