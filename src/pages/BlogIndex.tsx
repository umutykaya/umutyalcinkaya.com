import { Link, useSearchParams } from "react-router-dom";
import SitePageLayout from "@/components/SitePageLayout";
import { getBlogPosts } from "@/lib/blog-posts";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

const BlogIndex = () => {
  const [searchParams] = useSearchParams();
  const selectedTag = searchParams.get("tag") ?? undefined;
  const posts = getBlogPosts({ tag: selectedTag });
  const allTags = [...new Set(getBlogPosts().flatMap((post) => post.tags))].sort();

  useDocumentMeta({
    title: "Blog | Umut Yalcinkaya",
    description: "Notes on projects, technology, and ideas worth exploring.",
    canonicalPath: "/blog",
  });

  return (
    <SitePageLayout>
      <section className="container mx-auto max-w-4xl px-6 pb-24 pt-32">
        <header className="mb-10">
          <p className="mb-3 font-mono text-sm text-accent">// writing</p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Blog
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Notes on projects, technology, and ideas worth exploring.
          </p>
        </header>

        {allTags.length > 0 && (
          <nav aria-label="Filter posts by tag" className="mb-10 flex flex-wrap gap-2">
            <Link
              to="/blog"
              aria-current={selectedTag ? undefined : "page"}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                selectedTag
                  ? "border-border text-muted-foreground hover:text-foreground"
                  : "border-accent/60 bg-accent/10 text-accent"
              }`}
            >
              All posts
            </Link>
            {allTags.map((tag) => (
              <Link
                key={tag}
                to={`/blog?tag=${encodeURIComponent(tag)}`}
                aria-current={selectedTag === tag ? "page" : undefined}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                  selectedTag === tag
                    ? "border-accent/60 bg-accent/10 text-accent"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {tag}
              </Link>
            ))}
          </nav>
        )}

        {posts.length > 0 ? (
          <ul className="space-y-5">
            {posts.map((post) => (
              <li key={post.slug}>
                <article className="rounded-2xl border border-border/50 bg-card/60 p-6 transition-colors hover:border-accent/30 sm:p-8">
                  <header>
                    <h2 className="mb-2 text-2xl font-semibold leading-snug text-foreground">
                      <Link
                        to={`/blog/${post.slug}`}
                        className="rounded-sm hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                      <time dateTime={post.date}>
                        {new Intl.DateTimeFormat(post.lang ?? "en", {
                          dateStyle: "long",
                          timeZone: "UTC",
                        }).format(new Date(`${post.date}T00:00:00.000Z`))}
                      </time>
                      <span aria-hidden="true">·</span>
                      <span>{post.readingTime} min read</span>
                    </div>
                  </header>
                  <p className="mb-5 leading-relaxed text-muted-foreground">{post.summary}</p>
                  <ul aria-label="Post tags" className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <li key={tag}>
                        <Link
                          to={`/blog?tag=${encodeURIComponent(tag)}`}
                          className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground hover:bg-accent/15 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                        >
                          {tag}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </article>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-xl border border-border/50 bg-card/60 p-6 text-muted-foreground">
            No posts found{selectedTag ? ` tagged “${selectedTag}”` : ""}.
          </p>
        )}
      </section>
    </SitePageLayout>
  );
};

export default BlogIndex;
