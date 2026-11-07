import { Link, useSearchParams } from "react-router-dom";
import SitePageLayout from "@/components/SitePageLayout";
import { getBlogPosts } from "@/lib/blog-posts";
import BlogThumbnail from "@/components/blog/BlogThumbnail";
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
    <SitePageLayout readingMode>
      <section className="mx-auto max-w-3xl px-6 pb-24 pt-32 sm:px-8">
        <header className="mb-10 border-b border-neutral-200 pb-8 dark:border-neutral-700">
          <p className="mb-3 text-sm font-medium tracking-wide text-neutral-500 dark:text-neutral-400">
            UMUT YALCINKAYA
          </p>
          <h1 className="mb-3 font-serif text-5xl font-normal tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-6xl">
            Stories
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">
            Notes on projects, technology, and ideas worth exploring.
          </p>
        </header>

        {allTags.length > 0 && (
          <nav
            aria-label="Filter posts by tag"
            className="mb-8 flex flex-wrap gap-2 border-b border-neutral-200 pb-6 dark:border-neutral-700"
          >
            <Link
              to="/blog"
              aria-current={selectedTag ? undefined : "page"}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                selectedTag
                  ? "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                  : "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
              }`}
            >
              All posts
            </Link>
            {allTags.map((tag) => (
              <Link
                key={tag}
                to={`/blog?tag=${encodeURIComponent(tag)}`}
                aria-current={selectedTag === tag ? "page" : undefined}
                className={`rounded-full px-3 py-1.5 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                  selectedTag === tag
                    ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                }`}
              >
                {tag}
              </Link>
            ))}
          </nav>
        )}

        {posts.length > 0 ? (
          <ul>
            {posts.map((post) => (
              <li key={post.slug} className="border-b border-neutral-200 py-7 first:pt-2 dark:border-neutral-700">
                <article className="flex flex-col gap-5 sm:flex-row sm:items-start">
                  <Link
                    to={`/blog/${post.slug}`}
                    tabIndex={-1}
                    aria-hidden="true"
                    className="block w-full shrink-0 sm:w-48"
                  >
                    <BlogThumbnail post={post} className="aspect-[16/9] w-full rounded-lg" />
                  </Link>
                  <div className="min-w-0 flex-1">
                  <header>
                    <h2 className="mb-2 font-serif text-2xl font-semibold leading-snug text-neutral-900 dark:text-neutral-100 sm:text-[1.7rem]">
                      <Link
                        to={`/blog/${post.slug}`}
                        className="rounded-sm hover:text-neutral-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring dark:hover:text-neutral-300"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-neutral-500 dark:text-neutral-400">
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
                  <p className="mb-4 max-w-2xl text-base leading-7 text-neutral-700 dark:text-neutral-300">
                    {post.summary}
                  </p>
                  <ul aria-label="Post tags" className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <li key={tag}>
                        <Link
                          to={`/blog?tag=${encodeURIComponent(tag)}`}
                          className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-700 transition-colors hover:bg-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                        >
                          {tag}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-8 text-neutral-600 dark:text-neutral-300">
            No posts found{selectedTag ? ` tagged “${selectedTag}”` : ""}.
          </p>
        )}
      </section>
    </SitePageLayout>
  );
};

export default BlogIndex;
