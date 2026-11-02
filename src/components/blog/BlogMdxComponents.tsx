import {
  useState,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type ImgHTMLAttributes,
  type ReactNode,
  isValidElement,
} from "react";
import type { CalloutProps } from "@/types/blog";

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

function StyledLink({ href = "", children, ...props }: LinkProps) {
  const external = /^https?:\/\//i.test(href);
  return (
    <a
      href={href}
      {...props}
      className={`text-accent underline underline-offset-4 hover:text-accent/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${props.className ?? ""}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

function LazyImage(props: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      {...props}
      alt={props.alt ?? ""}
      loading="lazy"
      decoding="async"
      className={`rounded-xl border border-border/50 ${props.className ?? ""}`}
    />
  );
}

function textContent(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textContent).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return textContent(node.props.children);
  }
  return "";
}

function CodeBlock({ children, ...props }: { children?: ReactNode } & HTMLAttributes<HTMLPreElement>) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(textContent(children));
      setCopied(true);
      setCopyError(false);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error("Could not copy code block:", error);
      setCopied(false);
      setCopyError(true);
    }
  }

  return (
    <div className="group relative my-6 overflow-hidden rounded-xl border border-border/70 bg-secondary/60">
      <button
        type="button"
        onClick={copyCode}
        className="absolute right-3 top-3 z-10 rounded-md border border-border bg-background/90 px-2.5 py-1 text-xs text-muted-foreground opacity-100 transition hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
        aria-label={copied ? "Code copied" : copyError ? "Code copy failed" : "Copy code"}
        aria-live="polite"
      >
        {copied ? "Copied" : copyError ? "Copy failed" : "Copy"}
      </button>
      <pre {...props} className="!m-0 overflow-x-auto bg-transparent p-5 text-sm">
        {children}
      </pre>
    </div>
  );
}

const calloutStyles = {
  note: "border-accent/60 bg-accent/5",
  tip: "border-emerald-500/60 bg-emerald-500/5",
  warning: "border-amber-500/60 bg-amber-500/5",
} as const;

export function Callout({ type = "note", title, children }: CalloutProps) {
  return (
    <aside
      role="note"
      aria-label={title ?? `${type} callout`}
      className={`my-6 rounded-r-xl border-l-4 p-4 ${calloutStyles[type]}`}
    >
      {title && <p className="mb-1 font-semibold text-foreground">{title}</p>}
      <div className="text-base text-muted-foreground">{children}</div>
    </aside>
  );
}

export { StyledLink, LazyImage, CodeBlock };
