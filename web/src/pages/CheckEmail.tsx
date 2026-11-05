import { useEffect } from "react";
import { Button } from "../components/ds/Button";

/** Where Kit sends people right after they type their email. Not linked from the site and kept out of search. */
export function CheckEmail() {
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
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "56px 20px 72px" }}>
        <div style={{ fontFamily: "var(--font-caps)", fontWeight: 700, fontSize: 10, letterSpacing: ".24em", color: "var(--rosa-400)" }}>ONE MORE TAP</div>
        <h1 className="text-[56px] sm:text-[88px]" style={{ margin: "12px 0 0", fontFamily: "var(--font-serif)", fontWeight: 400, lineHeight: 0.92, letterSpacing: "-.03em", color: "var(--rosa-200)" }}>
          Check your <i style={{ color: "var(--rosa-500)" }}>email.</i>
        </h1>
        <p style={{ margin: "20px 0 8px", font: "400 18px/1.5 var(--font-sans)", color: "var(--nude-300)", maxWidth: 520 }}>
          I just sent you a message. Tap the button inside to confirm, and the starter is yours.
        </p>
        <p style={{ margin: "0 0 28px", font: "400 13px/1.5 var(--font-mono)", color: "var(--nude-300)", maxWidth: 520 }}>
          Don&apos;t see it? Give it a minute, then check your spam or promotions folder.
        </p>
        <Button variant="pink" icon="map" href="#/mapa">
          Browse the map while you wait
        </Button>
        <div style={{ marginTop: 32, font: "400 44px/1 var(--font-script)", color: "var(--rosa-400)", transform: "rotate(-4deg)", transformOrigin: "left" }}>xo, la güera</div>
      </div>
      <div style={{ height: 14, background: "var(--pattern-checker)" }} aria-hidden="true" />
    </div>
  );
}
