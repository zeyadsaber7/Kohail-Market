import { useEffect } from "react";

/**
 * useSEO
 * -----------------------------------------------------------------------
 * Lightweight, dependency-free per-page SEO: updates document.title and
 * the meta[name=description] tag whenever a page mounts.
 * (index.html already ships with the default/global tags + Open Graph +
 * favicons for the very first paint / social-share preview.)
 * -----------------------------------------------------------------------
 */
export function useSEO({ title, description }) {
  useEffect(() => {
    if (title) document.title = title;
    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", "description");
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", description);
    }
  }, [title, description]);
}
