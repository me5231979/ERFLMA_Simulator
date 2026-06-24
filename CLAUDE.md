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

The pure logic lives in `src/engine.js` and is covered by `src/engine.test.js`.
The full UI/behavior spec is `ER_Simulator_UIUX_PRD.md` (PRD §6). Keep these true
and keep the tests green.

1. **The legal screen runs before classification.** The flow is
   Role → State → **Screen** → Classify → Plan. `planPathFor()` returns
   `'protected'` whenever any hard stop is checked — the discipline ladder is
   unreachable while a hard stop is active.
2. **OGC never renders as a direct contact.** `ROLES.OGC.indirect === true`
   (in `src/data/erData.js`); it renders as an "indirect" card reading
   "Brought in by ER/EOA — not contacted directly". `isDirectContact('OGC')`
   is `false`. Never print OGC contact info directly.
3. **Every plan routes to a direct-contact human.** `protectedRouting()` always
   includes at least one direct human, and every plan ends with the
   "confirm with your Engagement Consultant or ER" disclaimer.
4. **California surfaces immediate-final-pay warnings** on every termination
   path (ladder step 4, serious-misconduct sequence, and the state delta box).
   `STATES.CA.urgent === true` drives this.
5. **The tool never authorizes a termination** or states a legal conclusion — it
   describes process and ownership only.

## Project layout

```
index.html
vite.config.js
ER_Simulator_UIUX_PRD.md  # the canonical UI/UX spec — match it to the pixel
src/
  main.jsx            # React entry
  App.jsx             # the 5-stage flow (Role→State→Screen→Classify→Plan) + UI
  engine.js           # GUARDRAILS LIVE HERE (UI-free, unit-tested)
  engine.test.js      # guardrail tests (npm test, node:test)
  theme.js            # brand tokens (GOLD/INK/PAPER/LINE/STOP)
  styles.css          # base CSS
  assets/
    vanderbilt-horizontal.png  # header logo (gold V + wordmark)
    vanderbilt-centered.png    # stacked logo variant
  data/
    erData.js         # ROLES, STATES, RESOURCES, HARD_STOPS, LANES, LADDER, SEVERITY
```

## Editing content (no component changes needed)

All content lives in `src/data/erData.js`:
- State legal language / deltas / final-pay → `STATES`
- Hard stops (the legal screen) → `HARD_STOPS`
- Lanes & the discipline ladder → `LANES`, `LADDER`, `SEVERITY`
- Who to route to → `ROLES` (OGC must keep `indirect: true`)
- Resource links → `RESOURCES`
- Brand colors → `src/theme.js`

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
