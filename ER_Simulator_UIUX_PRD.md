# ER & Discipline Simulator — UI/UX Specification (PRD)

This document specifies the **exact** interface and behavior of the FLH
Employee Relations & Progressive Discipline Simulator. It is written so the app
can be rebuilt identically from this spec alone. Where a value is given
(color, pixel size, copy), reproduce it exactly.

> The canonical implementation already exists in this project under `src/`.
> This PRD describes what that code produces. If rebuilding from scratch, match
> it to the pixel.

---

## 1. Product in one line

A manager or employee describes an employee-relations situation; the app
screens it for legal hard stops, classifies it, and returns state-aware next
steps plus the right Vanderbilt people to route to. **Decision support, not
legal advice. It never issues a legal conclusion and never clears a separation
on its own.**

---

## 2. Design system

### Color tokens
| Token | Hex | Use |
|---|---|---|
| GOLD | `#CFAE70` | Eyebrows, accents, step numbers, italic title word, active focus ring |
| INK | `#0E0E0E` | Primary text, selected fills, primary button |
| PAPER | `#FBFAF7` | Page background |
| LINE | `#E4DFD3` | All hairline borders/dividers |
| STOP | `#9E2B25` | Hard-stop/danger states, legal-risk accents |

Supporting greys used in the implementation: body text `#403C34`,
muted text `#6E685D`, faint text `#8A8478`, soft gold wash `#FAF6EC`,
red wash `#FCF6F5`.

### Type
- **Serif (Georgia)**: the H1 title and H2 section headers and step numbers.
  Georgia, weight 400. The H1 has one word in *italic gold* (see header).
- **Sans (Helvetica Neue / Arial)**: everything else.
- **Eyebrow / label style**: 11px, uppercase, letter-spacing 0.18em, gold, bold.
- **H1**: Georgia 38px, line-height 1.05.
- **H2**: Georgia 24px, weight 400.
- **H3 (section label)**: 13px, uppercase, letter-spacing 0.1em, gold, bold.
- **Body**: 14.5px, line-height 1.65, color `#403C34`.

### Layout
- Centered single column, **max-width 760px**, page padding `40px 24px 80px`
  (mobile ≤640px: `24px 16px 64px`).
- Cards: white background, 1px LINE border, 4px radius, padding `32px 30px`.
- Generous whitespace, editorial feel. No shadows except subtle inset on
  selected cards (`inset 0 0 0 1px INK`).
- Buttons transition `all .15s`. Respect `prefers-reduced-motion`.
- Focus-visible outline: 2px solid GOLD, offset 2px (keyboard accessibility).

### Tone of the visual design
Institutional, calm, trustworthy. Vanderbilt gold + ink, editorial serif
headlines over clean sans body. It should read like a considered HR instrument,
not a colorful consumer app.

---

## 3. Global structure (every screen)

1. **Header** (persists across all stages):
   - Gold eyebrow: `Futures Learning Hub · Employee Relations`
   - H1: `Discipline & ER ` + italic-gold word `Simulator`
   - Sub (15px, max-width 580): "Process and policy guidance — not legal
     advice. The system routes risk to the right person, adjusts to your work
     state, and never clears a separation on its own."

2. **Progress rail** (persists): a horizontal row of 5 steps —
   `Role · State · Screen · Classify · Plan`. Each is a numbered circle (1–5)
   plus its label. Steps at or before the current stage are "active": filled
   ink circle, full-opacity label. Later steps: hollow circle, 0.4 opacity
   label. Bordered top and bottom with LINE, 14px vertical padding, wraps on
   mobile (each item min-width 96px).

3. **Card**: the active stage renders inside one white card.

4. **Nav row** (bottom of card): left side holds `← Back` and/or `↺ Start over`
   ghost buttons; right side holds the primary advance button (ink fill, paper
   text) labeled per stage. Primary button disables (grey `#D8D3C7`) until the
   stage's requirement is met.

---

## 4. The five stages

### Stage 1 — Role (`intro`)
- H2: "Who is describing the situation?"
- Body: "Manager view returns process and next steps. Employee view focuses on
  rights, reporting, and support."
- Two selectable cards side by side (wrap on mobile), each with a bold title and
  a grey subtitle:
  - `I'm a manager` / "Handling a direct report"
  - `I'm an employee` / "Reporting or seeking help"
- Selected card: ink border + inset ink ring.
- Primary button `Continue →`, disabled until a role is chosen.

### Stage 2 — State (`state`)
- H2: "What state is this situation taking place in?"
- Body: "The employee's work location sets which laws apply. This changes
  final-pay timing, protected categories, and required notices."
