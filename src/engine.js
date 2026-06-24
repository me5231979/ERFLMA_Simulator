// Pure decision logic for the simulator. UI-free so the guardrails are
// unit-tested in engine.test.js. The five guardrails (see CLAUDE.md / PRD §6):
//   1. The legal screen runs BEFORE classification — a hard stop short-circuits
//      to the protected plan; the ladder is unreachable while one is active.
//   2. OGC never renders as a direct contact (ROLES.OGC.indirect === true).
//   3. Every plan ends routed to a direct-contact human.
//   4. California surfaces immediate-final-pay warnings on any termination path.
//   5. The tool never authorizes a termination; it describes process + ownership.

import { HARD_STOPS, SEVERITY, PRIOR_DISCIPLINE, ROLES } from './data/erData.js'

// Triggers that pull in OGC (legally heavy) — counsel is brought in via ER/EOA.
const LEGAL_HEAVY = ['protected_class', 'harassment_violence', 'criminal', 'retaliation']
// Triggers that mean "call VUPD first if anyone is unsafe."
const DANGER = ['criminal', 'harassment_violence']

// Step 1: the legal screen. Pure function of the checked ids — impossible to skip.
export function screenForHardStops(triggeredIds = []) {
  return HARD_STOPS.filter((h) => triggeredIds.includes(h.id))
}

export const hasHardStop = (triggeredIds = []) => triggeredIds.length > 0
export const isLegalHeavy = (triggeredIds = []) => triggeredIds.some((t) => LEGAL_HEAVY.includes(t))
export const isDanger = (triggeredIds = []) => triggeredIds.some((t) => DANGER.includes(t))

// Ordered, de-duplicated role keys derived from the triggered hard stops.
export function routedRoles(triggeredIds = []) {
  const seen = []
  triggeredIds.forEach((tid) => {
    HARD_STOPS.find((h) => h.id === tid)?.route.forEach((r) => {
      if (!seen.includes(r)) seen.push(r)
    })
  })
  return seen
}

// The full, ordered routing list for the protected plan, including the indirect
// OGC card (when legally heavy) and EAP (employee side).
export function protectedRouting(triggeredIds = [], role = 'manager') {
  const list = [...routedRoles(triggeredIds)]
  if (isLegalHeavy(triggeredIds)) list.push('OGC')
  if (role === 'employee') list.push('EAP')
  return list
}

// Ladder entry step. Driven by BOTH the current issue's severity (a floor) and
// any ACTIVE prior discipline (advance one rung past the last documented step).
// Capped before Termination, which always needs explicit ER sign-off.
export function entryStepFor(severityId, priorId = 'none') {
  const floor = SEVERITY.find((s) => s.id === severityId)?.entry ?? 1
  const prior = PRIOR_DISCIPLINE.find((p) => p.id === priorId)?.level ?? 0
  return Math.min(Math.max(floor, prior + 1), 4)
}

// Entering above Step 1 should not happen on a manager's say-so alone.
export const requiresErConcurrence = (entryStep) => entryStep > 1

// GUARDRAIL 1: classification is gated behind the legal screen.
// Returns which plan a given screen+lane resolves to.
export function planPathFor({ triggeredIds = [], lane = null } = {}) {
  if (hasHardStop(triggeredIds)) return 'protected' // hard stop wins, ladder unreachable
  if (lane === 'SERIOUS') return 'serious'
  if (lane === 'PERFORMANCE' || lane === 'CONDUCT') return 'ladder'
  return null
}

export const isDirectContact = (roleKey) => !!ROLES[roleKey] && !ROLES[roleKey].indirect
