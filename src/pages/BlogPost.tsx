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
      <SitePageLayout>
        <section className="container mx-auto max-w-3xl px-6 pb-24 pt-32">
          <p className="mb-3 font-mono text-sm text-accent">404</p>
          <h1 className="mb-4 text-3xl font-bold text-foreground">Post not found</h1>
          <p className="mb-8 text-muted-foreground">The post you are looking for does not exist.</p>
          <Link to="/blog" className="text-accent underline underline-offset-4 hover:text-accent/80">
            Back to blog
          </Link>
        </section>
      </SitePageLayout>
    );
  }

  return (
    <SitePageLayout>
      <article className="prose prose-neutral dark:prose-invert max-w-none container mx-auto px-6 pb-24 pt-32">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        <p className="not-prose mb-6">
          <Link
            to="/blog"
            className="text-sm text-accent underline underline-offset-4 hover:text-accent/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            ← Back to blog
          </Link>
        </p>
        <header className="not-prose mb-10 border-b border-border/50 pb-8">
          <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
            {post.title}
          </h1>
          <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
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
                  className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {tag}
                </Link>
              </li>
            ))}
          </ul>
        </header>
        <p className="not-prose mb-8 text-xl leading-relaxed text-muted-foreground">{post.summary}</p>
        {loadError ? (
          <p role="alert" className="rounded-xl border border-destructive/50 bg-destructive/5 p-4 text-destructive">
            {loadError}
          </p>
        ) : PostContent ? (
          <PostContent components={blogMdxComponents} />
        ) : (
          <p role="status">Loading post…</p>
        )}
      </article>
    </SitePageLayout>
  );
};

export default BlogPost;
