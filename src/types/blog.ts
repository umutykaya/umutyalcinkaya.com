import type { ComponentType, ReactNode } from "react";

export interface BlogFrontmatter {
  title: string;
  date: string;
  summary: string;
  tags: string[];
  draft?: boolean;
  lang?: string;
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
