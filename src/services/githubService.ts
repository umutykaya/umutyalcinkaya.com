import type {
  GitHubUser,
  GitHubRepo,
  GitHubOrg,
  OrgContribution,
  OrgRepoContribution,
  ContributionMatrix,
  HeatmapDay,
  ComplexityTier,
} from "@/types/github";
import { updateRateLimit } from "@/lib/rateLimit";

const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME || "umutykaya";
const GITHUB_API = "https://api.github.com";
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || "";

export type { GitHubRepo };

function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };
  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }
  return headers;
}

async function ghFetch(url: string): Promise<Response> {
  const res = await fetch(url, { headers: authHeaders() });
  updateRateLimit(res.headers);
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`);
  }
  return res;
}

// ── User Profile ──────────────────────────────────────────────────

export async function fetchGitHubUser(
  username: string = GITHUB_USERNAME,
): Promise<GitHubUser> {
  const res = await ghFetch(`${GITHUB_API}/users/${username}`);
  return res.json();
}

// ── Repos (simple – used by WorkSection) ──────────────────────────

export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  const res = await ghFetch(
    `${GITHUB_API}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated&type=owner`,
  );
  const repos: GitHubRepo[] = await res.json();
  return repos
    .filter((r) => !r.fork && !r.archived)
    .sort((a, b) => b.stargazers_count - a.stargazers_count);
}

// ── Repo Languages ────────────────────────────────────────────────

export async function fetchRepoLanguages(
  owner: string,
  repo: string,
): Promise<Record<string, number>> {
  const res = await ghFetch(`${GITHUB_API}/repos/${owner}/${repo}/languages`);
  return res.json();
}

// ── Complexity Score ──────────────────────────────────────────────

export function calculateComplexityScore(repo: GitHubRepo): number {
  const languageCount = repo.languages
    ? Object.keys(repo.languages).length
    : 0;

  const normalizedSize = Math.min(repo.size / 100000, 1);
  const normalizedStars = Math.min(repo.stargazers_count / 1000, 1);
  const normalizedForks = Math.min(repo.forks_count / 500, 1);
  const normalizedIssues = Math.min(repo.open_issues_count / 200, 1);
  const normalizedLangs = Math.min(languageCount / 10, 1);

  return (
    (normalizedSize * 0.3 +
      normalizedStars * 0.25 +
      normalizedForks * 0.2 +
      normalizedIssues * 0.15 +
      normalizedLangs * 0.1) *
    100
  );
}

export function getComplexityTier(score: number): ComplexityTier {
  if (score >= 80) return "Expert";
  if (score >= 60) return "Advanced";
  if (score >= 40) return "Moderate";
  if (score >= 20) return "Standard";
  return "Starter";
}

// ── Enriched Repos (with languages + complexity) ──────────────────

async function fetchAllRepos(
  username: string = GITHUB_USERNAME,
): Promise<GitHubRepo[]> {
  const allRepos: GitHubRepo[] = [];
  let page = 1;
  while (true) {
    const res = await ghFetch(
      `${GITHUB_API}/users/${username}/repos?sort=pushed&per_page=100&page=${page}&type=owner`,
    );
    const repos: GitHubRepo[] = await res.json();
    if (repos.length === 0) break;
    allRepos.push(...repos);
    if (repos.length < 100) break;
    page++;
  }
  return allRepos;
}

export async function fetchEnrichedRepos(
  username: string = GITHUB_USERNAME,
): Promise<GitHubRepo[]> {
  const repos = await fetchAllRepos(username);
  const filtered = repos.filter((r) => !r.fork && !r.archived);

  // Fetch languages in parallel (batches of 10 to avoid rate limit spikes)
  const batchSize = 10;
  for (let i = 0; i < filtered.length; i += batchSize) {
    const batch = filtered.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map((r) =>
        fetchRepoLanguages(username, r.name).catch(() => ({})),
      ),
    );
    batch.forEach((r, idx) => {
      r.languages = results[idx];
    });
  }

  // Compute complexity scores
  filtered.forEach((r) => {
    r.complexity_score = calculateComplexityScore(r);
    r.complexity_tier = getComplexityTier(r.complexity_score);
  });

  return filtered.sort(
    (a, b) => (b.complexity_score ?? 0) - (a.complexity_score ?? 0),
  );
}

// ── Contributions Heatmap ─────────────────────────────────────────

function assignLevel(count: number, max: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  const ratio = count / Math.max(max, 1);
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

interface GraphQLContributionDay {
  date: string;
  contributionCount: number;
  color: string;
}

interface GraphQLContributionWeek {
  contributionDays: GraphQLContributionDay[];
}

interface GitHubEvent {
  type: string;
  created_at: string;
  payload?: { commits?: unknown[] };
}

async function fetchContributionsGraphQL(
  username: string,
): Promise<ContributionMatrix> {
  const now = new Date();
  const sixMonthsAgo = new Date(now);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const query = `query($username:String!, $from:DateTime, $to:DateTime) {
    user(login:$username) {
      contributionsCollection(from:$from, to:$to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              color
            }
          }
        }
      }
    }
  }`;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GITHUB_TOKEN}`,
    },
    body: JSON.stringify({
      query,
      variables: {
        username,
        from: sixMonthsAgo.toISOString(),
        to: now.toISOString(),
      },
    }),
  });

  updateRateLimit(res.headers);

  if (!res.ok) throw new Error(`GraphQL error: ${res.status}`);

  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0]?.message ?? "GraphQL error");

  const calendar =
    json.data.user.contributionsCollection.contributionCalendar;
  const maxCount = Math.max(
    ...calendar.weeks.flatMap((w: GraphQLContributionWeek) =>
      w.contributionDays.map((d: GraphQLContributionDay) => d.contributionCount),
    ),
    1,
  );

  return {
    totalContributions: calendar.totalContributions,
    weeks: calendar.weeks.map((w: GraphQLContributionWeek) => ({
      days: w.contributionDays.map((d: GraphQLContributionDay) => ({
        date: d.date,
        count: d.contributionCount,
        level: assignLevel(d.contributionCount, maxCount),
      })),
    })),
  };
}

