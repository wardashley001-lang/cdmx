import { useEffect } from "react";
import { Button } from "../components/ds/Button";

const asset = (n: string) => `${import.meta.env.BASE_URL}${n}`;

/** Where people land after confirming their email in Kit. Not linked from the site and kept out of search. */
export function StarterThanks() {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <div style={{ background: "var(--vino-800)", color: "var(--rosa-200)", overflow: "hidden" }}>
      <div style={{ height: 14, background: "var(--pattern-checker)" }} aria-hidden="true" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 items-center" style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "48px 20px 64px" }}>
        <div>
          <div style={{ fontFamily: "var(--font-caps)", fontWeight: 700, fontSize: 10, letterSpacing: ".24em", color: "var(--rosa-400)" }}>YOU&apos;RE IN</div>
          <h1 className="text-[56px] sm:text-[88px]" style={{ margin: "12px 0 0", fontFamily: "var(--font-serif)", fontWeight: 400, lineHeight: 0.92, letterSpacing: "-.03em", color: "var(--rosa-200)" }}>
            Here&apos;s your <i style={{ color: "var(--rosa-500)" }}>starter.</i>
          </h1>
          <p style={{ margin: "20px 0 28px", font: "400 18px/1.5 var(--font-sans)", color: "var(--nude-300)", maxWidth: 440 }}>
            Four places I&apos;d send you to first. Tap a pin, get a table, thank me later.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Button variant="pink" icon="download" href={asset("la-gueras-guide-mexico-city-starter.pdf")} download="La-Gueras-Guide-Mexico-City-Starter.pdf">
              Download the starter
            </Button>
            <Button variant="inverse" icon="map" href="#/mapa">
              Open the whole map
            </Button>
          </div>
          <p style={{ margin: "14px 0 0", font: "400 13px/1.5 var(--font-mono)", color: "var(--nude-300)" }}>
            It&apos;s a PDF. Save it to your phone so it&apos;s there when you need it.
          </p>
          <div style={{ marginTop: 28, font: "400 44px/1 var(--font-script)", color: "var(--rosa-400)", transform: "rotate(-4deg)", transformOrigin: "left" }}>xo, la güera</div>
        </div>

        <div aria-hidden="true" style={{ position: "relative", height: 420, maxWidth: 420, margin: "0 auto", width: "100%" }}>
          <img src={asset("starter-lalo.jpg")} alt="" style={{ position: "absolute", right: 0, top: 24, width: "58%", borderRadius: 6, boxShadow: "0 18px 40px rgba(0,0,0,.45)", transform: "rotate(6deg)" }} />
          <img src={asset("starter-cover.jpg")} alt="" style={{ position: "absolute", left: 0, top: 0, width: "58%", borderRadius: 6, boxShadow: "0 18px 40px rgba(0,0,0,.5)", transform: "rotate(-5deg)" }} />
        </div>
      </div>
      <div style={{ height: 14, background: "var(--pattern-checker)" }} aria-hidden="true" />
    </div>
  );
}
