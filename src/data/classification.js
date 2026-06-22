// Hard stops (the legal screen), lanes, and the disciplinary ladder.
//
// IMPORTANT GUARDRAIL: hard stops are screened BEFORE any lane/ladder
// classification. The engine (src/engine.js) enforces this ordering — do not
// move classification ahead of the legal screen.
//
// Hard stops do NOT mean "you cannot act." They mean "stop, do not proceed on
// your own, route to a human (and counsel via that human) before classifying
// or disciplining." Each hard stop routes to a role; counsel is reached
// THROUGH a person (see roles.js), never as a direct contact.

export const hardStops = [
  {
    id: 'protected-leave',
    label: 'Protected leave is involved (FMLA, ADA accommodation, pregnancy, military/USERRA)',
    catches:
      'Discipline timed around a protected leave or accommodation request can look like interference or retaliation.',
    routeTo: ['hrbp', 'employment-counsel'],
  },
  {
    id: 'recent-complaint',
    label: 'Employee recently raised a complaint (discrimination, harassment, safety, wage)',
    catches:
      'Adverse action close in time to protected activity is a classic retaliation risk and must be reviewed before proceeding.',
    routeTo: ['er-specialist', 'employment-counsel'],
  },
  {
    id: 'protected-class',
    label: 'The concern may relate to a protected characteristic (race, sex, age, disability, religion, national origin, etc.)',
    catches:
      'If the underlying issue touches a protected class, classification could mask a discrimination problem.',
    routeTo: ['er-specialist', 'employment-counsel'],
  },
  {
    id: 'whistleblower',
    label: 'Employee reported illegal conduct or refused to participate in it (whistleblower / public policy)',
    catches:
      'Discharge or discipline tied to protected refusal/reporting is a statutory hard stop in many states.',
    routeTo: ['hrbp', 'employment-counsel'],
  },
  {
    id: 'concerted-activity',
    label: 'Activity may be concerted/union-related (discussing pay, conditions, organizing)',
    catches:
      'Protected concerted activity under the NLRA can apply even without a union; disciplining it is unlawful.',
    routeTo: ['hrbp', 'employment-counsel'],
  },
  {
    id: 'investigation-open',
    label: 'There is an open investigation, legal hold, charge, or pending litigation',
    catches:
      'Acting unilaterally can spoliate evidence or undercut a pending matter.',
    routeTo: ['er-specialist', 'employment-counsel'],
  },
  {
    id: 'contract-visa',
    label: 'Employee has a contract, visa/immigration status, or other special status',
    catches:
      'Contractual or immigration terms can override default at-will handling and timing.',
    routeTo: ['hrbp', 'employment-counsel'],
  },
]

// Lanes: the kind of issue. Classification only runs after the legal screen.
export const lanes = [
  {
    id: 'performance',
    label: 'Performance',
    description:
      'Falling short of clear, communicated job expectations (quality, productivity, missed goals).',
    defaultLadderStart: 'coaching',
  },
  {
    id: 'attendance',
    label: 'Attendance / reliability',
    description:
      'Tardiness, absenteeism, no-call/no-show, schedule adherence — where no protected leave applies.',
    defaultLadderStart: 'verbal',
  },
  {
    id: 'conduct',
    label: 'Conduct / behavior',
    description:
      'Policy violations, unprofessional behavior, insubordination, disruptive conduct.',
    defaultLadderStart: 'verbal',
  },
  {
    id: 'integrity-safety',
    label: 'Integrity / safety (serious)',
    description:
      'Theft, falsification, violence/threats, serious safety violations, harassment as a respondent.',
    defaultLadderStart: 'final',
  },
]

// The progressive discipline ladder, in order. `order` drives the engine.
export const ladder = [
  {
    id: 'coaching',
    order: 0,
    label: 'Coaching / expectation reset',
    summary:
      'Documented conversation clarifying expectations and the gap. Not formal discipline.',
  },
  {
    id: 'verbal',
    order: 1,
    label: 'Verbal warning (documented)',
    summary: 'First formal step. Note the issue, expectation, and timeframe to improve.',
  },
  {
    id: 'written',
    order: 2,
    label: 'Written warning',
    summary: 'Formal written notice with specific examples, expectations, and consequences.',
  },
  {
    id: 'final',
    order: 3,
    label: 'Final written warning / PIP',
    summary:
      'Last-chance notice or performance improvement plan with a defined review period.',
  },
  {
    id: 'suspension',
    order: 4,
    label: 'Suspension (often investigatory)',
    summary:
      'Paid/unpaid hold while facts are gathered or as a serious-conduct consequence.',
  },
  {
    id: 'termination',
    order: 5,
    label: 'Separation / termination',
    summary:
      'Ending employment. Always requires HR/ER review and approval before it happens.',
  },
]

export function getLane(id) {
  return lanes.find((l) => l.id === id) || null
}

export function getLadderStep(id) {
  return ladder.find((s) => s.id === id) || null
}

// Given a lane and whether prior discipline exists, recommend a starting step.
export function recommendLadderStart(laneId, hasPriorDiscipline) {
  const lane = getLane(laneId)
  if (!lane) return getLadderStep('coaching')
  const start = getLadderStep(lane.defaultLadderStart)
  if (!hasPriorDiscipline) return start
  // With prior discipline on record, advance one rung (capped before termination,
  // which always needs explicit HR/ER approval rather than auto-recommendation).
  const next = ladder.find((s) => s.order === Math.min(start.order + 1, 4))
  return next || start
}
