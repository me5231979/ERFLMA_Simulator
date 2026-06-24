// Content layer for the ER & Discipline Simulator — editable without touching
// components or engine logic. Verified state deltas current to June 2026.
// Decision support, not legal advice.

export const ROLES = {
  HCM: { name: 'HCM', desc: 'Local division HR rep. First stop for everyday questions.', who: 'Your division HCM' },
  EC: { name: 'Engagement Consultant', desc: 'Your HR business partner. Owns active cases and coaches managers.', who: 'Your Engagement Consultant' },
  ER: { name: 'ER / FMLA Team', desc: 'Central Employee Relations and leave specialists. Required at final steps and for all leave matters.', who: 'Employee Relations / FMLA' },
  EOA: { name: 'EOA', desc: 'Equal Opportunity & Access. Owns Title IX, protected-class complaints, and anything involving a student.', who: 'Equal Opportunity & Access' },
  // OGC is INDIRECT — never rendered as a direct "contact this person" instruction.
  OGC: { name: 'Office of General Counsel', desc: 'Brought in by ER or EOA when needed. Not contacted directly by a manager or individual.', who: 'Brought in by ER/EOA — not contacted directly', indirect: true },
  VUPD: { name: 'VUPD', desc: 'Campus police. For danger, threats, weapons, or suspected law-breaking.', who: 'VUPD — call first if anyone is unsafe' },
  EAP: { name: 'Employee Assistance', desc: 'Confidential wellbeing and counseling support.', who: 'Employee Assistance Program' },
}

export const STATES = {
  TN: {
    code: 'TN', name: 'Tennessee',
    atWill: 'At-will. Employment may end by either party at any time for any lawful reason.',
    finalPay: 'Final wages by the next regular payday (TN Code §50-2-103).',
    urgent: false,
    deltas: [
      'Baseline at-will state; federal protections (Title VII, ADA, ADEA, FMLA) still govern.',
      "Workers' comp anti-retaliation applies — never discipline near a comp claim without ER.",
    ],
  },
  NY: {
    code: 'NY', name: 'New York',
    atWill: 'At-will, but with strong wage, notice, and off-duty-conduct protections.',
    finalPay: 'Final wages by the next regular payday (NY Labor Law §191). Accrued vacation paid out unless a written policy clearly says otherwise.',
    urgent: false,
    deltas: [
      'Wage notice / pay-transparency rules (§195) — confirm documentation with ER.',
      'Late or short final pay can trigger liquidated (double) damages under §198.',
      'Lawful off-duty conduct is protected — do not discipline for legal activity outside work.',
      'Written notice to the employee is required within 5 days of termination.',
      'Severance non-disparagement cannot bar discussing harassment or assault.',
    ],
  },
  FL: {
    code: 'FL', name: 'Florida',
    atWill: 'At-will, employer-friendly. Closest to the Tennessee baseline.',
    finalPay: 'No state timing statute — follow FLSA and pay by the next regular payday.',
    urgent: false,
    deltas: [
      "Private-Sector Whistleblower's Act (§448.101–105) — strong retaliation exposure; route whistleblower angles to ER.",
      'Florida Civil Rights Act (Ch. 760) mirrors federal protected classes; complaints go to EOA.',
      'No state pay-transparency or salary-history ban.',
    ],
  },
  CA: {
    code: 'CA', name: 'California',
    atWill: 'At-will in name, but the most employee-protective state. Treat every step as high-scrutiny.',
    finalPay: 'Final pay due IMMEDIATELY at termination, at the place of termination (Labor Code §201). Late pay triggers waiting-time penalties up to 30 days’ wages (§203).',
    urgent: true,
    deltas: [
      'FEHA covers more protected classes than federal law and applies at 5+ employees; harassment protection applies regardless of size.',
      'Off-duty cannabis use, reproductive-health decisions, and political affiliation are protected.',
      'Mandatory harassment-prevention training (supervisors 2 hrs, staff 1 hr, every 2 yrs).',
      'Final pay must be ready the day of termination — coordinate payroll and ER in advance.',
      "'Stay-or-pay' training-cost recoupment is void as of Jan 2026.",
    ],
  },
}

