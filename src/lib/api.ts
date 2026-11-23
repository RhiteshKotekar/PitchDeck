import Constants from "expo-constants";
import type {
  Idea,
  CreateIdeaInput,
  UpdateIdeaInput,
  UpdateProfileInput,
  User,
  PaginatedResponse,
  LeaderboardEntry,
  ProfileStats,
} from "@/types";

const API_URL =
  Constants.expoConfig?.extra?.apiUrl ??
  process.env.EXPO_PUBLIC_API_URL ??
  "http://localhost:3000";

let getToken: (() => Promise<string | null>) | null = null;

export function setTokenGetter(fn: () => Promise<string | null>) {
  getToken = fn;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (getToken) {
    const token = await getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiRequestError(
      body.message ?? body.error ?? `Request failed (${res.status})`,
      res.status
    );
  }

  if (res.status === 204) return undefined as T;
  const json = await res.json();
  if (json && typeof json === "object" && "data" in json && !("pageSize" in json)) {
    return json.data as T;
  }
  return json as T;
}

export class ApiRequestError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "ApiRequestError";
    this.statusCode = statusCode;
  }
}

// ── User ──
export const userApi = {
  getMe: () => request<User>("/api/me"),
  updateMe: (data: UpdateProfileInput) =>
    request<User>("/api/me", { method: "PATCH", body: JSON.stringify(data) }),
};

// ── Ideas ──
export interface GetIdeasParams {
  page?: number;
  pageSize?: number;
  sort?: "newest" | "highest_rated" | "most_voted" | "trending";
  category?: string;
  search?: string;
}

export const ideasApi = {
  list: (params: GetIdeasParams = {}) => {
    const qs = new URLSearchParams();
    if (params.page) qs.set("page", String(params.page));
    if (params.pageSize) qs.set("pageSize", String(params.pageSize));
    if (params.sort) qs.set("sort", params.sort);
    if (params.category && params.category !== "All") qs.set("category", params.category);
    if (params.search) qs.set("search", params.search);
    const query = qs.toString();
    return request<PaginatedResponse<Idea>>(`/api/ideas${query ? `?${query}` : ""}`);
  },
  get: (id: string) => request<Idea>(`/api/ideas/${id}`),
  create: (data: CreateIdeaInput) =>
    request<Idea>("/api/ideas", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: UpdateIdeaInput) =>
    request<Idea>(`/api/ideas/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) =>
    request<void>(`/api/ideas/${id}`, { method: "DELETE" }),
  vote: (id: string) =>
    request<{ voteCount: number }>(`/api/ideas/${id}/vote`, { method: "POST" }),
  unvote: (id: string) =>
    request<{ voteCount: number }>(`/api/ideas/${id}/vote`, { method: "DELETE" }),
  myIdeas: () => request<Idea[]>("/api/users/me/ideas"),
};

// ── Leaderboard ──
export interface LeaderboardParams {
  period?: "week" | "all";
  mode?: "most_voted" | "highest_rated";
}

export const leaderboardApi = {
  get: (params: LeaderboardParams = {}) => {
    const qs = new URLSearchParams();
    if (params.period) qs.set("period", params.period);
    if (params.mode) qs.set("mode", params.mode);
    const query = qs.toString();
    return request<LeaderboardEntry[]>(`/api/leaderboard${query ? `?${query}` : ""}`);
  },
};

// ── Profile stats ──
export const profileApi = {
  stats: () => request<ProfileStats>("/api/users/me/stats"),
};

