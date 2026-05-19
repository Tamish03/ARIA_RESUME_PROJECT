export type User = {
  user_id: number;
  taste_vector: number[];
  engagement_score: number;
  top_genres: string[];
  rating_count: number;
};

export type UserNeighbor = {
  user_id: number;
  similarity: number;
  shared_genres: string[];
};