export const RESOURCES = {
  federal: [
    { org: 'SHRM', title: 'How to Administer a Progressive Discipline Policy', url: 'https://www.shrm.org/topics-tools/tools/how-to-guides/how-to-administer-progressive-discipline-policy', note: 'Step-by-step guide to running a progressive discipline system.' },
    { org: 'SHRM', title: 'Documentation: The Fine Art of Discipline Write-Ups', url: 'https://www.shrm.org/topics-tools/news/employee-relations/discipline-fine-art-documentation', note: 'What each disciplinary step should document, and how.' },
    { org: 'SHRM', title: 'When to Skip Progressive Discipline', url: 'https://www.shrm.org/topics-tools/employment-law-compliance/one-done-to-skip-progressive-discipline', note: 'When serious misconduct justifies moving straight to termination.' },
    { org: 'EEOC', title: 'Retaliation & Protected Activity', url: 'https://www.eeoc.gov/retaliation', note: 'What counts as protected activity and unlawful retaliation.' },
    { org: 'EEOC', title: 'Harassment — Employer Guidance', url: 'https://www.eeoc.gov/harassment', note: 'Landing page. The 2024 enforcement guidance was rescinded Jan 2026; underlying law and Supreme Court precedent still apply.' },
    { org: 'U.S. DOL', title: 'FMLA — Wage and Hour Division', url: 'https://www.dol.gov/agencies/whd/fmla', note: 'Authoritative FMLA leave rights and employer obligations.' },
  ],
  TN: [
    { org: 'TN Dept. of Labor', title: 'Labor Laws & Wage Regulations', url: 'https://www.tn.gov/workforce/employees/labor-laws.html', note: 'Tennessee wage payment and labor standards.' },
  ],
  NY: [
    { org: 'NY DOL', title: 'Wages & Hours FAQ', url: 'https://dol.ny.gov/wages-and-hours-frequently-asked-questions', note: 'Final-pay timing, §191 / §198 wage rules.' },
    { org: 'NY Div. of Human Rights', title: 'Employment Discrimination', url: 'https://dhr.ny.gov/employment', note: 'NYSHRL protected classes and complaint process.' },
  ],
  FL: [
    { org: 'FL Comm. on Human Relations', title: 'Employment Discrimination (FCRA)', url: 'https://fchr.myflorida.com/', note: 'Florida Civil Rights Act complaints and protected classes.' },
    { org: 'U.S. DOL', title: 'Florida Wage & Hour', url: 'https://www.dol.gov/agencies/whd/state/florida', note: 'Florida defers to FLSA for final-pay timing.' },
  ],
  CA: [
    { org: 'CA Civil Rights Dept.', title: 'Employment Discrimination & Harassment (FEHA)', url: 'https://calcivilrights.ca.gov/employment/', note: 'FEHA protected classes and mandatory harassment training.' },
    { org: 'CA DIR / DLSE', title: 'Final Pay & Waiting-Time Penalties', url: 'https://www.dir.ca.gov/dlse/faq_paydays.htm', note: 'Immediate final pay at termination; §201 / §203 penalties.' },
  ],
}

export const HARD_STOPS = [
  { id: 'protected_class', label: 'Protected-class treatment or bias', desc: 'Conduct or a complaint touching race, color, religion, sex (including sexual orientation & gender identity), national origin, age (40+), disability, pregnancy, or genetic information.', route: ['EOA', 'EC'], law: 'Title VII (incl. Bostock), ADEA, ADA, GINA, PDA/PWFA (+ FCRA in FL, FEHA in CA, NYSHRL in NY)' },
  { id: 'harassment_violence', label: 'Harassment, threats, or violence', desc: 'Sexual or other harassment, threats, intimidation, weapons, or any physical violence.', route: ['EOA', 'ER', 'VUPD'], law: 'Title VII, Title IX, Clery, VU Workplace Violence policy' },
  { id: 'student_involved', label: 'A student is involved', desc: 'The situation involves a student in any capacity — as a party, witness, or subject (including student employees).', route: ['EOA'], law: 'Title IX — EOA owns anything involving a student' },
  { id: 'disability_accommodation', label: 'Disability or accommodation signal', desc: 'A stated or apparent disability, an accommodation request, pregnancy or a related condition, or conduct that may stem from a medical condition — including a "regarded-as" perception.', route: ['ER', 'EC'], law: 'ADA/ADAAA interactive process; PWFA (pregnancy accommodation) & PUMP Act (lactation); FEHA broader in CA' },
  { id: 'leave_interference', label: 'Leave or medical interference', desc: "Anything touching FMLA, parental, medical, military (USERRA), or workers' comp leave — including discipline timed near a leave request. Protected absences can't count against attendance, and the employee is owed reinstatement to the same or an equivalent job.", route: ['ER', 'EC'], law: 'FMLA, USERRA, workers’ comp anti-retaliation (CFRA / PDL in CA)' },
  { id: 'concerted_activity', label: 'Concerted or protected activity', desc: 'Complaints about pay, hours, or conditions (by a group, or one person acting for the group); union activity; whistleblowing; or reporting a legal/safety violation. Protected even with no union.', route: ['ER', 'EC'], law: 'NLRA §7 (no union required); FLSA pay complaints; OSHA §11(c); whistleblower statutes (esp. FL §448.101)' },
  { id: 'criminal', label: 'Potential criminal conduct', desc: 'Theft, fraud, assault, drugs, or anything that may be a crime.', route: ['VUPD', 'ER'], law: 'Refer per VU policy — do not investigate alone' },
  { id: 'retaliation', label: 'Possible retaliation', desc: 'Discipline that follows soon after the employee complained, reported, or asserted a right.', route: ['ER', 'EC'], law: 'Cross-statute retaliation protections' },
  { id: 'offduty', label: 'Off-duty / lawful outside-work conduct', desc: 'Discipline based on something the employee did legally outside of work (social media, politics, legal substances).', route: ['ER', 'EC'], law: 'Protected in NY (off-duty conduct) and CA (cannabis, politics, reproductive health)' },
]

