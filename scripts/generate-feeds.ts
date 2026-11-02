import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { filterAndSortPosts, parsePost } from "../src/lib/blog";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const contentDirectory = resolve(root, "src/content/posts");
const production = process.argv.includes("--production");
const allPosts = (
  await Promise.all(
    (await readdir(contentDirectory))
      .filter((file) => file.endsWith(".mdx"))
      .sort()
      .map(async (file) => {
        const slug = file.slice(0, -".mdx".length);
        const source = await readFile(resolve(contentDirectory, file), "utf8");
        return parsePost(slug, source);
      }),
  )
).sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
const posts = filterAndSortPosts(allPosts, { production });
const publishedPosts = filterAndSortPosts(allPosts, { production: true });

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const latestDate = publishedPosts[0]?.date ?? new Date().toISOString().slice(0, 10);
const postIndexPath = resolve(root, "src/content/post-index.json");
const rssPath = resolve(root, "public/rss.xml");
const sitemapPath = resolve(root, "public/sitemap.xml");

await writeFile(postIndexPath, `${JSON.stringify(posts, null, 2)}\n`);

const rssItems = publishedPosts
  .map((post) => {
    const url = `https://umutyalcinkaya.com/blog/${post.slug}`;
    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(`${post.date}T00:00:00.000Z`).toUTCString()}</pubDate>
      <description>${escapeXml(post.summary)}</description>
      ${post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n      ")}
    </item>`;
  })
  .join("\n");

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Umut Yalcinkaya Blog</title>
    <link>https://umutyalcinkaya.com/blog</link>
    <description>Notes on projects, technology, and ideas worth exploring.</description>
    <language>en</language>
    <lastBuildDate>${new Date(`${latestDate}T00:00:00.000Z`).toUTCString()}</lastBuildDate>
${rssItems}
  </channel>
</rss>
`;
await writeFile(rssPath, rss);

const staticPages = ["", "about", "contact", "github", "privacy", "resume", "blog"];
const sitemapUrls = [
  ...staticPages.map((path) => ({
    url: `https://umutyalcinkaya.com/${path}`,
    lastmod: latestDate,
  })),
  ...publishedPosts.map((post) => ({
    url: `https://umutyalcinkaya.com/blog/${post.slug}`,
    lastmod: post.date,
  })),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls
  .map(
    ({ url, lastmod }) =>
      `  <url><loc>${escapeXml(url)}</loc><lastmod>${lastmod}</lastmod></url>`,
  )
  .join("\n")}
</urlset>
`;
await writeFile(sitemapPath, sitemap);

console.log(
  `Generated post index (${posts.length} posts), RSS (${publishedPosts.length} published), and sitemap.`,
);
