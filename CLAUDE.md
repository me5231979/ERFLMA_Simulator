# CLAUDE.md — FLH ER & Discipline Simulator

Context and guardrails for anyone (human or Claude Code) working in this repo.

## What this is

A React + Vite decision-support tool for Vanderbilt FLH employee relations. A
manager/HR user describes a situation; the app:

1. **Screens for legal hard stops** (the "legal screen").
2. **Classifies** the issue into a lane and a step on the discipline ladder —
   _only if_ the legal screen is clear.
3. Returns **state-aware next steps** (at-will language, final-pay timing).
4. Names **who to route to**.

It is **decision support, not legal advice**, and it runs entirely in the
browser — nothing the user types is sent anywhere.

## Guardrails (do not regress)

These are enforced in `src/engine.js` and covered by `src/engine.test.js`. If
you change the engine, keep these true and keep the tests green.

1. **The legal screen runs before classification.** `buildPlan()` calls
   `screenForHardStops()` first. If any hard stop is triggered, the plan has
   `status: 'hard-stop'`, `classification` is `null`, and the user is routed for
   review — the tool does **not** suggest discipline.
2. **OGC / employment counsel never renders as a direct contact.** Counsel has
   `directContact: false` in `src/data/roles.js`. The engine pairs it with a
   direct-contact human, and `Contacts.jsx` renders it without contact details.
   Never print OGC contact info directly.
3. **Every plan ends with a route-to-a-human step.** The last item in
   `plan.steps` is always `kind: 'route'` and always includes a direct-contact
   human (HRBP/ER).

## Project layout

```
index.html
vite.config.js
src/
  main.jsx            # React entry
  App.jsx             # page + state, calls buildPlan()
  engine.js           # GUARDRAILS LIVE HERE (UI-free, unit-tested)
  engine.test.js      # guardrail tests (npm test, node:test)
  theme.js            # look & feel
  styles.css          # base CSS
  components/
    Intake.jsx        # the form (legal screen presented first)
    Plan.jsx          # renders the ordered plan + resources
    Contacts.jsx      # routing UI (enforces "OGC not direct")
  data/
    states.js         # state legal language + timing (TN default)
    classification.js # hard stops, lanes, ladder
    roles.js          # who to route to (fill in real `who` details)
    resources.js      # resource links
```

## Editing content (no component changes needed)

- Legal / state language → `src/data/states.js`
- Hard stops, lanes, ladder → `src/data/classification.js`
- Who to route to → `src/data/roles.js` (fill in real names/links in `who`)
- Resource links → `src/data/resources.js`
- Look and feel → `src/theme.js`

## Commands

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm test         # guardrail tests (node:test, no browser)
```

## Roadmap

- **Free-text AI intake.** Let a user paste a narrative and have it pre-fill the
  legal-screen flags and lane suggestion — _without_ bypassing the guardrails:
  the legal screen must still gate classification, and a human still owns the
  decision. Any AI suggestion is advisory and must route to a person.
- Deploy a permanent link (Vercel/Netlify/Pages; framework preset Vite, build
  `npm run build`, output `dist`).
- More configured states beyond TN/CA/NY/other.
