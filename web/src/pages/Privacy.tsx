import { Navigate } from "react-router-dom";
import { PRIVACY, PRIVACY_READY } from "../lib/privacy";

const h2: React.CSSProperties = { margin: "36px 0 10px", fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: 30, lineHeight: 1, letterSpacing: "-.02em" };
const p: React.CSSProperties = { margin: "0 0 12px", font: "400 16px/1.6 var(--font-sans)", color: "var(--text-2)" };

export function Privacy() {
  if (!PRIVACY_READY) return <Navigate to="/" replace />;
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "56px 20px 120px" }}>
      <div style={{ fontFamily: "var(--font-caps)", fontWeight: 700, fontSize: 10, letterSpacing: ".24em", color: "var(--rosa-600)" }}>LAST UPDATED {PRIVACY.updated.toUpperCase()}</div>
      <h1 className="text-[48px] sm:text-[72px]" style={{ margin: "10px 0 20px", fontFamily: "var(--font-serif)", fontWeight: 400, lineHeight: 0.92, letterSpacing: "-.03em" }}>
        Your <i style={{ color: "var(--rosa-500)" }}>privacy.</i>
      </h1>
      <p style={p}>
        La Güera&rsquo;s Guide is run by {PRIVACY.sellerName} in {PRIVACY.country}. This page explains, in plain words, what happens to your information.
      </p>

      <h2 style={h2}>What I collect</h2>
      <p style={p}>
        <b>If you sign up for the free starter:</b> your email address, and whatever your email service records about the emails (for example whether they were delivered, opened, or clicked, and when you confirm or unsubscribe).
      </p>
      <p style={p}>
        <b>Your saved places (Mi lista):</b> these stay in your own browser. I never receive them. The &ldquo;Share&rdquo; and &ldquo;Copy&rdquo; buttons only work on your device.
      </p>
      <p style={p}>
        <b>If you buy something:</b> the checkout is run by a payment company that I link to at the time. It handles your payment details, and I do not receive or store your card number.
      </p>
      <p style={p}>
        <b>Basic technical information:</b> like any website, the companies that host this site and deliver its emails see technical details such as your IP address and browser while they do their job.
      </p>

      <h2 style={h2}>Why</h2>
      <p style={p}>To send you the starter you asked for, to confirm your email, to run the guide and answer your questions, and to keep records the law may require.</p>

      <h2 style={h2}>Who handles it</h2>
      <p style={p}>
        <b>Kit</b> stores the email list and sends the emails. <b>GitHub Pages</b> hosts this website and <b>Cloudflare</b> manages its domain name. They handle information under their own privacy policies and may do so in other countries, including the United States. I don&rsquo;t sell your information and I don&rsquo;t rent my email list.
      </p>

      <h2 style={h2}>Your emails, your choice</h2>
      <p style={p}>
        You confirm your email before anything is sent. Every email has an unsubscribe link, and you can also write to me and I will remove you.
      </p>

      <h2 style={h2}>How long I keep it</h2>
      <p style={p}>
        I keep your email on the list until you unsubscribe or ask me to delete it. I may keep a minimal record that you unsubscribed so that I don&rsquo;t email you again. Records of purchases, if any, are kept as long as the law requires.
      </p>

      <h2 style={h2}>Your rights</h2>
      <p style={p}>
        Depending on where you live, you may be able to ask to see, correct, or delete your information, or to take back your consent. Write to{" "}
        <a href={`mailto:${PRIVACY.contactEmail}`} style={{ color: "var(--rosa-600)" }}>{PRIVACY.contactEmail}</a>.
      </p>

      <h2 style={h2}>Children</h2>
      <p style={p}>This site and the email list are not meant for children under 13, and I don&rsquo;t knowingly collect their information.</p>

      <h2 style={h2}>Changes</h2>
      <p style={p}>If this changes, I&rsquo;ll update the date at the top of this page.</p>
    </main>
  );
}