async function fetchContributionsREST(
  username: string,
): Promise<ContributionMatrix> {
  // Fetch up to 300 events (3 pages)
  const events: GitHubEvent[] = [];
  for (let page = 1; page <= 3; page++) {
    const res = await ghFetch(
      `${GITHUB_API}/users/${username}/events?per_page=100&page=${page}`,
    );
    const data = await res.json();
    events.push(...data);
    if (data.length < 100) break;
  }

  // Bucket push events by date
  const counts = new Map<string, number>();
  for (const e of events) {
    if (e.type === "PushEvent") {
      const date = e.created_at.slice(0, 10);
      counts.set(date, (counts.get(date) ?? 0) + (e.payload?.commits?.length ?? 1));
    }
  }

  // Build a 26-week matrix ending today
  const today = new Date();
  const days: HeatmapDay[] = [];

  // Go back to the most recent Sunday
  const endDay = new Date(today);
  endDay.setDate(endDay.getDate() + (6 - endDay.getDay()));

  const startDay = new Date(endDay);
  startDay.setDate(startDay.getDate() - 26 * 7 + 1);

  let maxCount = 0;
  const rawDays: { date: string; count: number }[] = [];

  for (
    let d = new Date(startDay);
    d <= endDay;
    d.setDate(d.getDate() + 1)
  ) {
    const dateStr = d.toISOString().slice(0, 10);
    const count = counts.get(dateStr) ?? 0;
    if (count > maxCount) maxCount = count;
    rawDays.push({ date: dateStr, count });
  }

  const heatmapDays: HeatmapDay[] = rawDays.map((rd) => ({
    ...rd,
    level: assignLevel(rd.count, maxCount),
  }));

  // Group into weeks (7 days each)
  const weeks: { days: HeatmapDay[] }[] = [];
  for (let i = 0; i < heatmapDays.length; i += 7) {
    weeks.push({ days: heatmapDays.slice(i, i + 7) });
  }

  const totalContributions = heatmapDays.reduce((s, d) => s + d.count, 0);

  return { totalContributions, weeks };
}

export async function fetchContributions(
  username: string = GITHUB_USERNAME,
): Promise<ContributionMatrix> {
  // Prefer GraphQL (6-month window) when token is available
  if (GITHUB_TOKEN) {
    try {
      return await fetchContributionsGraphQL(username);
    } catch {
      // Fall back to REST
    }
  }
  return fetchContributionsREST(username);
}

// ── Organization Contributions ────────────────────────────────────

export async function fetchUserOrgs(
  username: string = GITHUB_USERNAME,
): Promise<GitHubOrg[]> {
  const res = await ghFetch(`${GITHUB_API}/users/${username}/orgs?per_page=100`);
  return res.json();
}

interface GraphQLRepoContributionEntry {
  contributions: { totalCount: number };
  repository: {
    name: string;
    url: string;
    isPrivate: boolean;
    owner: {
      __typename: string;
      login: string;
      avatarUrl: string;
      url: string;
      description?: string | null;
    };
  };
}

interface GraphQLOrgNode {
  login: string;
  name: string | null;
  avatarUrl: string;
  description: string | null;
  url: string;
}

