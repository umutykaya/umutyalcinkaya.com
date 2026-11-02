import { blogMdxComponents } from "./mdx-component-map";

export function useMDXComponents(components: Record<string, unknown> = {}) {
  return { ...blogMdxComponents, ...components };
}
