"use client";

import { useState, useEffect } from "react";
import api from "../lib/api";
import { SwarmHistoryEntry, SwarmBest, SwarmComparison } from "../types/model";

export function useSwarmData() {
  const [history, setHistory] = useState<SwarmHistoryEntry[]>([]);
  const [best, setBest] = useState<SwarmBest | null>(null);
  const [comparison, setComparison] = useState<SwarmComparison | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [historyRes, bestRes, compRes] = await Promise.all([
          api.get("/swarm/history"),
          api.get("/swarm/best"),
          api.get("/swarm/comparison")
        ]);
        setHistory(historyRes.data);
        setBest(bestRes.data);
        setComparison(compRes.data);
      } catch (error) {
        console.error("Failed to fetch swarm data", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);

  return { history, best, comparison, isLoading };
}
