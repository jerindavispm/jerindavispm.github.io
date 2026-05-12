import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { fetchAllContent } from "./content";
import * as fallback from "./data";

const CACHE_KEY = "jd-portfolio:content:v1";
const FALLBACK_CONTENT = {
  profile:        fallback.profile,
  nav:            fallback.nav,
  experience:     fallback.experience,
  projects:       fallback.projects,
  skills:         fallback.skills,
  education:      fallback.education,
  certifications: fallback.certifications.map((c) => ({
    name: c.name,
    date: c.date,
    isOngoing: c.date === "Ongoing",
  })),
  languages:      fallback.languages,
  heroMeta:       fallback.heroMeta,
  marqueeWords:   fallback.marqueeWords,
};

const ContentContext = createContext(null);

function readCache() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeCache(content) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(content));
  } catch {
    /* quota exceeded — ignore */
  }
}

export function ContentProvider({ children }) {
  // Boot order: cache → fallback (so first paint is always instant)
  const [content, setContent] = useState(() => readCache() || FALLBACK_CONTENT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fresh = await fetchAllContent();
      setContent(fresh);
      writeCache(fresh);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ ...content, loading, error, refresh }),
    [content, loading, error, refresh]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error("useContent must be used inside <ContentProvider>");
  }
  return ctx;
}
