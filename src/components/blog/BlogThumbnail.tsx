import { thumbnailGradient } from "@/lib/blog-thumbnail";
import type { BlogPost } from "@/types/blog";

interface BlogThumbnailProps {
  post: Pick<BlogPost, "slug" | "title" | "tags" | "image">;
  className?: string;
}

const BlogThumbnail = ({ post, className = "" }: BlogThumbnailProps) => {
  if (post.image) {
    return (
      <img
        src={post.image}
        alt=""
        loading="lazy"
        data-testid="blog-thumbnail"
        className={`object-cover ${className}`}
      />
    );
  }

  const { from, to } = thumbnailGradient(post.slug);
  return (
    <div
      data-testid="blog-thumbnail"
      aria-hidden="true"
      style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
      className={`relative flex items-end overflow-hidden p-4 ${className}`}
    >
      <span className="absolute -right-2 -top-6 select-none font-serif text-8xl font-bold leading-none text-white/15">
        {post.title.charAt(0).toUpperCase()}
      </span>
      {post.tags[0] && (
        <span className="relative rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium text-white">
          {post.tags[0]}
        </span>
      )}
    </div>
  );
};

export default BlogThumbnail;
