"use client";

import { useState, useEffect } from "react";
import api from "../lib/api";
import { User, UserNeighbor } from "../types/user";

export function useUser(userId: number) {
  const [user, setUser] = useState<User | null>(null);
  const [neighbors, setNeighbors] = useState<UserNeighbor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        setIsLoading(true);
        const [userRes, neighborRes] = await Promise.all([
          api.get(`/users/${userId}`),
          api.get(`/users/${userId}/neighbors`)
        ]);
        setUser(userRes.data);
        setNeighbors(neighborRes.data);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (userId) fetchUser();
  }, [userId]);

  return { user, neighbors, isLoading };
}
