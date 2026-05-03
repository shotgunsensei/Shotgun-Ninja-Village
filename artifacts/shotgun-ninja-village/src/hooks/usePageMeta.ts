import { useEffect } from "react";

interface PageMeta {
  title: string;
  description?: string;
}

const SITE_NAME = "Shotgun Ninja Village";
const DEFAULT_DESCRIPTION =
  "The tactical command hub of the Shotgun Ninjas universe. Watch transmissions, access operator intel, explore recovered systems, and join the village.";

function setMeta(name: string, content: string, attr: "name" | "property" = "name") {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function usePageMeta({ title, description }: PageMeta) {
  useEffect(() => {
    const fullTitle = title === SITE_NAME ? title : `${title} — ${SITE_NAME}`;
    const desc = description ?? DEFAULT_DESCRIPTION;
    const previousTitle = document.title;
    document.title = fullTitle;
    setMeta("description", desc);
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", desc, "property");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", desc);
    return () => {
      document.title = previousTitle;
    };
  }, [title, description]);
}
