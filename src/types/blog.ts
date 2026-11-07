import type { ComponentType, ReactNode } from "react";

export interface BlogFrontmatter {
  title: string;
  date: string;
  summary: string;
  tags: string[];
  draft?: boolean;
  lang?: string;
  /** Optional thumbnail image URL/path; a generated thumbnail is used when omitted. */
  image?: string;
}

export interface BlogPost extends BlogFrontmatter {
  slug: string;
  readingTime: number;
}

export interface BlogMdxModule {
  default: ComponentType<{ components?: Record<string, ComponentType> }>;
}

export interface CalloutProps {
  type?: "note" | "tip" | "warning";
  title?: string;
  children: ReactNode;
}
