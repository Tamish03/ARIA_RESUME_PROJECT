"use client";

import { useState, useEffect } from "react";
import api from "../lib/api";

type TasteVectorData = {
  z: number[];
  dim_names: string[];
  umap_x: number;
  umap_y: number;
};

type UmapProjection = {
  user_id: number;
  x: number;
  y: number;
  top_genre: string;
  cluster_id: number;
};

export function useTasteVector(userId: number) {
  const [vectorData, setVectorData] = useState<TasteVectorData | null>(null);
  const [umapData, setUmapData] = useState<UmapProjection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTasteData() {
      try {
        setIsLoading(true);
        const [vecRes, umapRes] = await Promise.all([
          api.get(`/taste/${userId}/vector`),
          api.get(`/taste/umap-projection`)
        ]);
        setVectorData(vecRes.data);
        setUmapData(umapRes.data);
      } catch (error) {
        console.error("Failed to fetch taste data", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (userId) fetchTasteData();
  }, [userId]);

  return { vectorData, umapData, isLoading };
}
