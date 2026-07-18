import { NavLink } from "react-router-dom";
import { DATA } from "../lib/data";

export function Header() {
  const total = DATA.places.length;

  return (
    <header className="sticky top-0 z-40 border-b" style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--bg) 88%, transparent)", backdropFilter: "blur(10px)" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <NavLink to="/" className="flex items-baseline gap-2 shrink-0">
          <span className="font-display font-900 text-xl tracking-tight" style={{ letterSpacing: "-0.01em" }}>
            GUÍA
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: "var(--pink)" }}>
            CDMX
          </span>
        </NavLink>

        <nav className="flex items-center gap-1 sm:gap-2">
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
        </nav>
      </div>
    </header>
  );
}
