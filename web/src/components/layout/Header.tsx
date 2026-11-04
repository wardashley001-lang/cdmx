import { useLocation, useNavigate } from "react-router-dom";
import { Wordmark } from "../ds/Wordmark";
import { Button } from "../ds/Button";
import { IconButton } from "../ds/IconButton";
import { Icon } from "../ds/Icon";
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
        <a
          role="link"
          tabIndex={0}
          aria-label="La Güera's Guide, home"
          onClick={() => navigate("/")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              navigate("/");
            }
          }}
          style={{ cursor: "pointer", textDecoration: "none", paddingTop: 4, minHeight: 44, display: "inline-flex", alignItems: "center" }}
        >
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
          <IconButton
            icon="search"
            label="Search"
            variant="inverse"
            onClick={() => {
              // Already on the map: focus its search box inside the tap so the phone keyboard opens.
              const box = document.querySelector<HTMLInputElement>('input[aria-label="Search places"]');
              if (box) {
                box.focus();
                box.scrollIntoView({ block: "nearest" });
              } else {
                navigate("/mapa", { state: { focusSearch: true } });
              }
            }}
          />
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
      style={{ position: "fixed", left: 14, right: 14, bottom: "calc(14px + env(safe-area-inset-bottom, 0px))", zIndex: 45, height: 60, background: "var(--vino-900)", borderRadius: 999, padding: 6, boxShadow: "var(--shadow-float)" }}
    >
      {items.map((it) => {
        const on = pathname === it.path;
        return (
          <button
            key={it.path}
            onClick={() => navigate(it.path)}
            aria-label={it.label}
            aria-current={on ? "page" : undefined}
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
            <Icon name={it.icon} size={17} />
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

export function Footer() {
  return (
    <footer style={{ background: "var(--vino-900)", color: "var(--rosa-200)", padding: "72px 20px calc(112px + env(safe-area-inset-bottom, 0px))" }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 32, alignItems: "flex-end", justifyContent: "space-between" }}>
        <Wordmark size={typeof window !== "undefined" && window.innerWidth < 480 ? 56 : 72} tone="rosa" />
        <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
          <span style={{ fontFamily: "var(--font-caps)", fontWeight: 700, fontSize: 10, letterSpacing: ".24em", color: "var(--nude-300)" }}>
            HECHO EN LA CDMX
          </span>
          <span style={{ font: "400 14px var(--font-mono)", color: "var(--rosa-400)" }}>no ads, no sponsored spots, just taste.</span>
        </div>
      </div>
    </footer>
  );
}
