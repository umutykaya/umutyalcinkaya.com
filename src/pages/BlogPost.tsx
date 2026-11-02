import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SitePageLayout from "@/components/SitePageLayout";
import { blogMdxComponents } from "@/components/blog/mdx-component-map";
import { getBlogPosts, loadPostBody } from "@/lib/blog-posts";
import type { BlogMdxModule } from "@/types/blog";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

interface BlogPostProps {
  initialModule?: BlogMdxModule["default"];
}

const BlogPost = ({ initialModule }: BlogPostProps) => {
  const { slug = "" } = useParams();
  const post = getBlogPosts().find((item) => item.slug === slug);
  const postSlug = post?.slug;
  const [module, setModule] = useState<BlogMdxModule["default"] | null>(() => initialModule ?? null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useDocumentMeta({
    title: post ? `${post.title} | Umut Yalcinkaya` : "Post not found | Umut Yalcinkaya",
    description: post?.summary ?? "This blog post could not be found.",
    canonicalPath: `/blog/${slug}`,
    type: "article",
  });

  useEffect(() => {
    let active = true;
    if (!initialModule) setModule(null);
    setLoadError(null);
    if (!postSlug || initialModule) return;

    const loader = loadPostBody(postSlug);
    if (!loader) {
      setLoadError("The post content could not be found.");
      return;
    }
    loader
      .then((loadedModule) => {
        if (active) setModule(() => loadedModule);
      })
      .catch((error: unknown) => {
        console.error(`Could not load blog post "${postSlug}":`, error);
        if (active) setLoadError("The post content could not be loaded. Please try again later.");
      });
    return () => {
      active = false;
    };
  }, [initialModule, postSlug]);

  const PostContent = module;
  const jsonLd = post
    ? JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.summary,
        datePublished: post.date,
        inLanguage: post.lang ?? "en",
        keywords: post.tags.join(", "),
        mainEntityOfPage: `https://umutyalcinkaya.com/blog/${post.slug}`,
        author: {
          "@type": "Person",
          name: "Umut Yalcinkaya",
          url: "https://umutyalcinkaya.com",
        },
        publisher: {
          "@type": "Person",
          name: "Umut Yalcinkaya",
        },
      }).replace(/</g, "\\u003c")
    : "";

  if (!post) {
    return (
      <SitePageLayout readingMode>
        <section className="mx-auto max-w-3xl px-6 pb-24 pt-32 sm:px-8">
          <p className="mb-3 font-mono text-sm text-accent">404</p>
          <h1 className="mb-4 font-serif text-4xl font-normal text-neutral-900 dark:text-neutral-100">Post not found</h1>
          <p className="mb-8 text-neutral-600 dark:text-neutral-300">The post you are looking for does not exist.</p>
          <Link to="/blog" className="text-accent underline underline-offset-4 hover:text-accent/80">
            Back to blog
          </Link>
        </section>
      </SitePageLayout>
    );
  }

  return (
    <SitePageLayout readingMode>
      <article className="blog-article prose prose-neutral dark:prose-invert mx-auto max-w-[680px] px-6 pb-24 pt-32 sm:px-8">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        <p className="not-prose mb-6">
          <Link
            to="/blog"
            className="text-sm text-accent underline underline-offset-4 hover:text-accent/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            ← Back to blog
          </Link>
        </p>
        <header className="not-prose mb-8 border-b border-neutral-200 pb-7 dark:border-neutral-700">
          <h1 className="mb-5 font-serif text-4xl font-normal leading-tight tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-[2.75rem]">
            {post.title}
          </h1>
          <div className="mb-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-neutral-500 dark:text-neutral-400">
            <time dateTime={post.date}>
              {new Intl.DateTimeFormat(post.lang ?? "en", {
                dateStyle: "long",
                timeZone: "UTC",
              }).format(new Date(`${post.date}T00:00:00.000Z`))}
            </time>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime} min read</span>
          </div>
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
        </header>
        <p className="not-prose mb-8 font-serif text-xl leading-relaxed text-neutral-700 dark:text-neutral-300">
          {post.summary}
        </p>
        {loadError ? (
          <p role="alert" className="rounded-lg border border-red-300 bg-red-50 p-4 font-sans text-base text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100">
            {loadError}
          </p>
        ) : PostContent ? (
          <PostContent components={blogMdxComponents} />
        ) : (
          <p role="status" className="font-sans text-base text-neutral-600 dark:text-neutral-300">Loading post…</p>
        )}
      </article>
    </SitePageLayout>
  );
};

export default BlogPost;
