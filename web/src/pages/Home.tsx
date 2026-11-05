import { GUIDE_URL } from "../lib/guide";
import { EMAIL_FORM_ACTION } from "../lib/email";
import { EmailForm } from "../components/EmailForm";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ds/Input";
import { Button } from "../components/ds/Button";
import { Tag } from "../components/ds/Tag";
import { Icon } from "../components/ds/Icon";
import { SpotCard } from "../components/ds/SpotCard";
import { SpotDetail } from "../components/SpotDetail";
import { DATA, noteOf, photoUrl } from "../lib/data";
import { GROUP_LABEL, GROUP_ORDER } from "../data/categoryStyle";
import { useSaved } from "../lib/useSaved";
import { useToast } from "../lib/ToastProvider";
import type { Place } from "../types";

const HOOD_PATTERNS = ["var(--pattern-checker)", "var(--pattern-gingham)", "var(--pattern-storia)", "var(--pattern-carpet)", "var(--pattern-stripes)"];

const SHELF_SIZE = 4;

function displayDate(value?: string) {
  if (!value) return "date pending";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function Eyebrow({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <div style={{ fontFamily: "var(--font-caps)", fontWeight: 700, fontSize: 10, letterSpacing: ".24em", textTransform: "uppercase", color }}>
      {children}
    </div>
  );
}

function Section({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <section style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "56px 20px", ...style }}>{children}</section>;
}

function ShelfHead({ eyebrow, title, blurb, seeAll }: { eyebrow: string; title: React.ReactNode; blurb?: string; seeAll?: { label: string; onClick: () => void } }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 24, marginBottom: 32, flexWrap: "wrap" }}>
      <div style={{ maxWidth: 620 }}>
        <Eyebrow color="var(--rosa-600)">{eyebrow}</Eyebrow>
        <h2 className="text-[48px] sm:text-[72px]" style={{ margin: "10px 0 0", fontFamily: "var(--font-serif)", fontWeight: 400, lineHeight: 0.9, letterSpacing: "-.02em" }}>
          {title}
        </h2>
        {blurb && <p style={{ margin: "16px 0 0", font: "400 16px/1.5 var(--font-sans)", color: "var(--text-2)", maxWidth: 560 }}>{blurb}</p>}
      </div>
      <span style={{ flex: 1 }} />
      {seeAll && (
        <Button variant="ghost" iconRight="arrow-right" onClick={seeAll.onClick}>
          {seeAll.label}
        </Button>
      )}
    </div>
  );
}

// Email signup: see EmailSpot below. Hidden until VITE_EMAIL_FORM_ACTION is set at build time.
const EMAIL_SPOT_ID = "email-spot";

type MoreCard = { title: React.ReactNode; blurb: string; pattern: string; href?: string; scrollTo?: string };

const MORE: MoreCard[] = [
  { title: <>Free <i>starter</i></>, blurb: "My picks and what's new, for your phone.", pattern: "var(--pattern-checker)", href: EMAIL_FORM_ACTION ? "#/starter" : undefined },
  { title: <>The <i>guide</i></>, blurb: "Itineraries and my notes, all in one place.", pattern: "var(--pattern-gingham)", href: GUIDE_URL || undefined },
  { title: <>On <i>Instagram</i></>, blurb: "Follow along at @laguerasguide.", pattern: "var(--pattern-storia)", href: "https://www.instagram.com/laguerasguide/" },
];

// Slim row of links under the hero. Each link only appears when it has a real destination.
function QuickLinks() {
  const links: { label: string; href: string; primary?: boolean; external?: boolean }[] = [];
  if (EMAIL_FORM_ACTION) links.push({ label: "Free starter", href: "#/starter", primary: true });
  if (GUIDE_URL) links.push({ label: "Get the guide", href: GUIDE_URL, external: true });
  links.push({ label: "Instagram", href: "https://www.instagram.com/laguerasguide/", external: true });
  const pill = (primary?: boolean): React.CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    height: 44,
    padding: "0 18px",
    borderRadius: 999,
    border: `1px solid ${primary ? "var(--rosa-500)" : "var(--line-soft)"}`,
    background: primary ? "var(--rosa-500)" : "var(--leche-0)",
    color: "var(--vino-900)",
    fontFamily: "var(--font-caps)",
    fontWeight: 700,
    fontSize: 10.5,
    letterSpacing: ".16em",
    textTransform: "uppercase",
    textDecoration: "none",
    whiteSpace: "nowrap",
    flex: "none",
  });
  return (
    <section className="sm:hidden" style={{ background: "var(--leche-50)", borderBottom: "1px solid var(--line-soft)" }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "14px 20px", display: "flex", gap: 10, alignItems: "center", overflowX: "auto", scrollbarWidth: "none" }}>
        <span className="hidden sm:inline" style={{ fontFamily: "var(--font-caps)", fontWeight: 700, fontSize: 10, letterSpacing: ".24em", color: "var(--text-3)", flex: "none", marginRight: 4 }}>MORE FROM LA GÜERA</span>
        {links.map((l) => (
          <a key={l.label} href={l.href} {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})} style={pill(l.primary)}>
            {l.label}
            <Icon name="arrow-right" size={13} />
          </a>
        ))}
      </div>
    </section>
  );
}

