// Form endpoint from the email service (Kit). Unset = every signup box and the /starter page stay hidden.
export const EMAIL_FORM_ACTION = ((import.meta.env.VITE_EMAIL_FORM_ACTION as string | undefined) ?? "").trim();
