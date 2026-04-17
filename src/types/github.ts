export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  bio: string | null;
  location: string | null;
  blog: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  topics: string[];
  fork: boolean;
  archived: boolean;
  pushed_at: string;
  updated_at: string;
  languages?: Record<string, number>;
  complexity_score?: number;
  complexity_tier?: ComplexityTier;
}

export type ComplexityTier = "Expert" | "Advanced" | "Moderate" | "Standard" | "Starter";

export interface HeatmapDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionWeek {
  days: HeatmapDay[];
}

export interface ContributionMatrix {
  totalContributions: number;
  weeks: ContributionWeek[];
}

export interface RateLimitInfo {
  remaining: number;
  limit: number;
  resetAt: number; // unix timestamp in seconds
}

export type SortField = "complexity_score" | "stargazers_count" | "size" | "forks_count" | "name";
export type SortDirection = "asc" | "desc";
