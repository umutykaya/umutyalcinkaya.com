import { useEffect } from "react";

interface DocumentMetaOptions {
  title: string;
  description: string;
  canonicalPath: string;
  type?: "website" | "article";
}

const SITE_URL = "https://umutyalcinkaya.com";
const DEFAULT_IMAGE = `${SITE_URL}/og-image-v2.png`;

export function useDocumentMeta({
  title,
  description,
  canonicalPath,
  type = "website",
}: DocumentMetaOptions) {
  useEffect(() => {
    const url = new URL(canonicalPath, SITE_URL).toString();
    document.title = title;

    const values: Record<string, string> = {
      description,
      "og:type": type,
      "og:title": title,
      "og:description": description,
      "og:url": url,
      "og:image": DEFAULT_IMAGE,
      "twitter:card": "summary_large_image",
      "twitter:title": title,
      "twitter:description": description,
      "twitter:image": DEFAULT_IMAGE,
    };

    const selectors = Object.keys(values).map((key) =>
      key.startsWith("og:") || key.startsWith("twitter:")
        ? `meta[property="${key}"]`
        : `meta[name="${key}"]`,
    );
    const previousTitle = document.title;
    const previous = selectors.map((selector) => {
      const element = document.head.querySelector<HTMLMetaElement>(selector);
      return element ? { element, content: element.content } : null;
    });
    const previousCanonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const previousCanonicalHref = previousCanonical?.href;

    Object.entries(values).forEach(([key, value]) => {
      const property = key.startsWith("og:") || key.startsWith("twitter:");
      let element = document.head.querySelector<HTMLMetaElement>(
        property ? `meta[property="${key}"]` : `meta[name="${key}"]`,
      );
      if (!element) {
        element = document.createElement("meta");
        if (property) element.setAttribute("property", key);
        else element.name = key;
        document.head.appendChild(element);
      }
      element.content = value;
    });

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    return () => {
      selectors.forEach((selector, index) => {
        const element = document.head.querySelector<HTMLMetaElement>(selector);
        const original = previous[index];
        if (original) original.element.content = original.content;
        else element?.remove();
      });
      if (previousCanonical && previousCanonicalHref) previousCanonical.href = previousCanonicalHref;
      else canonical?.remove();
      document.title = previousTitle;
    };
  }, [canonicalPath, description, title, type]);
}
