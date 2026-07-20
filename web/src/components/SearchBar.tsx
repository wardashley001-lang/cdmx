import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export function SearchBar({
  autoFocus = false,
  onNavigate,
}: {
  autoFocus?: boolean;
  onNavigate?: () => void;
}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    setValue(searchParams.get("q") ?? "");
  }, [searchParams]);

  function handleChange(next: string) {
    setValue(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (next.trim()) {
        navigate(`/search?q=${encodeURIComponent(next.trim())}`);
      }
      onNavigate?.();
    }, 150);
  }

  return (
    <input
      ref={inputRef}
      type="search"
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      placeholder="Search a place, neighborhood, or vibe…"
      className="w-full px-3 py-1.5 text-sm outline-none transition-colors"
      style={{
        background: "var(--surface)",
        border: "1.5px solid var(--border)",
        color: "var(--text)",
      }}
    />
  );
}
