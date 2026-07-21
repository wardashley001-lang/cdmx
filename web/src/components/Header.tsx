import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { DATA } from "../lib/data";
import { SearchBar } from "./SearchBar";

function IconSearch() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconClose() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconSun() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2" />
      <path d="M12 2v2.5M12 19.5V22M22 12h-2.5M4.5 12H2M19 5l-1.8 1.8M6.8 17.2 5 19M19 19l-1.8-1.8M6.8 6.8 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconMoon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
function IconAuto() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="18" height="13" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <path d="M8 20h8M12 17v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

type ThemeMode = "system" | "light" | "dark";
const THEME_KEY = "guide-cdmx-theme";

function useThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>(
    () => (localStorage.getItem(THEME_KEY) as ThemeMode | null) ?? "system"
  );

  useEffect(() => {
    if (mode === "system") {
      document.documentElement.removeAttribute("data-theme");
      localStorage.removeItem(THEME_KEY);
    } else {
      document.documentElement.setAttribute("data-theme", mode);
      localStorage.setItem(THEME_KEY, mode);
    }
  }, [mode]);

  function cycle() {
    setMode((m) => (m === "system" ? "light" : m === "light" ? "dark" : "system"));
  }

  return { mode, cycle };
}

const THEME_ICON: Record<ThemeMode, typeof IconSun> = {
  system: IconAuto,
  light: IconSun,
  dark: IconMoon,
};

export function Header() {
  const total = DATA.places.length;
  const location = useLocation();
  const onSearchPage = location.pathname === "/search";
  const [expanded, setExpanded] = useState(false);
  const searchOpen = expanded || onSearchPage;
  const { mode, cycle } = useThemeToggle();
  const ThemeIcon = THEME_ICON[mode];

  return (
    <header className="sticky top-0 z-40 border-b" style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--bg) 88%, transparent)", backdropFilter: "blur(10px)" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center gap-4">
        <NavLink to="/" className="flex items-baseline gap-2 shrink-0">
          <span className="font-display font-900 text-xl tracking-tight" style={{ letterSpacing: "-0.01em" }}>
            GUÍA
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: "var(--accent)" }}>
            CDMX
          </span>
        </NavLink>

        {searchOpen && (
          <div className="flex-1 max-w-sm">
            <SearchBar autoFocus={expanded && !onSearchPage} />
          </div>
        )}

        <nav className="flex items-center gap-1 sm:gap-2 ml-auto">
          {!onSearchPage && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-label={expanded ? "Close search" : "Search"}
              className="p-2 rounded-sm transition-opacity opacity-60 hover:opacity-100"
            >
              {expanded ? <IconClose /> : <IconSearch />}
            </button>
          )}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              "px-3 py-1.5 rounded-sm text-sm font-medium transition-colors " +
              (isActive ? "" : "opacity-60 hover:opacity-100")
            }
            style={({ isActive }: { isActive: boolean }) => ({
              background: isActive ? "var(--surface-2)" : "transparent",
            })}
          >
            Guide
          </NavLink>
          <NavLink
            to="/map"
            className={({ isActive }) =>
              "px-3 py-1.5 rounded-sm text-sm font-medium transition-colors " +
              (isActive ? "" : "opacity-60 hover:opacity-100")
            }
            style={({ isActive }: { isActive: boolean }) => ({
              background: isActive ? "var(--surface-2)" : "transparent",
            })}
          >
            Map
          </NavLink>
          <span className="hidden sm:inline-block font-mono text-[11px] pl-3 ml-1 border-l tabular-nums" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
            {total} places
          </span>
          <button
            type="button"
            onClick={cycle}
            aria-label={`Theme: ${mode} (click to change)`}
            title={`Theme: ${mode}`}
            className="p-2 rounded-sm transition-opacity opacity-60 hover:opacity-100"
          >
            <ThemeIcon />
          </button>
        </nav>
      </div>
    </header>
  );
}
