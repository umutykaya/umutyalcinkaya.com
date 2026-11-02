import { describe, expect, it } from "vitest";
import { filterAndSortPosts, parsePost } from "@/lib/blog";
import { computeReadingTime } from "@/lib/reading-time";

const draftSource = `---
title: "Draft post"
date: "2026-10-20"
summary: "An unpublished post."
tags:
  - testing
draft: true
---

A short draft body.
`;

const publishedSource = `---
title: "Published post"
date: "2026-10-30"
summary: "A published post."
tags:
  - testing
  - markdown
lang: tr
---

A short published body.
`;

describe("blog post metadata", () => {
  it("parses required frontmatter and uses the default language", () => {
    const post = parsePost("draft-post", draftSource);

    expect(post).toMatchObject({
      slug: "draft-post",
      title: "Draft post",
      date: "2026-10-20",
      summary: "An unpublished post.",
      tags: ["testing"],
      draft: true,
      lang: "en",
      readingTime: 1,
    });
  });

  it("parses an explicit language and rejects invalid dates", () => {
    expect(parsePost("published-post", publishedSource).lang).toBe("tr");
    expect(() =>
      parsePost("invalid-date", publishedSource.replace("2026-10-30", "2026-02-30")),
    ).toThrow(/YYYY-MM-DD/);
  });

  it("sorts newest first, filters tags, and hides drafts only in production", () => {
    const posts = [
      parsePost("draft-post", draftSource),
      parsePost("published-post", publishedSource),
    ];

    expect(filterAndSortPosts(posts).map((post) => post.slug)).toEqual([
      "published-post",
      "draft-post",
    ]);
    expect(filterAndSortPosts(posts, { tag: "markdown" }).map((post) => post.slug)).toEqual([
      "published-post",
    ]);
    expect(filterAndSortPosts(posts, { production: true }).map((post) => post.slug)).toEqual([
      "published-post",
    ]);
  });

  it("rounds reading time up at 200 words per minute", () => {
    expect(computeReadingTime("word ".repeat(200))).toBe(1);
    expect(computeReadingTime("word ".repeat(201))).toBe(2);
    expect(computeReadingTime("")).toBe(1);
  });
});
