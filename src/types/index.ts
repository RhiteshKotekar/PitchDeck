// User types
export interface User {
  id: number;
  clerkUserId: string;
  displayName: string;
  username: string | null;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
}

// Idea types
export interface AIFeedback {
  strengths: string[];
  improvements: string[];
  summary: string;
}

export interface Idea {
  id: string;
  authorId: number;
  name: string;
  tagline: string;
  description: string;
  category: string;
  aiScore: number;
  marketPotentialScore: number;
  innovationScore: number;
  feasibilityScore: number;
  aiFeedback: AIFeedback;
  createdAt: string;
  updatedAt: string;
  // Computed / joined
  author?: Pick<User, "displayName" | "avatarUrl" | "username">;
  voteCount?: number;
  hasVoted?: boolean;
}

export interface CreateIdeaInput {
  name: string;
  tagline: string;
  description: string;
  category: string;
}

export interface UpdateIdeaInput {
  name?: string;
  tagline?: string;
  description?: string;
  category?: string;
}

export interface UpdateProfileInput {
  displayName?: string;
  username?: string;
  bio?: string;
  avatarUrl?: string;
}

// Leaderboard
export interface LeaderboardEntry {
  rank: number;
  idea: Idea;
}

// API response types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

// Profile stats
export interface ProfileStats {
  ideasCount: number;
  totalVotes: number;
  averageScore: number;
}