function MoreBand() {
  return (
    <Section style={{ background: "var(--leche-50)", padding: "36px 20px" }}>
      <h2 className="text-[34px] sm:text-[44px]" style={{ margin: "0 0 20px", fontFamily: "var(--font-serif)", fontWeight: 400, lineHeight: 0.95, letterSpacing: "-.02em" }}>
        More from <i>la güera</i>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {MORE.map((c, i) => {
          const inner = (
            <>
              <div style={{ height: 44, borderRadius: 4, background: c.pattern }} />
              <div style={{ marginTop: 12, fontFamily: "var(--font-serif)", fontSize: 28, lineHeight: 1, letterSpacing: "-.02em" }}>{c.title}</div>
              <p style={{ margin: "6px 0 2px", font: "400 15px/1.45 var(--font-sans)", color: "var(--text-2)" }}>{c.blurb}</p>
              {c.href && (
                <span style={{ fontFamily: "var(--font-caps)", fontWeight: 700, fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--rosa-600)" }}>
                  {c.href === GUIDE_URL ? "Get the guide" : "Open"}
                </span>
              )}
            </>
          );
          const box: React.CSSProperties = { display: "block", padding: 16, borderRadius: 8, border: "1px solid var(--line-soft)", background: "var(--leche-0)", textDecoration: "none", color: "inherit" };
          if (c.scrollTo) {
            const id = c.scrollTo;
            return (
              <button key={i} type="button" onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })} style={{ ...box, width: "100%", textAlign: "left", cursor: "pointer", font: "inherit" }}>
                {inner}
              </button>
            );
          }
          return c.href ? (
            <a key={i} href={c.href} {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} style={box}>{inner}</a>
          ) : (
            <div key={i} aria-disabled="true" style={{ ...box, opacity: 0.92 }}>{inner}</div>
          );
        })}
      </div>
    </Section>
  );
}

// Email signup. Hidden until a form endpoint is set at build time (VITE_EMAIL_FORM_ACTION),
// so nothing appears, and nothing is collected, until Ashley has approved a provider,
// the consent wording and the delivery path. Wording below is a draft for her approval.

function EmailSpot() {
  if (!EMAIL_FORM_ACTION) return null;
  return (
    <Section style={{ background: "var(--rosa-100)", padding: "40px 20px" }}>
      <div id={EMAIL_SPOT_ID} style={{ maxWidth: 560, scrollMarginTop: 90 }}>
        <h2 className="text-[34px] sm:text-[44px]" style={{ margin: "0 0 12px", fontFamily: "var(--font-serif)", fontWeight: 400, lineHeight: 0.95, letterSpacing: "-.02em" }}>
          Get the <i>starter</i>
        </h2>
        <p style={{ margin: "0 0 18px", font: "400 16px/1.5 var(--font-sans)", color: "var(--text-2)" }}>
          Four places I&apos;d send you to first, in your inbox.
        </p>
        <EmailForm />
      </div>
    </Section>
  );
}

function CardGrid({ places, onSave, onOpen, isSaved }: { places: Place[]; onSave: (p: Place) => void; onOpen: (p: Place) => void; isSaved: (id: string) => boolean }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-3.5 gap-y-7 sm:gap-8">
      {places.map((p) => (
        <SpotCard
          key={p.id}
          name={p.name}
          neighborhood={p.neighborhood}
          category={p.category}
          price={p.priceTier}
          hot={p.hot}
          pick={!!p.pick}
          michelin={p.michelin}
          note={noteOf(p)}
          image={photoUrl(p)}
          saved={isSaved(p.id)}
          onSave={() => onSave(p)}
          onClick={() => onOpen(p)}
        />
      ))}
    </div>
  );
}

