# CLAUDE.md: read this at the start of every session

This is the public repo for laguerasguide.com (the app is in `web/`). Claude Code sessions start with no memory, so this file and `docs/HANDOFF.md` are the memory. This file is public: keep private details out of it.

## Before you start
1. Read the shared board first (below). Read `docs/HANDOFF.md` (what is built, how it deploys, what is gated) and `VOICE.md` only when the task touches the site code or place copy; skip them for small or non-site tasks.
2. The shared board for Ashley, OpenClaw (her other agent) and Claude Code is `la-gueras-guide/COORDINATION.md` in the private repo `wardashley001-lang/OpenClawBabygirl`. If that repo is attached to the session, read it first and update it before you finish (Now / Next / Waiting on Ashley, Handoffs, Decisions, Log). If it is not attached, attach it.

3. Also read `START_HERE.md` at the root of that private repo (one page: what exists and where). At the end of your session, refresh its "What exists right now" if something changed, and add a Log line to `la-gueras-guide/COORDINATION.md`.
4. For any content, design or social task (carousels, Stories, captions, brand ideas), read `la-gueras-guide/social/AGENT_CARD.md` in the same private repo first. It is one page. For what Ashley has decided, see `la-gueras-guide/SESSION_HANDOFF_2026-11-06_to_07.md`, and search `la-gueras-guide/HER_WORDS_2026-11-05_to_07.md` for her exact wording (do not read it top to bottom). Create mode (new ideas) means be creative; fix mode (her feedback on a draft) means do exactly that change.

## Rules
- Ashley approves everything public. Do not publish, deploy new features, spend money, create accounts, send email or messages, or contact venues without her go-ahead for that exact action.
- Workflow: branch, push, open a draft PR, show Ashley screenshots, merge (squash) only after she says yes. Deploys run on pushes to `main` that touch `web/**`.
- Never invent facts about places or write personal experiences as if Ashley said them. Sources go in `sources[]`; the first-person voice only on text Ashley approved.
- Photos: only ones Ashley supplies, with a credit line.
- No mailing address anywhere (files, pages, emails).
- Features that depend on outside setup stay hidden until configured: the signup form (`VITE_EMAIL_FORM_ACTION`) and the full-guide buttons (`VITE_GUIDE_URL`).
- Run `npx tsc -b` and `npm run build` in `web/` and check for errors before showing a preview.
