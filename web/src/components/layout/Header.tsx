import { useLocation, useNavigate } from "react-router-dom";
import { Wordmark } from "../ds/Wordmark";
import { Button } from "../ds/Button";
import { IconButton } from "../ds/IconButton";
import { useSaved } from "../../lib/useSaved";

const NAV: { path: string; label: string }[] = [
  { path: "/", label: "Home" },
  { path: "/mapa", label: "Mapa" },
  { path: "/mi-lista", label: "Mi lista" },
];

export function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { saved } = useSaved();

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 40, background: "var(--vino-900)", borderBottom: "1px solid var(--line-on-dark)" }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", height: 68, padding: "0 20px", display: "flex", alignItems: "center", gap: 28 }}>
        <a onClick={() => navigate("/")} style={{ cursor: "pointer", textDecoration: "none", paddingTop: 4 }}>
          <Wordmark size={20} tone="rosa" />
        </a>
        <span style={{ flex: 1 }} />
        <nav className="hidden sm:flex" style={{ gap: 26 }}>
          {NAV.map((n) => {
            const on = pathname === n.path;
            return (
              <button
                key={n.path}
                onClick={() => navigate(n.path)}
                style={{
                  position: "relative",
                  height: 40,
                  padding: 0,
                  border: 0,
                  background: "none",
                  color: on ? "var(--rosa-200)" : "var(--nude-300)",
                  fontFamily: "var(--font-caps)",
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: ".2em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {n.label}
                {n.path === "/mi-lista" && saved.length > 0 && (
                  <span style={{ font: "italic 400 15px var(--font-serif)", letterSpacing: 0, color: "var(--rosa-500)" }}>{saved.length}</span>
                )}
                <span style={{ position: "absolute", left: 0, right: 0, bottom: 4, height: 1.5, background: on ? "var(--rosa-500)" : "transparent" }} />
              </button>
            );
          })}
        </nav>
        <span className="hidden sm:inline-flex">
          <Button size="sm" variant="pink" icon="map" onClick={() => navigate("/mapa")}>
            Open the map
          </Button>
        </span>
        <span className="sm:hidden">
          <IconButton icon="search" label="Search" size={40} variant="inverse" onClick={() => navigate("/mapa")} />
        </span>
      </div>
    </header>
  );
}

export function MobileTabBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { saved } = useSaved();
  const items: { path: string; icon: string; label: string }[] = [
    { path: "/", icon: "house", label: "Home" },
    { path: "/mapa", icon: "map", label: "Mapa" },
    { path: "/mi-lista", icon: "heart", label: "Mi lista" },
  ];
  return (
    <nav
      className="hidden max-sm:flex"
      style={{ position: "fixed", left: 14, right: 14, bottom: 14, zIndex: 45, height: 60, background: "var(--vino-900)", borderRadius: 999, padding: 6, boxShadow: "var(--shadow-float)" }}
    >
      {items.map((it) => {
        const on = pathname === it.path;
        return (
          <button
            key={it.path}
            onClick={() => navigate(it.path)}
            style={{
              flex: 1,
              border: 0,
              borderRadius: 999,
              background: on ? "var(--rosa-500)" : "transparent",
              color: on ? "var(--vino-900)" : "var(--rosa-200)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              fontFamily: "var(--font-caps)",
              fontWeight: 700,
              fontSize: 10,
              letterSpacing: ".16em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            <IconMask icon={it.icon} />
            {on && it.label}
            {it.path === "/mi-lista" && saved.length > 0 && !on && (
              <span style={{ font: "italic 400 14px var(--font-serif)", letterSpacing: 0, color: "var(--rosa-400)" }}>{saved.length}</span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

function IconMask({ icon }: { icon: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: 17,
        height: 17,
        backgroundColor: "currentColor",
        WebkitMask: `url(https://unpkg.com/lucide-static@0.460.0/icons/${icon}.svg) center/contain no-repeat`,
        mask: `url(https://unpkg.com/lucide-static@0.460.0/icons/${icon}.svg) center/contain no-repeat`,
      }}
    />
  );
}

export function Footer() {
  return (
    <footer style={{ background: "var(--vino-900)", color: "var(--rosa-200)", padding: "72px 20px 96px" }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 32, alignItems: "flex-end", justifyContent: "space-between" }}>
        <Wordmark size={72} tone="rosa" />
        <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
          <span style={{ fontFamily: "var(--font-caps)", fontWeight: 700, fontSize: 10, letterSpacing: ".24em", color: "var(--nude-300)" }}>
            HECHO EN LA CDMX · UPDATED EVERY FRIDAY
          </span>
          <span style={{ font: "400 14px var(--font-mono)", color: "var(--rosa-400)" }}>no ads, no sponsored spots, just taste.</span>
        </div>
      </div>
    </footer>
  );
}