- A responsive grid of state tiles (auto-fit, min 150px). Four states:
  **TN, NY, FL, CA**. Each tile: large Georgia gold state code, bold state name
  beneath. **California also shows a small red flag**: "Immediate final pay".
- On select: ink border + inset ring, and a gold-washed note box appears below
  showing the state's at-will summary (e.g., CA: "At-will in name, but the most
  employee-protective state. Treat every step as high-scrutiny.").
- Back `← Back`; primary `Start screening →`, disabled until a state is chosen.

### Stage 3 — Screen (`screen`) — the legal/safety gate
- H2: "Safety & legal screen"
- Body: "Check anything present, even slightly. These take priority over
  discipline. Over-routing to a person is the safe error."
- A responsive grid (auto-fit, min 220px) of **9 toggle cards**, each a hard
  stop. Each card shows: a checkbox square (fills STOP red with a ✓ when on),
  the bold label, a grey description, and a small red law citation line.
  Selected card: STOP border + red wash.
- The 9 hard stops (label — short purpose):
  1. Protected-class treatment or bias
  2. Harassment, threats, or violence
  3. A student is involved
  4. Disability or accommodation signal
  5. Leave or medical interference
  6. Concerted or protected activity
  7. Potential criminal conduct
  8. Possible retaliation
  9. Off-duty / lawful outside-work conduct
- If **any** are checked, a red alert appears: "**Hard stop active.** This
  routes to a person before any disciplinary action. Continue to see who owns
  it." — and the primary button reads `See routing →` and jumps straight to the
  Plan stage in PROTECTED mode (skipping Classify).
- If **none** checked, primary button reads `No flags — classify →` → Classify.
- Back `← Back`.

### Stage 4 — Classify (`classify`)
- H2: "What kind of situation is this?"
- Body: "Performance and conduct follow the ladder. Serious misconduct can skip
  steps but never without ER."
- Three stacked selectable lane cards, each with a name, a right-aligned gold
  tag, and a grey blurb:
  - **Performance** — tag "Ladder applies"
  - **Conduct / Policy** — tag "Ladder applies"
  - **Serious Misconduct** — tag "ER co-owns"
- If Performance or Conduct is selected, a severity sub-section appears:
  H3 "Where does this enter the ladder?" and three pill buttons —
  `Minor / first instance`, `Moderate or repeated`,
  `Serious / prior warnings exist`. Selected pill: ink fill, white text.
- Primary `Build the plan →`, disabled until a lane is chosen (and, for
  Performance/Conduct, a severity).
- Back `← Back`.

### Stage 5 — Plan (`plan`)
Renders one of three outcome views, then two shared blocks, then nav.

The plan body differs by path (this is the core of the tool — outcomes must NOT
all look the same):

**5a. Protected plan** (reached when a hard stop fired):
- Red uppercase banner pill: "Stop — route before acting".
- H2 "Protected / legal-risk situation" + explanatory paragraph (manager vs
  employee wording differs).
- H3 "Why this routed" — a list echoing each triggered hard stop and its law.
- H3 "Route to — in this order" — ordered role cards derived from the triggered
  stops (deduped, priority-ordered). If a legally heavy trigger is present
  (protected class, harassment/violence, criminal, retaliation), an **OGC card**
  is appended. If the user is an employee, an **EAP card** is appended.
- H3 "Do now" — a short numbered action list; includes a "call VUPD first" item
  if a danger/criminal trigger is present.

**5b. Serious misconduct plan**:
- H2 "Serious misconduct path" + paragraph on shared decision.
- H3 "Sequence" — numbered steps (secure situation/VUPD, consider paid admin
  leave, document, contact EC + ER, consistency check, [CA-only payroll note if
  state is CA], ER + EC sign-off).
- H3 "Who's involved" — role cards: Engagement Consultant, ER/FMLA, VUPD, OGC.
- Red "**Re-screen.**" alert reminding that protected facts move it off this path.

**5c. Progressive ladder plan** (Performance / Conduct):
- H2 "{Lane} — progressive plan" + blurb + a line stating the entry step from
  severity.
- H3 "Who owns this lane" — role cards (Performance → HCM + Engagement
  Consultant; Conduct → Engagement Consultant).
- H3 "The ladder" — the 4 rungs rendered vertically, each: a gold circle with
  the step number (or "—" if below the entry step and dimmed to 0.42 opacity),
  the step name, a right-aligned gold owner label, a purpose line, and an
  italic documentation line. **Step 4 shows a red final-pay note if state is
  California.**
  - Rung 1 Coaching / Verbal Counseling — owner "Manager, HCM available"
  - Rung 2 Written Warning — owner "Manager + Engagement Consultant"
  - Rung 3 Final Written Warning / PIP — owner "Engagement Consultant + ER"
  - Rung 4 Termination Recommendation — owner "ER + Engagement Consultant"
