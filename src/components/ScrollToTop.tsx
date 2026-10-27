import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Resets window scroll to the top whenever the pathname changes.
 * If the URL has a hash (e.g. /#work), scrolls that section into view instead,
 * since client-side navigation (incl. the /contact -> /#contact redirect) skips the
 * browser's native anchor scroll.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Wait a frame so the target section has mounted
      const id = requestAnimationFrame(() =>
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" }),
      );
      return () => cancelAnimationFrame(id);
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