async function fetchOrgContributionsGraphQL(
  username: string,
): Promise<OrgContribution[]> {
  const now = new Date();
  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const repoFragment = `
    contributions { totalCount }
    repository {
      name
      url
      isPrivate
      owner {
        __typename
        login
        avatarUrl
        url
        ... on Organization { description }
      }
    }`;

  const query = `query($username:String!, $from:DateTime, $to:DateTime) {
    user(login:$username) {
      organizations(first: 50) {
        nodes { login name avatarUrl description url }
      }
      contributionsCollection(from:$from, to:$to) {
        commitContributionsByRepository(maxRepositories: 100) { ${repoFragment} }
        pullRequestContributionsByRepository(maxRepositories: 100) { ${repoFragment} }
        issueContributionsByRepository(maxRepositories: 100) { ${repoFragment} }
        pullRequestReviewContributionsByRepository(maxRepositories: 100) { ${repoFragment} }
      }
    }
  }`;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GITHUB_TOKEN}`,
    },
    body: JSON.stringify({
      query,
      variables: {
        username,
        from: oneYearAgo.toISOString(),
        to: now.toISOString(),
      },
    }),
  });

  updateRateLimit(res.headers);
  if (!res.ok) throw new Error(`GraphQL error: ${res.status}`);

  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0]?.message ?? "GraphQL error");

  // Seed orgs with the user's known org memberships.
  const orgNodes: GraphQLOrgNode[] = json.data.user.organizations.nodes ?? [];
  const orgByLogin = new Map<string, GitHubOrg>();
  orgNodes.forEach((o) => {
    orgByLogin.set(o.login, {
      login: o.login,
      id: 0,
      avatar_url: o.avatarUrl,
      description: o.description,
      url: o.url,
    });
  });

  const collection = json.data.user.contributionsCollection;
  const allEntries: GraphQLRepoContributionEntry[] = [
    ...(collection.commitContributionsByRepository ?? []),
    ...(collection.pullRequestContributionsByRepository ?? []),
    ...(collection.issueContributionsByRepository ?? []),
    ...(collection.pullRequestReviewContributionsByRepository ?? []),
  ];

  // Aggregate per (owner, repo) summing across all contribution types.
  const repoTotals = new Map<
    string,
    {
      ownerLogin: string;
      ownerType: string;
      ownerAvatar: string;
      ownerUrl: string;
      ownerDescription: string | null;
      name: string;
      url: string;
      total: number;
      isPrivate: boolean;
    }
  >();

  for (const entry of allEntries) {
    const owner = entry.repository.owner;
    if (owner.login.toLowerCase() === username.toLowerCase()) continue;
    const key = `${owner.login}/${entry.repository.name}`;
    const existing = repoTotals.get(key);
    if (existing) {
      existing.total += entry.contributions.totalCount;
    } else {
      repoTotals.set(key, {
        ownerLogin: owner.login,
        ownerType: owner.__typename,
        ownerAvatar: owner.avatarUrl,
        ownerUrl: owner.url,
        ownerDescription: owner.description ?? null,
        name: entry.repository.name,
        url: entry.repository.url,
        total: entry.contributions.totalCount,
        isPrivate: entry.repository.isPrivate,
      });
    }
  }

  // Group repos by org owner. Only include Organization-owned repos.
  const grouped = new Map<string, OrgContribution>();
  for (const r of repoTotals.values()) {
    if (r.isPrivate) continue;
    if (r.ownerType !== "Organization") continue;

    const org: GitHubOrg = orgByLogin.get(r.ownerLogin) ?? {
      login: r.ownerLogin,
      id: 0,
      avatar_url: r.ownerAvatar,
      description: r.ownerDescription,
      url: r.ownerUrl,
    };
    // Make sure we have a canonical entry in orgByLogin for later merge.
    if (!orgByLogin.has(r.ownerLogin)) orgByLogin.set(r.ownerLogin, org);

    const repo: OrgRepoContribution = {
      name: r.name,
      url: r.url,
      contributions: r.total,
    };

    const existing = grouped.get(r.ownerLogin);
    if (existing) {
      existing.totalContributions += repo.contributions;
      existing.repos.push(repo);
    } else {
      grouped.set(r.ownerLogin, {
        org,
        totalContributions: repo.contributions,
        repos: [repo],
      });
    }
  }

  // Include orgs the user is a public member of even if no contributions in window.
  orgByLogin.forEach((org, login) => {
    if (!grouped.has(login)) {
      grouped.set(login, { org, totalContributions: 0, repos: [] });
    }
  });

  return Array.from(grouped.values())
    .map((g) => ({
      ...g,
      repos: g.repos.sort((a, b) => b.contributions - a.contributions),
    }))
    .sort((a, b) => b.totalContributions - a.totalContributions);
}

export async function fetchOrgContributions(
  username: string = GITHUB_USERNAME,
): Promise<OrgContribution[]> {
  if (GITHUB_TOKEN) {
    try {
      return await fetchOrgContributionsGraphQL(username);
    } catch {
      // Fall back to REST (orgs only, no contribution counts)
    }
  }
  const orgs = await fetchUserOrgs(username);
  return orgs.map((org) => ({
    org,
    totalContributions: 0,
    repos: [],
  }));
}
