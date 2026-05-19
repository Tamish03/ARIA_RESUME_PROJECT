"use client";

import { useState, useEffect } from "react";
import api from "../lib/api";
import { Recommendation } from "../types/recommendation";

export function useRecommendations(userId: number, genre?: string, mode?: string) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRecs() {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        params.append("limit", "20");
        if (genre && genre !== "All") params.append("genre", genre.toLowerCase());
        if (mode) params.append("mode", mode);
        
        const res = await api.get(`/recommendations/${userId}?${params.toString()}`);
        setRecommendations(res.data);
      } catch (error) {
        console.error("Failed to fetch recommendations", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (userId) fetchRecs();
  }, [userId, genre, mode]);

  return { recommendations, isLoading };
}
