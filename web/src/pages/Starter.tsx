import { Navigate } from "react-router-dom";
import { EmailForm } from "../components/EmailForm";
import { EMAIL_FORM_ACTION } from "../lib/email";

const page = (n: string) => `${import.meta.env.BASE_URL}${n}`;

/** Branded landing page for the starter guide. Only exists once the email form endpoint is set. */
export function Starter() {
  if (!EMAIL_FORM_ACTION) return <Navigate to="/" replace />;
  return (
    <div style={{ background: "var(--vino-800)", color: "var(--rosa-200)", overflow: "hidden" }}>
      <div style={{ height: 14, background: "var(--pattern-checker)" }} aria-hidden="true" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 items-center" style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "48px 20px 64px" }}>
        <div>
          <div style={{ fontFamily: "var(--font-caps)", fontWeight: 700, fontSize: 10, letterSpacing: ".24em", color: "var(--rosa-400)" }}>STARTER GUIDE · FOR YOUR PHONE</div>
          <h1 className="text-[56px] sm:text-[88px]" style={{ margin: "12px 0 0", fontFamily: "var(--font-serif)", fontWeight: 400, lineHeight: 0.92, letterSpacing: "-.03em", color: "var(--rosa-200)" }}>
            The Mexico City <i style={{ color: "var(--rosa-500)" }}>starter.</i>
          </h1>
          <p style={{ margin: "20px 0 28px", font: "400 18px/1.5 var(--font-sans)", color: "var(--nude-300)", maxWidth: 440 }}>
            Four places I&apos;d send you to first. Tap a pin, get a table, thank me later.
          </p>
          <div style={{ maxWidth: 480 }}>
            <EmailForm note="I'll email you the starter. Unsubscribe any time." noteColor="var(--nude-300)" />
          </div>
          <div style={{ marginTop: 28, font: "400 44px/1 var(--font-script)", color: "var(--rosa-400)", transform: "rotate(-4deg)", transformOrigin: "left" }}>xo, la güera</div>
        </div>

        <div aria-hidden="true" style={{ position: "relative", height: 420, maxWidth: 420, margin: "0 auto", width: "100%" }}>
          <img src={page("starter-silverio.jpg")} alt="" style={{ position: "absolute", right: 0, top: 24, width: "58%", borderRadius: 6, boxShadow: "0 18px 40px rgba(0,0,0,.45)", transform: "rotate(6deg)" }} />
          <img src={page("starter-cover.jpg")} alt="" style={{ position: "absolute", left: 0, top: 0, width: "58%", borderRadius: 6, boxShadow: "0 18px 40px rgba(0,0,0,.5)", transform: "rotate(-5deg)" }} />
        </div>
      </div>
      <div style={{ height: 14, background: "var(--pattern-checker)" }} aria-hidden="true" />
    </div>
  );
}
