import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createElement, type ComponentType, type ReactNode } from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { createServer } from "vite";
import type { BlogMdxModule, BlogPost } from "../src/types/blog";

const root = process.cwd();
const outputDirectory = resolve(root, "dist");
const siteUrl = "https://umutyalcinkaya.com";
const posts = JSON.parse(
  await readFile(resolve(root, "src/content/post-index.json"), "utf8"),
) as BlogPost[];

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function metadata(title: string, description: string, path: string, type: string): string {
  const url = `${siteUrl}${path}`;
  const image = `${siteUrl}/og-image-v2.png`;
  return [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:url" content="${escapeHtml(url)}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
  ].join("\n    ");
}

function replaceHeadMetadata(
  template: string,
  title: string,
  description: string,
  path: string,
  type: string,
): string {
  const tags = metadata(title, description, path, type);
  const replaceOrInsert = (pattern: RegExp, replacement: string, html: string) =>
    pattern.test(html) ? html.replace(pattern, replacement) : html.replace("</head>", `${replacement}\n  </head>`);

  let html = replaceOrInsert(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`, template);
  const headTags = tags
    .split("\n    ")
    .filter((tag) => !tag.startsWith("<title>"))
    .map((tag) => {
      if (tag.startsWith('<meta name="description"')) {
        return { pattern: /<meta\s+name="description"[\s\S]*?\/>/, tag };
      }
      if (tag.startsWith('<meta property="og:type"')) {
        return { pattern: /<meta\s+property="og:type"[^>]*\/>/, tag };
      }
      if (tag.startsWith('<meta property="og:title"')) {
        return { pattern: /<meta\s+property="og:title"[^>]*\/>/, tag };
      }
      if (tag.startsWith('<meta property="og:description"')) {
        return { pattern: /<meta\s+property="og:description"[\s\S]*?\/>/, tag };
      }
      if (tag.startsWith('<meta property="og:url"')) {
        return { pattern: /<meta\s+property="og:url"[^>]*\/>/, tag };
      }
      if (tag.startsWith('<meta property="og:image"')) {
        return { pattern: /<meta\s+property="og:image"[\s\S]*?\/>/, tag };
      }
      if (tag.startsWith('<meta name="twitter:card"')) {
        return { pattern: /<meta\s+name="twitter:card"[^>]*\/>/, tag };
      }
      if (tag.startsWith('<meta name="twitter:title"')) {
        return { pattern: /<meta\s+name="twitter:title"[^>]*\/>/, tag };
      }
      if (tag.startsWith('<meta name="twitter:description"')) {
        return { pattern: /<meta\s+name="twitter:description"[\s\S]*?\/>/, tag };
      }
      if (tag.startsWith('<meta name="twitter:image"')) {
        return { pattern: /<meta\s+name="twitter:image"[\s\S]*?\/>/, tag };
      }
      return { pattern: /<link\s+rel="canonical"[^>]*\/>/, tag };
    });

  for (const { pattern, tag } of headTags) {
    html = replaceOrInsert(pattern, tag, html);
  }
  return html;
}

const server = await createServer({
  configFile: resolve(root, "vite.config.ts"),
  mode: "production",
  appType: "custom",
  server: { middlewareMode: true, hmr: false },
});

try {
  await server.ssrLoadModule("/src/i18n/index.ts");
  const [indexModule, postModule, themeModule, authModule] = await Promise.all([
    server.ssrLoadModule("/src/pages/BlogIndex.tsx"),
    server.ssrLoadModule("/src/pages/BlogPost.tsx"),
    server.ssrLoadModule("/src/contexts/ThemeContext.tsx"),
    server.ssrLoadModule("/src/contexts/AuthContext.tsx"),
  ]);
  const BlogIndex = indexModule.default as ComponentType;
  const BlogPost = postModule.default as ComponentType<{
    initialModule?: BlogMdxModule["default"];
  }>;
  const ThemeProvider = themeModule.ThemeProvider as ComponentType<{ children: ReactNode }>;
  const AuthProvider = authModule.AuthProvider as ComponentType<{ children: ReactNode }>;
  const template = await readFile(resolve(outputDirectory, "index.html"), "utf8");

  async function renderPage(path: string, initialModule?: BlogMdxModule["default"]): Promise<string> {
    const app = createElement(
      MemoryRouter,
      { initialEntries: [path] },
      createElement(
        ThemeProvider,
        null,
        createElement(
          AuthProvider,
          null,
          createElement(
            Routes,
            null,
            createElement(Route, { path: "/blog", element: createElement(BlogIndex) }),
            createElement(
              Route,
              { path: "/blog/:slug", element: createElement(BlogPost, { initialModule }) },
            ),
          ),
        ),
      ),
    );
    const body = renderToString(app);
    return template.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
  }

  const blogIndexHtml = await renderPage("/blog");
  await mkdir(resolve(outputDirectory, "blog"), { recursive: true });
  await writeFile(
    resolve(outputDirectory, "blog/index.html"),
    replaceHeadMetadata(
      blogIndexHtml,
      "Blog | Umut Yalcinkaya",
      "Notes on projects, technology, and ideas worth exploring.",
      "/blog",
      "website",
    ),
  );

  for (const post of posts) {
    const mdxModule = await server.ssrLoadModule(`/src/content/posts/${post.slug}.mdx`);
    const postBody = mdxModule.default as BlogMdxModule["default"];
    const path = `/blog/${post.slug}`;
    const html = await renderPage(path, postBody);
    const postDirectory = resolve(outputDirectory, "blog", post.slug);
    await mkdir(postDirectory, { recursive: true });
    await writeFile(
      resolve(postDirectory, "index.html"),
      replaceHeadMetadata(
        html,
        `${post.title} | Umut Yalcinkaya`,
        post.summary,
        path,
        "article",
      ),
    );
  }
  console.log(`Prerendered /blog and ${posts.length} blog posts.`);
} finally {
  await server.close();
}
