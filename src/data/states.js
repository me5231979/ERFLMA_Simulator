// State-aware legal language and operational notes.
//
// This is decision-support content, NOT legal advice, and is intentionally
// conservative. Update the language with counsel-reviewed text before relying
// on it. `id` is the stable key; `label` is what users see.
//
// Tennessee (TN) is the default because Vanderbilt / FLH operates there.
// `other` is a deliberately cautious fallback for any unlisted jurisdiction.

export const DEFAULT_STATE = 'TN'

export const states = [
  {
    id: 'TN',
    label: 'Tennessee',
    atWill:
      'Tennessee is an at-will employment state. Employment may end at any time, by either party, for any lawful reason or no reason — but not for an unlawful reason (e.g., discrimination, retaliation for protected activity, or exercising a legal right).',
    finalPay:
      'Final wages are generally due by the next regular payday or within 21 days of separation, whichever is later (Tenn. Code Ann. § 50-2-103).',
    notes: [
      'Tennessee Public Protection Act protects employees discharged solely for refusing to participate in or remain silent about illegal activity.',
      'THRA (Tennessee Human Rights Act) mirrors federal anti-discrimination protections and can apply to smaller employers.',
      'Document the legitimate, non-discriminatory business reason for any adverse action contemporaneously.',
    ],
    // Optional escalation hook: situations in these states never auto-clear the
    // legal screen without a human in the loop. (All states already require a
    // human; this is just for surfacing extra caution.)
    heightenedCaution: false,
  },
  {
    id: 'CA',
    label: 'California',
    atWill:
      'California is at-will by statute (Cal. Lab. Code § 2922), but courts recognize significant exceptions (implied contract, public policy). At-will language alone does not insulate an unlawful action.',
    finalPay:
      'Final pay rules are strict: employees who are terminated are due all wages immediately; employees who quit with 72+ hours notice are due at separation. Late final pay can trigger waiting-time penalties.',
    notes: [
      'California has broad anti-retaliation and leave protections beyond federal law (CFRA, paid sick leave, etc.).',
      'Treat any performance/conduct action near a protected leave or complaint as heightened risk.',
    ],
    heightenedCaution: true,
  },
  {
    id: 'NY',
    label: 'New York',
    atWill:
      'New York is an at-will state, with anti-discrimination and anti-retaliation protections under the NY State and (where applicable) NYC Human Rights Laws, which are broader than federal law.',
    finalPay:
      'Final wages are generally due by the next regular payday.',
    notes: [
      'NYC and NY State Human Rights Laws define "discrimination" and "retaliation" broadly; thresholds for liability are lower than federal.',
    ],
    heightenedCaution: true,
  },
  {
    id: 'other',
    label: 'Other / not listed',
    atWill:
      'Most U.S. states follow at-will employment with exceptions for unlawful reasons. Because this jurisdiction is not configured here, treat all state-specific timing and notice requirements as unknown.',
    finalPay:
      'Final-pay timing is unknown for this jurisdiction. Confirm the deadline before processing separation pay.',
    notes: [
      'State-specific protections are not configured — do not assume Tennessee rules apply.',
      'Route to HR/ER to confirm jurisdictional requirements before acting.',
    ],
    heightenedCaution: true,
  },
]

export function getState(id) {
  return states.find((s) => s.id === id) || states.find((s) => s.id === 'other')
}