- H3 "At every step" — bulleted reminders (document observable facts, check
  consistency, re-run the legal screen, loop your Engagement Consultant).

**Shared blocks appended to every plan, in this order:**
1. **State delta box**: a bordered box (STOP border if the state is "urgent",
   i.e. CA). Gold-washed header with the state code (Georgia gold) and
   "What changes in {State}". A bulleted list of that state's specific legal
   deltas. CA additionally shows a red footer reinforcing immediate final pay.
2. **Disclaimer line** (faint, top-bordered): "Guidance only, current to
   June 2026. {State} rule of thumb: {state final-pay summary} Confirm the
   final step with your Engagement Consultant or ER before acting."
3. **Resources section**: H3 "Resources", intro line, then a "Federal & HR
   standards" group of link cards (always shown), then a "{State} sources" group
   filtered to the selected state. Each resource card is a clickable link
   (opens new tab) showing a gold org label, an ↗ glyph, a bold title, and a
   grey note. Hover: gold border + gold wash.
- Nav: `← Back` and `↺ Start over` (no forward button on the final stage).

---

## 5. Routing logic (roles)

Seven roles. Cards show name, description, and a "who" line.
- **HCM** — local light-touch HR rep; first stop.
- **Engagement Consultant** — HR business partner; owns active cases.
- **ER / FMLA Team** — central ER + leave; required at final steps and all leave.
- **EOA** — Equal Opportunity & Access; Title IX, protected-class, any student.
- **OGC** — Office of General Counsel; **`indirect`** — renders with an "indirect"
  badge and the line "Brought in by ER/EOA — not contacted directly". **It must
  NEVER render as a direct "contact this person" instruction.** This is a hard
  product guardrail.
- **VUPD** — campus police; danger, threats, weapons, suspected law-breaking.
- **EAP** — confidential employee wellbeing support; surfaced on the employee
  side of the protected plan.

Hard-stop → route mapping (ordered role keys), used to build the Protected
plan's routing list:
- Protected-class → EOA, EC
- Harassment/violence → EOA, ER, VUPD
- Student involved → EOA
- Disability/accommodation → ER, EC
- Leave/medical → ER, EC
- Concerted/protected activity → ER, EC
- Criminal → VUPD, ER
- Retaliation → ER, EC
- Off-duty → ER, EC

---

## 6. Behavioral guardrails (do not regress)

1. The legal screen (Stage 3) runs **before** classification. A hard stop
   short-circuits directly to the Protected plan; the discipline ladder is
   unreachable while any hard stop is active.
2. **OGC never appears as a direct contact** — only as the indirect card.
3. Every plan ends with a route-to-a-human step and the state final-pay note.
4. California always surfaces immediate-final-pay warnings on any termination
   path (ladder step 4, serious misconduct sequence, and the state delta box).
5. The app never states a legal conclusion or authorizes a termination; it
   describes process and ownership.

---

## 7. State legal deltas (content, verified June 2026)

General statutory baselines, not Vanderbilt policy and not legal review.
- **TN**: at-will baseline; final pay by next regular payday; workers' comp
  anti-retaliation.
- **NY**: final pay by next payday (accrued vacation paid unless policy says
  otherwise); §195 wage notice; §198 liquidated/double damages for late/short
  pay; lawful off-duty conduct protected; 5-day post-termination written notice;
  severance non-disparagement can't bar discussing harassment/assault.
- **FL**: closest to TN; no state final-pay timing statute (FLSA, next payday);
  strong private-sector Whistleblower's Act §448.101; FCRA mirrors federal
  classes; no pay-transparency/salary-history ban.
- **CA** (urgent): final pay due **immediately** at termination (§201), waiting-
  time penalties up to 30 days (§203); FEHA broader classes at 5+ employees;
  off-duty cannabis, reproductive-health, political affiliation protected;
  mandatory harassment training; stay-or-pay recoupment void as of Jan 2026.

---

## 8. Out of scope (roadmap, not in this build)

- Free-text AI intake (user describes the situation in prose; Claude API
  suggests lane and pre-fires hard stops, human confirms). Requires a small
  backend to hold the API key — never client-side.
- Real Vanderbilt internal policy/EOA intake links.
- Persisted case records / audit log.

These must not be implemented without an explicit request; the current product
is a deterministic, human-in-the-loop guided flow.
