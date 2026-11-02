import type { BlogMdxModule, BlogPost } from "@/types/blog";
import { filterAndSortPosts } from "@/lib/blog";
import postIndex from "@/content/post-index.json";
import { postBodies as productionPostBodies } from "@/content/post-bodies";

const developmentPostBodies = import.meta.glob<BlogMdxModule["default"]>("/src/content/posts/*.mdx", {
  import: "default",
});
const postBodies = import.meta.env.PROD ? productionPostBodies : developmentPostBodies;

export function getBlogPosts(options: { production?: boolean; tag?: string } = {}): BlogPost[] {
  return filterAndSortPosts(postIndex, {
    production: import.meta.env.PROD,
    ...options,
  });
}

export function loadPostBody(slug: string): Promise<BlogMdxModule["default"]> | undefined {
  return postBodies[`/src/content/posts/${slug}.mdx`]?.();
}
