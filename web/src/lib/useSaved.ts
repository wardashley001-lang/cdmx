import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode, createElement } from "react";

const KEY = "guia.saved";

function read(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function write(ids: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    // localStorage unavailable (private mode, etc.) — saved list just won't persist
  }
}

interface SavedContextValue {
  saved: string[];
  toggle: (id: string) => void;
  isSaved: (id: string) => boolean;
}

const SavedContext = createContext<SavedContextValue | null>(null);

export function SavedProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<string[]>(() => read());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setSaved(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggle = useCallback((id: string) => {
    setSaved((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      write(next);
      return next;
    });
  }, []);

  const isSaved = useCallback((id: string) => saved.includes(id), [saved]);

  const value = useMemo(() => ({ saved, toggle, isSaved }), [saved, toggle, isSaved]);

  return createElement(SavedContext.Provider, { value }, children);
}

/** Shared saved-places state, persisted to localStorage and synced across every component in the tree. */
export function useSaved(): SavedContextValue {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error("useSaved must be used within a SavedProvider");
  return ctx;
}
