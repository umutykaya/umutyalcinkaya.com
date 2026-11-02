import { defineConfig, type Plugin } from "vite";
import { existsSync } from "node:fs";
import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react-swc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import path from "path";

function previewCacheHeaders(): Plugin {
  return {
    name: "preview-cache-headers",
    configurePreviewServer(server) {
      server.middlewares.use((request, response, next) => {
        const [pathname, query] = (request.url ?? "/").split("?", 2);
        if (pathname === "/blog" || pathname.startsWith("/blog/")) {
          const outputDirectory = path.resolve(server.config.root, server.config.build.outDir);
          const blogDirectory = path.resolve(outputDirectory, "blog");
          const relativePath = pathname === "/blog" ? "" : pathname.slice("/blog/".length);
          const prerenderedPage = path.resolve(blogDirectory, relativePath, "index.html");
          if (
            (prerenderedPage === path.resolve(blogDirectory, "index.html") ||
              prerenderedPage.startsWith(`${blogDirectory}${path.sep}`)) &&
            existsSync(prerenderedPage)
          ) {
            request.url = `${pathname.replace(/\/+$/, "") || "/blog"}/index.html${query ? `?${query}` : ""}`;
          }
        }

        response.setHeader(
          "Cache-Control",
          pathname.startsWith("/assets/")
            ? "public, max-age=31536000, immutable"
            : "no-cache, max-age=0, must-revalidate",
        );
        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  preview: {
    port: 4173,
    strictPort: true,
    allowedHosts: ["umutyalcinkaya.com", "www.umutyalcinkaya.com"],
  },
  plugins: [
    mdx({
      providerImportSource: "@/components/blog/mdx-provider",
      remarkPlugins: [remarkFrontmatter, remarkGfm, remarkMdxFrontmatter],
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: "wrap" }],
        [
          rehypePrettyCode,
          {
            theme: { light: "github-light", dark: "github-dark" },
            keepBackground: false,
          },
        ],
      ],
    }),
    react(),
    previewCacheHeaders(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