export function Home() {
  const navigate = useNavigate();
  const { saved, toggle, isSaved } = useSaved();
  const showToast = useToast();
  const [q, setQ] = useState("");
  const [spot, setSpot] = useState<Place | null>(null);

  function onSave(p: Place) {
    const wasSaved = saved.includes(p.id);
    toggle(p.id);
    showToast(wasSaved ? "Removed. Their loss." : "Saved. Good taste.", wasSaved ? "heart-off" : "heart");
  }

  const featuredCandidates = useMemo(
    () => DATA.places
      .filter((p) => p.featuredOrder != null)
      .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0)),
    []
  );
  const hasPendingFeatured = featuredCandidates.some((p) => p.featuredApprovalState === "pending-ashley-review");
  const picks = useMemo(() => DATA.places.filter((p) => p.pick), []);
  const hotShelf = featuredCandidates.slice(0, SHELF_SIZE);
  const tacoCount = useMemo(() => DATA.places.filter((p) => p.category === "tacos").length, []);

  const hoods = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of DATA.places) {
      if (!p.neighborhood) continue;
      counts.set(p.neighborhood, (counts.get(p.neighborhood) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, []);

  function goToMap(query?: string, group?: string, flag?: string) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (group) params.set("g", group);
    if (flag) params.set("f", flag);
    navigate(params.toString() ? `/mapa?${params}` : "/mapa");
  }

  return (
    <main>
      {/* Hero */}
      <section style={{ background: "var(--vino-800)", overflow: "hidden" }}>
        <div className="grid-cols-1 sm:[grid-template-columns:1.15fr_.85fr]" style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "48px 20px 64px", display: "grid", gap: 40, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <Eyebrow color="var(--rosa-400)">Mexico City · where to eat, drink &amp; dance</Eyebrow>
            <div style={{ position: "relative" }}>
              <h1 className="text-[64px] sm:text-[clamp(84px,9vw,132px)]" style={{ margin: "18px 0 0", fontFamily: "var(--font-serif)", fontWeight: 400, lineHeight: 0.9, letterSpacing: "-.03em", color: "var(--rosa-200)" }}>
                Comer,
                <br />
                <i style={{ color: "var(--rosa-500)" }}>beber,</i>
                <br />
                bailar.
              </h1>
              <div className="text-[40px] sm:text-[60px]" style={{ fontFamily: "var(--font-script)", fontWeight: 400, lineHeight: 1, color: "var(--rosa-300)", transform: "rotate(-5deg)", whiteSpace: "nowrap", pointerEvents: "none", margin: "6px 0 0 40%" }}>
                xo, la güera
              </div>
            </div>
            <p style={{ font: "400 18px/1.55 var(--font-sans)", color: "var(--nude-300)", maxWidth: 460, margin: "24px 0 28px" }}>
              The spots I actually send my friends to. Tap a pin, get a table, thank me later.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                goToMap(q);
              }}
              style={{ display: "flex", gap: 10, flexWrap: "wrap", maxWidth: 560 }}
            >
              <Input size="lg" icon="search" placeholder="Tacos, mezcal, Roma Norte…" value={q} onChange={setQ} style={{ flex: "1 1 260px" }} />
              <Button size="lg" variant="pink" type="submit" iconRight="arrow-right">
                Vámonos
              </Button>
            </form>
          </div>
          <div
            className="hidden sm:block"
            style={{ justifySelf: "end", width: "min(100%,460px)", border: "1px solid rgba(247,202,216,.35)", borderRadius: 28, overflow: "hidden", background: "rgba(247,202,216,.04)" }}
          >
            <div style={{ padding: "26px 32px 30px" }}>
            <div style={{ font: "600 11px var(--font-sans)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--rosa-500)", marginBottom: 16 }}>
              {EMAIL_FORM_ACTION ? "Free · for your phone" : "Start here"}
            </div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 60, lineHeight: 0.98, letterSpacing: "-.03em", color: "var(--rosa-200)" }}>
              {EMAIL_FORM_ACTION ? (
                <>
                  Start with the free <i style={{ color: "var(--rosa-500)" }}>starter.</i>
                </>
              ) : (
                <>
                  Start with the <i style={{ color: "var(--rosa-500)" }}>map.</i>
                </>
              )}
            </div>
            <p style={{ margin: "14px 0 0", font: "400 15px/1.5 var(--font-sans)", color: "var(--nude-300)" }}>
              {EMAIL_FORM_ACTION ? "My favorite spots in Mexico City: where to eat, drink and go out, all on your phone." : "My favorite spots in Mexico City: where to eat, drink and go out."}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 22 }}>
              <Button variant="inverse" size="lg" fullWidth href={EMAIL_FORM_ACTION ? "#/starter" : "#/mapa"} iconRight="arrow-right">
                {EMAIL_FORM_ACTION ? "Get the starter" : "Open the map"}
              </Button>
              {GUIDE_URL && (
                <Button variant="inverse" size="lg" fullWidth href={GUIDE_URL} target="_blank" rel="noopener noreferrer" iconRight="arrow-right">
                  Get the full guide
                </Button>
              )}
            </div>
            <a
              href="https://www.instagram.com/laguerasguide/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-block", marginTop: 20, font: "400 13px var(--font-mono)", color: "var(--nude-300)", textDecoration: "underline" }}
            >
              Follow @laguerasguide
            </a>
            </div>
          </div>
        </div>
      </section>

      <QuickLinks />

      {/* New & hot */}
      {hotShelf.length > 0 && (
        <Section>
          <ShelfHead
            eyebrow={`Sources checked ${displayDate(DATA.meta?.featuredSourcesCheckedOn)}`}
            title={<>New &amp; <i>hot</i></>}
            blurb={
              hasPendingFeatured
                ? "Recent openings and fresh buzz, in provisional order. Final picks are pending approval; confirm details before you go."
                : "New and buzzing right now, picked by me. Sources checked on the date above; confirm details before you go."
            }
            seeAll={featuredCandidates.length > hotShelf.length ? { label: `See all ${featuredCandidates.length}`, onClick: () => goToMap(undefined, undefined, "hot") } : undefined}
          />
          <CardGrid places={hotShelf} onSave={onSave} onOpen={setSpot} isSaved={isSaved} />
        </Section>
      )}

      {/* La Güera's Picks */}
      {picks.length > 0 && (
        <Section style={{ background: "var(--rosa-100)" }}>
          <ShelfHead eyebrow="In my words" title={<>La Güera&apos;s <i>Picks</i></>} blurb="The places I'd send a friend to first." />
          <CardGrid places={picks} onSave={onSave} onOpen={setSpot} isSaved={isSaved} />
        </Section>
      )}

      {/* Mood tags */}
      <section style={{ background: "var(--rosa-200)" }}>
        <div className="flex-col sm:flex-row" style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "56px 20px", display: "flex", gap: 32, alignItems: "center", justifyContent: "space-between" }}>
          <h2 className="text-[38px] sm:text-[52px]" style={{ margin: 0, fontFamily: "var(--font-serif)", fontWeight: 400, lineHeight: 1, letterSpacing: "-.02em", maxWidth: 520 }}>
            What are you <i style={{ color: "var(--rosa-600)" }}>in the mood</i> for?
          </h2>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", maxWidth: 520 }}>
            {GROUP_ORDER.map((g) => (
              <Tag
                key={g}
                label={GROUP_LABEL[g]}
                onClick={() => goToMap(undefined, g)}
                count={DATA.places.filter((p) => p.group === g).length}
                style={{ background: "var(--leche-50)", borderColor: "transparent", height: 40, padding: "0 18px" }}
              />
            ))}
            <Tag
              label="Tacos"
              onClick={() => goToMap(undefined, undefined, "tacos")}
              count={tacoCount}
              style={{ background: "var(--leche-50)", borderColor: "transparent", height: 40, padding: "0 18px" }}
            />
          </div>
        </div>
      </section>

      {/* By colonia */}
      <Section>
        <Eyebrow color="var(--rosa-600)">By colonia</Eyebrow>
        <div className="grid-cols-2 sm:[grid-template-columns:repeat(5,1fr)]" style={{ display: "grid", gap: 16, marginTop: 20 }}>
          {hoods.map(([name, count], i) => (
            <button
              key={name}
              onClick={() => goToMap(name)}
              style={{ aspectRatio: "3/4", border: 0, borderRadius: "var(--radius-arch)", background: HOOD_PATTERNS[i % HOOD_PATTERNS.length], cursor: "pointer", padding: 12, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
            >
              <span style={{ background: "var(--leche-50)", borderRadius: 999, padding: "9px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <span style={{ font: "italic 400 20px/1 var(--font-serif)", color: "var(--vino-900)" }}>{name}</span>
                <span style={{ fontFamily: "var(--font-caps)", fontWeight: 700, fontSize: 8.5, letterSpacing: ".2em", color: "var(--text-3)" }}>{count} SPOTS</span>
              </span>
            </button>
          ))}
        </div>
      </Section>

      {/* More from la güera (placeholders until each has a destination) */}
      <MoreBand />

      <EmailSpot />

      <SpotDetail spot={spot} onClose={() => setSpot(null)} />
    </main>
  );
}