export const LANES = {
  PERFORMANCE: { id: 'PERFORMANCE', name: 'Performance', blurb: 'Capability or results gaps — missed goals, quality, productivity. Progressive discipline applies; lead with coaching.', progressive: true, route: ['HCM', 'EC'] },
  CONDUCT: { id: 'CONDUCT', name: 'Conduct / Policy', blurb: 'Behavior or rule violations — attendance, insubordination, policy breach. Progressive discipline applies; severity sets entry.', progressive: true, route: ['EC'] },
  SERIOUS: { id: 'SERIOUS', name: 'Serious Misconduct', blurb: 'Conduct that may justify skipping steps up to immediate separation. ER co-owns the decision — never self-serve.', progressive: false, route: ['EC', 'ER'] },
  PROTECTED: { id: 'PROTECTED', name: 'Protected / Legal Risk', blurb: 'A hard stop fired. This does not go through the ladder. Route to a person before any action.', progressive: false, route: [] },
}

export const LADDER = [
  { step: 1, name: 'Coaching / Verbal Counseling', purpose: 'Make the expectation explicit and give a real chance to correct.', doc: 'Manager note to file: date, what was discussed, expectation, follow-up date. Not a formal warning.', owner: 'Manager, HCM available' },
  { step: 2, name: 'Written Warning', purpose: 'Formalize the gap and the required change in writing.', doc: 'Specific facts, standard cited, expectation, timeline, consequence of no change. Employee acknowledges.', owner: 'Manager + Engagement Consultant' },
  { step: 3, name: 'Final Written Warning / PIP', purpose: 'Last clear opportunity to correct before separation.', doc: 'Measurable goals, check-in cadence, end date. ER review required before issuing.', owner: 'Engagement Consultant + ER' },
  { step: 4, name: 'Termination Recommendation', purpose: 'Separation when prior steps did not produce change.', doc: 'Documented history, comparator/consistency check, state final-pay plan, sign-off. Manager does not execute alone.', owner: 'ER + Engagement Consultant' },
]

export const SEVERITY = [
  { id: 'minor', label: 'Minor / first instance', entry: 1 },
  { id: 'moderate', label: 'Moderate or repeated', entry: 2 },
  { id: 'serious', label: 'Serious / prior warnings exist', entry: 3 },
]

// Plain-language coaching paragraph shown on the plan/report, by plan path and
// by who is reading (manager vs employee). Edit freely — this is guidance copy,
// not legal text.
export const COACHING = {
  protected: {
    manager:
      'Take a breath before you do anything else. A protected-status signal came up, so the fair and safe move is to pause discipline and bring in the right partner — you are not in trouble for flagging this; escalating early is exactly what a good manager does. Stick to documenting what you actually observed in neutral, factual language, keep the person’s schedule and duties unchanged while it’s open, and let EOA or ER steer the next step. Do not promise an outcome or investigate on your own.',
    employee:
      'You do not have to navigate this alone. What you have described may involve protected rights, and you have the right to report it and to be free from retaliation for doing so. Write down what happened — dates, what was said, who was there — reach out to the first contact listed, and remember the Employee Assistance Program is there for confidential support. Nothing is decided here; this is about getting you to the people who can help.',
  },
  serious: {
    manager:
      'Serious does not mean rushed. Make sure everyone is safe first, then deliberately slow the decision down: write down the facts while they are fresh, consider paid administrative leave rather than acting in the moment, and loop in your Engagement Consultant and ER before any outcome. Ask yourself how comparable situations were handled so the response stays consistent. You gather and document; ER co-owns the decision — acting alone is the biggest risk.',
    employee:
      'This is a serious situation, and it is reasonable to feel unsettled. Focus on what you can control: write down the facts as you remember them, cooperate with the people reviewing it, and use the Employee Assistance Program for support. You are entitled to a fair, consistent process, and decisions here are shared — not made on the spot by one person.',
  },
  ladder: {
    manager:
      'The point of progressive discipline is to help the person succeed, not to build a case against them. Be specific and humane: name the exact gap, the standard you expect, and a realistic timeline to improve, and put it in writing so there are no surprises. Lead with a real conversation, document observable facts rather than impressions, and stay consistent with how you have handled similar situations. Most issues turn around when expectations are made clear early — and your Engagement Consultant is there before any written step.',
    employee:
      'This is meant to be a clear, fair path to get back on track — not a trap. You should expect specific feedback about what needs to change, a reasonable chance and timeline to improve, and consistency with how others are treated. Ask questions, take notes, and use the support that is offered, including your Engagement Consultant. If anything about the process feels retaliatory or unfair, you can raise it.',
  },
}
