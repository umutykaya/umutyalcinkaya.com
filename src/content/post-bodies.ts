import type { BlogMdxModule } from "@/types/blog";

export const postBodies: Record<
  string,
  () => Promise<BlogMdxModule["default"]>
> = {
  "/src/content/posts/terraform-basics.mdx": () => import("./posts/terraform-basics.mdx").then((module) => module.default),
  "/src/content/posts/hello-world.mdx": () => import("./posts/hello-world.mdx").then((module) => module.default),
};
