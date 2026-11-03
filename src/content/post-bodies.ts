import type { BlogMdxModule } from "@/types/blog";

export const postBodies: Record<
  string,
  () => Promise<BlogMdxModule["default"]>
> = {
  "/src/content/posts/azure-landing-zones-with-terraform-and-avm.mdx": () => import("./posts/azure-landing-zones-with-terraform-and-avm.mdx").then((module) => module.default),
  "/src/content/posts/getting-started-with-terraform-on-azure.mdx": () => import("./posts/getting-started-with-terraform-on-azure.mdx").then((module) => module.default),
  "/src/content/posts/terraform-basics.mdx": () => import("./posts/terraform-basics.mdx").then((module) => module.default),
  "/src/content/posts/hello-world.mdx": () => import("./posts/hello-world.mdx").then((module) => module.default),
};
