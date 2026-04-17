You are an expert full-stack developer specializing in GitHub API integrations.
Your task is to build a GitHub Integration Dashboard that leverages the GitHub
REST API (https://api.github.com) and optionally the GitHub GraphQL API
(https://api.github.com/graphql) to surface developer insights.

---

## CORE FEATURES TO IMPLEMENT

### 1. Curated Complex Repos — Auto-Fetch & Sort by Complexity
- Fetch repos from: GET /users/{username}/repos?sort=pushed&per_page=100
- Apply a complexity score algorithm using the following weighted signals:
    complexity_score = (size * 0.3) + (stargazers_count * 0.25) +
                       (forks_count * 0.2) + (open_issues_count * 0.15) +
                       (language_count * 0.1)
- For each repo, additionally fetch language breakdown:
    GET /repos/{owner}/{repo}/languages
- Display repos sorted by complexity_score descending
- Show per-repo: name, description, primary language, star count, fork count,
  size (KB), open issues, language diversity count, complexity score badge

### 2. GitHub Contributions Heatmap
- Fetch contribution activity using:
    GET /users/{username}/events?per_page=100 (paginate up to 300 events)
  OR via GraphQL:
    query { user(login: $username) {
      contributionsCollection { contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount color } }
      }}
    }}
- Render a 52-week × 7-day contribution matrix (like github.com profile graph)
- Color cells using a 5-level intensity scale:
    Level 0 → --color-surface-offset (empty/gray)
    Level 1 → low intensity green
    Level 2 → medium-low green
    Level 3 → medium-high green
    Level 4 → high intensity green (most active)
- Show tooltip on hover: date + contribution count
- Display total contributions summary above the heatmap

### 3. API Route Structure
All GitHub data must be fetched through these organized API routes:

  /api/github/user/{username}
    → GET /users/{username}
    → Returns: avatar, name, bio, followers, following, public_repos, location

  /api/github/repos/{username}
    → GET /users/{username}/repos?sort=pushed&per_page=100
    → GET /repos/{owner}/{repo}/languages  (per repo)
    → Returns: enriched repo list with language map + complexity_score

  /api/github/contributions/{username}
    → GraphQL contributionsCollection OR REST events API fallback
    → Returns: 52-week heatmap matrix (date, count, level 0-4)

  /api/github/repo/{owner}/{repo}
    → GET /repos/{owner}/{repo}
    → GET /repos/{owner}/{repo}/languages
    → GET /repos/{owner}/{repo}/contributors
    → Returns: full repo detail with language breakdown + top contributors

---

## AUTHENTICATION & RATE LIMITING
- Accept a GitHub Personal Access Token (PAT) via:
    Authorization: Bearer {GITHUB_TOKEN}
- Implement request caching with TTL:
    - User profile: 10 minutes
    - Repos list: 5 minutes
    - Contributions: 30 minutes
- Handle rate limit headers:
    X-RateLimit-Remaining, X-RateLimit-Reset
- Show a rate limit indicator in the UI
- Gracefully degrade: if unauthenticated, use public API (60 req/hr limit)

---

## COMPLEXITY SCORE ALGORITHM
Normalize each metric before scoring (0–1 range per metric):

  language_count = Object.keys(repo.languages).length

  normalized_size     = Math.min(repo.size / 100000, 1)         // cap at 100MB
  normalized_stars    = Math.min(repo.stargazers_count / 1000, 1) // cap at 1K
  normalized_forks    = Math.min(repo.forks_count / 500, 1)      // cap at 500
  normalized_issues   = Math.min(repo.open_issues_count / 200, 1) // cap at 200
  normalized_langs    = Math.min(language_count / 10, 1)          // cap at 10 langs

  complexity_score = (
    normalized_size  * 0.30 +
    normalized_stars * 0.25 +
    normalized_forks * 0.20 +
    normalized_issues* 0.15 +
    normalized_langs * 0.10
  ) * 100  // scale to 0–100

Assign a complexity tier:
  80–100 → "Expert"    (deep red badge)
  60–79  → "Advanced"  (orange badge)
  40–59  → "Moderate"  (yellow badge)
  20–39  → "Standard"  (blue badge)
  0–19   → "Starter"   (gray badge)

---

## UI / UX REQUIREMENTS
- Dark/light mode toggle (default: system preference)
- Layout: sidebar with username input + token field + nav links
- Main area: 3 panels —
    1. Profile card (avatar, stats, bio)
    2. Contributions Heatmap (52×7 grid, full-width)
    3. Complex Repos table (sortable by complexity, stars, size, forks)
- Each repo row expandable to show language bar chart (breakdown by bytes)
- Use tabular-nums for all numeric data
- Skeleton loaders while fetching
- Error state with retry button if API fails
- Show "Last fetched: X minutes ago" freshness indicator

---

## TECH STACK GUIDANCE
- Framework: Next.js (App Router) OR Express.js for API routes
- Fetching: native fetch() with async/await + AbortController for timeouts
- State: React Context or Zustand for cached API responses
- Charts: Chart.js or Recharts for language bar charts
- Heatmap: Build from scratch with CSS Grid (no external library)
- Styling: Tailwind CSS v4 with CSS custom properties for design tokens
- TypeScript: Strict mode, fully typed GitHub API responses

---

## GITHUB API RESPONSE TYPES (TypeScript)
interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  size: number;              // KB
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  pushed_at: string;         // ISO 8601
  html_url: string;
  languages?: Record<string, number>; // injected after /languages fetch
  complexity_score?: number;          // computed client-side
  complexity_tier?: string;           // computed client-side
}

interface HeatmapDay {
  date: string;              // YYYY-MM-DD
  count: number;             // contribution count
  level: 0 | 1 | 2 | 3 | 4; // intensity level
}

interface ContributionMatrix {
  totalContributions: number;
  weeks: { days: HeatmapDay[] }[];
}

---

## CONSTRAINTS & EDGE CASES
- Handle users with 0 repos (empty state with illustration)
- Handle private repos (show as "Private Repository" without detail)
- Handle repos with no language detected (show "Unknown")
- Paginate repos if user has > 100 (use ?page=2, ?page=3, etc.)
- For the heatmap, if GraphQL is unavailable, fall back to parsing REST
  /users/{username}/events and bucketing push events by date
- Never expose the PAT in client-side code — proxy all API calls through
  your own /api/github/* routes
- Respect CORS: all GitHub API calls must come from the server side

---

## OUTPUT EXPECTED FROM YOU
1. Complete API route handlers for all 4 routes above
2. GitHub contributions heatmap component (CSS Grid, no lib dependency)
3. Repos complexity table with sorting, tier badges, expandable language bars
4. Profile card component
5. Full TypeScript types for all GitHub API responses
6. Rate limit handler utility
7. In-memory cache utility with TTL
8. README section documenting the complexity score algorithm