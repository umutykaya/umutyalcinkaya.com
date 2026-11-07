import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import BlogThumbnail from "@/components/blog/BlogThumbnail";
import { hashHue, thumbnailGradient } from "@/lib/blog-thumbnail";
import { parsePost } from "@/lib/blog";

describe("blog thumbnails", () => {
  it("generates a stable gradient per slug", () => {
    expect(hashHue("a")).toBe(hashHue("a"));
    expect(thumbnailGradient("a")).toEqual(thumbnailGradient("a"));
    expect(thumbnailGradient("hello-world")).not.toEqual(thumbnailGradient("terraform-basics"));
  });

  it("renders a generated thumbnail when no image is set", () => {
    render(<BlogThumbnail post={{ slug: "x", title: "Xylo", tags: ["azure"] }} />);
    const el = screen.getByTestId("blog-thumbnail");
    expect(el.tagName).toBe("DIV");
    expect(el.textContent).toContain("azure");
  });

  it("renders the image when provided", () => {
    render(<BlogThumbnail post={{ slug: "x", title: "X", tags: [], image: "/img.png" }} />);
    expect(screen.getByTestId("blog-thumbnail").getAttribute("src")).toBe("/img.png");
  });

  it("parses optional image frontmatter", () => {
    const src = `---\ntitle: "T"\ndate: "2026-01-01"\nsummary: "S"\ntags:\n  - a\nimage: "/x.png"\n---\n\nBody\n`;
    expect(parsePost("t", src).image).toBe("/x.png");
  });
});
