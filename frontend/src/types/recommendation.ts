export type DimensionContribution = {
  dim: string;
  name: string;
  contribution: number;
};

export type Recommendation = {
  movie_id: number;
  title: string;
  year: number;
  genres: string[];
  match_score: number;
  similarity_dims: number[];
  why_recommended: string;
};

export type RecommendationExplanation = {
  cosine_similarity: number;
  top_dims: DimensionContribution[];
  neighbor_users: number[];
};
