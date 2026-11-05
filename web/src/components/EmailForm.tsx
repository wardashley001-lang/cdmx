import { Button } from "./ds/Button";
import { EMAIL_FORM_ACTION } from "../lib/email";

/** The signup form itself. Posts straight to the email service; opens its confirmation in a new tab. */
export function EmailForm({ note = "I'll email you the starter. Unsubscribe any time.", noteColor = "var(--text-3)" }: { note?: string; noteColor?: string }) {
  if (!EMAIL_FORM_ACTION) return null;
  return (
    <>
      <form action={EMAIL_FORM_ACTION} method="post" target="_blank" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          type="email"
          name="email_address"
          required
          placeholder="Your email"
          aria-label="Your email"
          style={{ flex: "1 1 240px", height: 48, padding: "0 16px", borderRadius: 999, border: "1px solid var(--line-soft)", font: "400 16px var(--font-sans)", background: "var(--leche-0)", color: "var(--vino-900)" }}
        />
        <Button type="submit" variant="pink" iconRight="arrow-right">
          Send it
        </Button>
      </form>
      <p style={{ margin: "12px 0 0", font: "400 13px/1.5 var(--font-mono)", color: noteColor }}>{note}</p>
    </>
  );
}
