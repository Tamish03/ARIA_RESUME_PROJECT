"use client";

import { useSyncExternalStore } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { Users, Film, Star, TrendingUp, Sparkles } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";

const ratingData = [
  { rating: "1", count: 1200 },
  { rating: "2", count: 2800 },
  { rating: "3", count: 6500 },
  { rating: "4", count: 8900 },
  { rating: "5", count: 4200 },
];

const genreData = [
  { name: "Sci-Fi", value: 34, color: "#5b8dff" },
  { name: "Drama", value: 22, color: "#a78bfa" },
  { name: "Action", value: 18, color: "#ff6b6b" },
  { name: "Comedy", value: 14, color: "#f5a623" },
  { name: "Other", value: 12, color: "#8b92a5" },
];

const timelineData = [
  { month: "Jan", users: 120, recs: 300 },
  { month: "Feb", users: 240, recs: 800 },
  { month: "Mar", users: 450, recs: 1500 },
  { month: "Apr", users: 600, recs: 2400 },
  { month: "May", users: 750, recs: 3200 },
  { month: "Jun", users: 820, recs: 4100 },
  { month: "Jul", users: 943, recs: 5600 },
];

function subscribeToClientRender() {
  return () => {};
}

export default function AnalyticsPage() {
  const isClient = useSyncExternalStore(
    subscribeToClientRender,
    () => true,
    () => false
  );

  return (
    <div className="space-y-8 pb-12">
      <PageHeader 
        title="Platform Analytics" 
        description="Global metrics and insights across the entire ARIA ecosystem."
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="Total Users" value="943" icon={<Users />} accent="blue" />
        <StatCard label="Rated Movies" value="1,682" icon={<Film />} accent="blue" />
        <StatCard label="Avg Rating" value="3.53" icon={<Star />} accent="amber" />
        <StatCard label="Model Accuracy" value="93%" icon={<TrendingUp />} accent="teal" />
        <StatCard label="Dream Cycles" value="12" icon={<Sparkles />} accent="violet" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-display font-bold mb-6">Rating Distribution</h3>
          <div className="h-64">
            {isClient ? <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="rating" axisLine={false} tickLine={false} tick={{ fill: "rgba(232,234,240,0.5)", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "rgba(232,234,240,0.5)", fontSize: 12 }} />
                <RechartsTooltip cursor={{ fill: "rgba(255,255,255,0.05)" }} contentStyle={{ backgroundColor: "#0d0f1c", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }} />
                <Bar dataKey="count" fill="url(#colorUv)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5b8dff" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#5b8dff" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer> : <div className="h-full flex items-center justify-center text-text-muted">Loading Chart...</div>}
          </div>
        </Card>

        <Card className="p-6 flex flex-col">
          <h3 className="font-display font-bold mb-2">Global Genre Preferences</h3>
          <div className="flex-1 flex items-center justify-center relative min-h-[250px]">
            {isClient ? <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genreData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {genreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: "#0d0f1c", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff" }} itemStyle={{ color: "#fff" }} />
              </PieChart>
            </ResponsiveContainer> : <div className="h-full flex items-center justify-center text-text-muted">Loading Chart...</div>}
            {/* Custom Legend */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-3 pointer-events-none pr-8">
              {genreData.map((g) => (
                <div key={g.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: g.color }} />
                  <span className="text-sm font-medium">{g.name}</span>
                  <span className="text-xs text-text-muted ml-auto">{g.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-display font-bold mb-6">User Engagement Timeline</h3>
        <div className="h-80">
          {isClient ? <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5b8dff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#5b8dff" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorRecs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4aa" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00d4aa" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "rgba(232,234,240,0.5)", fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "rgba(232,234,240,0.5)", fontSize: 12 }} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <RechartsTooltip contentStyle={{ backgroundColor: "#0d0f1c", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }} />
              <Area type="monotone" dataKey="recs" stroke="#00d4aa" strokeWidth={2} fillOpacity={1} fill="url(#colorRecs)" name="Recommendations Served" />
              <Area type="monotone" dataKey="users" stroke="#5b8dff" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" name="Active Users" />
            </AreaChart>
          </ResponsiveContainer> : <div className="h-full flex items-center justify-center text-text-muted">Loading Chart...</div>}
        </div>
      </Card>
    </div>
  );
}
