import { PRIVACY_READY } from "./privacy";

// Public form address from Kit (the form's "form action"). Not a secret. Can be overridden at build time
// with VITE_EMAIL_FORM_ACTION.
const KIT_FORM = "https://app.kit.com/forms/10145099/subscriptions";
const FORM = ((import.meta.env.VITE_EMAIL_FORM_ACTION as string | undefined) ?? "").trim() || KIT_FORM;

// The signup (Home box, /starter, check-your-email redirect target) only exists once the privacy page does:
// nothing collects an email until people can read what happens to it.
export const EMAIL_FORM_ACTION = PRIVACY_READY ? FORM : "";
