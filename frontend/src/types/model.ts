export type SwarmHistoryEntry = {
  iteration: number;
  particle_id: number;
  position: number[];
  auc: number;
  is_gbest: boolean;
};

export type SwarmBest = {
  lr: number;
  dropout: number;
  h1: number;
  h2: number;
  l2: number;
  batch_size: number;
  auc: number;
  architecture_description: string;
};

export type SwarmComparison = {
  pso: { iter: number; auc: number }[];
  random: { iter: number; auc: number }[];
};

export type DreamStatus = {
  task1_real: number;
  task2_real: number;
  dreams_generated: number;
  forgetting_reduction: number;
  cycle_stage: string;
};

export type DreamSample = {
  dream_id: string;
  synthetic_user_vector: number[];
  source_task: number;
  mu: number[];
  sigma: number[];
};
