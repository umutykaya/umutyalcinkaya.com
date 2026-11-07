import type { BlogFrontmatter, BlogPost } from "@/types/blog";
import { computeReadingTime } from "./reading-time";

const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

function parseScalar(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function isValidPostDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function parsePost(slug: string, source: string): BlogPost {
  const match = FRONTMATTER_PATTERN.exec(source);
  if (!match) {
    throw new Error(`Post "${slug}" must start with YAML frontmatter.`);
  }

  const values: Record<string, string | string[]> = {};
  let readingTags = false;
  for (const line of match[1].split(/\r?\n/)) {
    const tagItem = /^\s+-\s+(.+)$/.exec(line);
    if (readingTags && tagItem) {
      (values.tags as string[]).push(parseScalar(tagItem[1]));
      continue;
    }

    const field = /^([a-zA-Z][\w-]*):(?:\s*(.*))?$/.exec(line);
    if (!field) {
      readingTags = false;
      continue;
    }

    const [, name, rawValue = ""] = field;
    readingTags = name === "tags" && rawValue.trim() === "";
    if (readingTags) {
      values.tags = [];
    } else if (name === "tags" && rawValue.trim().startsWith("[")) {
      const inlineTags = rawValue.trim();
      if (!inlineTags.endsWith("]")) {
        throw new Error(`Post "${slug}" has an invalid tags list.`);
      }
      values.tags = inlineTags
        .slice(1, -1)
        .split(",")
        .map(parseScalar)
        .filter(Boolean);
    } else {
      values[name] = parseScalar(rawValue);
    }
  }

  const title = values.title;
  const date = values.date;
  const summary = values.summary;
  const tags = values.tags;
  if (typeof title !== "string" || !title) {
    throw new Error(`Post "${slug}" is missing a title.`);
  }
  if (!isValidPostDate(date)) {
    throw new Error(`Post "${slug}" must have a valid date in YYYY-MM-DD format.`);
  }
  if (typeof summary !== "string" || !summary) {
    throw new Error(`Post "${slug}" is missing a summary.`);
  }
  if (!Array.isArray(tags) || tags.some((tag) => typeof tag !== "string")) {
    throw new Error(`Post "${slug}" must have a tags array.`);
  }

  const draftValue = values.draft;
  if (draftValue !== undefined && draftValue !== "true" && draftValue !== "false") {
    throw new Error(`Post "${slug}" has an invalid draft value.`);
  }

  const frontmatter: BlogFrontmatter = {
    title,
    date,
    summary,
    tags,
    ...(draftValue === "true" ? { draft: true } : {}),
    ...(typeof values.image === "string" && values.image ? { image: values.image } : {}),
    lang: typeof values.lang === "string" ? values.lang : "en",
  };

  return {
    ...frontmatter,
    slug,
    readingTime: computeReadingTime(source.slice(match[0].length)),
  };
}

export function filterAndSortPosts(
  posts: BlogPost[],
  options: { production?: boolean; tag?: string } = {},
): BlogPost[] {
  const { production = false, tag } = options;
  return posts
    .filter((post) => !production || !post.draft)
    .filter((post) => !tag || post.tags.includes(tag))
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}
