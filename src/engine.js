// Decision engine. This is where the guardrails live and are enforced in code,
// not just in the UI:
//
//   1. The legal screen (hard stops) ALWAYS runs before classification.
//   2. Counsel/OGC is never returned as a direct contact — routing to it is
//      always paired with a direct-contact human who loops them in.
//   3. Every plan ends with a route-to-a-human step.
//
// Keep this module UI-free so it can be unit-tested (see engine.test.js).

import { hardStops, getLane, recommendLadderStart } from './data/classification.js'
import { getState } from './data/states.js'
import { getRole, isDirectContact } from './data/roles.js'

// --- Step 1: the legal screen -------------------------------------------------

// Returns the hard stops whose flag the user checked. This is intentionally a
// pure function of the flags so it is trivial to test and impossible to skip.
export function screenForHardStops(flags = {}) {
  return hardStops.filter((hs) => flags[hs.id])
}

// --- Routing helpers ----------------------------------------------------------

// A human you may contact directly. We use this both to render contacts and to
// guarantee the final step of every plan is a real person.
const PRIMARY_HUMAN = 'hrbp'

// Given a list of desired role ids, expand them so that any non-direct role
// (counsel/OGC) is always accompanied by a direct-contact human who reaches
// them. Returns role ids with direct-contact humans guaranteed present.
function normalizeRouting(roleIds) {
  const ids = [...new Set(roleIds)]
  const hasDirectHuman = ids.some((id) => isDirectContact(id))
  if (!hasDirectHuman) ids.unshift(PRIMARY_HUMAN)
  return ids
}

// Build the final, mandatory "route to a human" step. Always appended last.
function humanRouteStep(roleIds) {
  const routed = normalizeRouting(roleIds)
  const directHumans = routed.filter(isDirectContact).map((id) => getRole(id).label)
  const primary = directHumans[0] || getRole(PRIMARY_HUMAN).label
  return {
    kind: 'route',
    title: 'Route to a person before acting',
    text: `Bring this to your ${primary}. They own the decision with you and pull in anyone else (including counsel) as needed. This tool is decision support, not approval to act.`,
    roleIds: routed,
  }
}

// --- Step 2 + assembly: build the plan ---------------------------------------

export function buildPlan({ stateId, flags = {}, laneId = null, hasPriorDiscipline = false } = {}) {
  const state = getState(stateId)

  // GUARDRAIL 1: legal screen runs first, unconditionally.
  const triggered = screenForHardStops(flags)

  if (triggered.length > 0) {
    // Hard stop: do NOT classify. Surface the legal issues and route to humans
    // (who will involve counsel). Classification is deliberately withheld.
    const routeTo = triggered.flatMap((hs) => hs.routeTo)
    const steps = [
      {
        kind: 'stop',
        title: 'Stop — legal review needed before classifying',
        text:
          'One or more legal hard stops apply. Do not classify this as routine discipline or take action on your own yet.',
      },
      ...triggered.map((hs) => ({
        kind: 'stop-detail',
        title: hs.label,
        text: hs.catches,
      })),
      humanRouteStep(routeTo), // GUARDRAIL 3: always ends on a human.
    ]
    return {
      status: 'hard-stop',
      state,
      hardStops: triggered,
      classification: null, // intentionally absent until a human clears it
      steps,
    }
  }

  // No hard stops → proceed to classification (only now).
  const lane = laneId ? getLane(laneId) : null
  const ladderStep = lane ? recommendLadderStart(lane.id, hasPriorDiscipline) : null

  const steps = []
  steps.push({
    kind: 'ok',
    title: 'No legal hard stops flagged',
    text: 'Based on what you entered, the legal screen did not flag a hard stop. Proceed with care and document your reasoning.',
  })

  if (lane && ladderStep) {
    steps.push({
      kind: 'classify',
      title: `Lane: ${lane.label}`,
      text: lane.description,
    })
    steps.push({
      kind: 'ladder',
      title: `Suggested step: ${ladderStep.label}`,
      text: ladderStep.summary,
    })
  } else {
    steps.push({
      kind: 'classify',
      title: 'Pick a lane to get a suggested next step',
      text: 'Choose the kind of issue so the tool can suggest a starting point on the discipline ladder.',
    })
  }

  steps.push({
    kind: 'state',
    title: `${state.label}: at-will & timing`,
    text: state.atWill,
  })
  steps.push({
    kind: 'state',
    title: `${state.label}: final pay`,
    text: state.finalPay,
  })

  // GUARDRAIL 3: every plan ends on a route-to-a-human step.
  const routeTo = ladderStep && ladderStep.id === 'termination' ? ['hrbp', 'er-specialist'] : ['hrbp']
  steps.push(humanRouteStep(routeTo))

  return {
    status: 'proceed',
    state,
    hardStops: [],
    classification: lane && ladderStep ? { lane, ladderStep } : null,
    steps,
  }
}
