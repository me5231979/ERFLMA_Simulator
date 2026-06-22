// Who to route to.
//
// GUARDRAIL: The Office of the General Counsel (OGC) must NEVER render as a
// direct contact. Counsel is reached THROUGH a person — an HRBP or ER
// specialist loops them in. Any role with `directContact: false` is rendered
// without contact details and only as a "your HR partner will involve them"
// note. The engine and the UI both enforce this.
//
// Fill in real names, emails, and links in the `who` field for your org.

export const roles = [
  {
    id: 'hrbp',
    label: 'HR Business Partner (HRBP)',
    directContact: true,
    blurb:
      'Your first call for most situations. Owns the plan with you and pulls in specialists or counsel as needed.',
    who: {
      name: 'TODO — assign HRBP',
      email: 'todo-hrbp@vanderbilt.edu',
      link: '',
    },
  },
  {
    id: 'er-specialist',
    label: 'Employee Relations Specialist',
    directContact: true,
    blurb:
      'Handles investigations, complaints, and complex conduct matters. Engage early when facts are contested.',
    who: {
      name: 'TODO — assign ER specialist',
      email: 'todo-er@vanderbilt.edu',
      link: '',
    },
  },
  {
    id: 'leave-team',
    label: 'Leave / Accommodation Team',
    directContact: true,
    blurb:
      'Manages FMLA, ADA accommodations, and related protected leave. Loop in whenever leave is in play.',
    who: {
      name: 'TODO — assign leave/accommodation contact',
      email: 'todo-leave@vanderbilt.edu',
      link: '',
    },
  },
  {
    id: 'employment-counsel',
    label: 'Employment Counsel (via OGC)',
    // NEVER a direct contact — reached only through HR/ER.
    directContact: false,
    blurb:
      'Legal review for hard-stop situations. Reached THROUGH your HRBP or ER specialist — not contacted directly.',
    who: {
      // No direct contact info is rendered for this role by design.
      name: null,
      email: null,
      link: '',
    },
  },
]

export function getRole(id) {
  return roles.find((r) => r.id === id) || null
}

// Returns true only for roles a user may contact directly. Used by the UI so
// OGC/counsel never renders with contact details.
export function isDirectContact(id) {
  const r = getRole(id)
  return !!(r && r.directContact)
}
