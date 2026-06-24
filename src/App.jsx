import { useState, useMemo } from 'react'
import { GOLD, INK, PAPER, LINE, STOP, GOLD_GRADIENT } from './theme.js'
import { ROLES, STATES, RESOURCES, HARD_STOPS, LANES, LADDER, SEVERITY } from './data/erData.js'
import { routedRoles, isLegalHeavy, isDanger, entryStepFor } from './engine.js'
import vanderbiltLogo from './assets/vanderbilt-horizontal.png'

// FLH (Futures Learning Hub) Employee Relations & Progressive Discipline
// Simulator. Decision support, not legal advice. Verified state deltas, June 2026.
// Guardrails live in engine.js and are covered by engine.test.js.

export default function App() {
  const [stage, setStage] = useState('intro')
  const [role, setRole] = useState(null)
  const [stateCode, setStateCode] = useState(null)
  const [triggered, setTriggered] = useState([])
  const [lane, setLane] = useState(null)
  const [severity, setSeverity] = useState(null)

  const st = stateCode ? STATES[stateCode] : null
  const hardStop = triggered.length > 0
  const entryStep = entryStepFor(severity)

  const reset = () => { setStage('intro'); setRole(null); setStateCode(null); setTriggered([]); setLane(null); setSeverity(null) }
  const toggle = (id) => setTriggered((t) => (t.includes(id) ? t.filter((x) => x !== id) : [...t, id]))

  const routed = useMemo(() => routedRoles(triggered), [triggered])

  const steps = ['Role', 'State', 'Screen', 'Classify', 'Plan']
  const order = ['intro', 'state', 'screen', 'classify', 'plan']

  return (
    <div style={s.page}>
      <style>{`*{box-sizing:border-box}button{font-family:inherit;cursor:pointer;transition:all .15s}button:disabled{cursor:not-allowed}button:focus-visible,a:focus-visible{outline:2px solid ${GOLD};outline-offset:2px}a:hover{border-color:${GOLD}!important;background:#FAF6EC!important}.opt:hover{border-color:${STOP}!important;background:#FCF6F5!important}@media(max-width:640px){.frm{padding:24px 16px 64px!important}}@media(prefers-reduced-motion:reduce){*{transition:none!important}}`}</style>
      <div style={s.frame} className="frm">
        <header style={{ marginBottom: 26 }}>
          <img src={vanderbiltLogo} alt="Vanderbilt University" style={s.logo} />
          <div style={s.rule} />
          <div style={s.eyebrow}>Futures Learning Hub · Employee Relations</div>
          <h1 style={s.h1}>Discipline & ER <span style={s.ital}>Simulator</span></h1>
          <p style={s.sub}>Process and policy guidance — not legal advice. The system routes risk to the right person, adjusts to your work state, and never clears a separation on its own.</p>
        </header>

        <div style={s.rail} className="no-print">
          {steps.map((x, i) => {
            const on = order.indexOf(stage) >= i
            return (
              <div key={x} style={s.railItem}>
                <span style={{ ...s.dot, ...(on ? s.dotOn : {}) }}>{i + 1}</span>
                <span style={{ ...s.railLbl, opacity: on ? 1 : 0.4 }}>{x}</span>
              </div>
            )
          })}
        </div>

        {stage === 'intro' && (
          <Card>
            <h2 style={s.h2}>Who is describing the situation?</h2>
            <p style={s.body}>Manager view returns process and next steps. Employee view focuses on rights, reporting, and support.</p>
            <div style={s.row}>
              {[['manager', "I'm a manager", 'Handling a direct report'], ['employee', "I'm an employee", 'Reporting or seeking help']].map(([id, t, d]) => (
                <button key={id} style={{ ...s.choice, ...(role === id ? s.choiceOn : {}) }} onClick={() => setRole(id)}>
                  <span style={s.choiceT}>{t}</span><span style={s.choiceD}>{d}</span>
                </button>
              ))}
            </div>
            <Nav next={() => setStage('state')} nextOff={!role} nextLbl="Continue" />
          </Card>
        )}

        {stage === 'state' && (
          <Card>
            <h2 style={s.h2}>What state is this situation taking place in?</h2>
            <p style={s.body}>The employee's work location sets which laws apply. This changes final-pay timing, protected categories, and required notices.</p>
            <div style={s.stateGrid}>
              {Object.values(STATES).map((x) => (
                <button key={x.code} onClick={() => setStateCode(x.code)} style={{ ...s.stateBtn, ...(stateCode === x.code ? s.selOn : {}) }}>
                  <span style={s.stateCode}>{x.code}</span>
                  <span style={s.stateName}>{x.name}</span>
                  {x.urgent && <span style={s.stateFlag}>Immediate final pay</span>}
                </button>
              ))}
            </div>
            {st && <div style={s.note}><strong>{st.name}:</strong> {st.atWill}</div>}
            <Nav back={() => setStage('intro')} next={() => setStage('screen')} nextOff={!stateCode} nextLbl="Start screening" />
          </Card>
        )}

        {stage === 'screen' && (
          <Card>
            <h2 style={s.h2}>Safety & legal screen</h2>
            <p style={s.body}>Check any that may apply — even slightly. <strong>If none of them fit, that's fine</strong> — you'll go straight to classifying. These checks just take priority over discipline, so over-routing to a person is the safe error.</p>
            <div style={s.selectHint}>
              <span style={s.selectHintTxt}>Optional · select all that apply, or none</span>
              {triggered.length > 0 && <span style={s.selectCount}>{triggered.length} selected</span>}
            </div>
            <div style={s.stopGrid}>
              {HARD_STOPS.map((h) => {
                const on = triggered.includes(h.id)
                return (
                  <button key={h.id} onClick={() => toggle(h.id)} className="opt" aria-pressed={on} style={{ ...s.stop, ...(on ? s.stopOn : {}) }}>
                    <div style={s.stopTop}>
                      <span style={{ ...s.check, ...(on ? s.checkOn : {}) }}>{on ? '✓' : ''}</span>
                      <span style={s.stopLbl}>{h.label}</span>
                    </div>
                    <p style={s.stopDesc}>{h.desc}</p>
                    <span style={s.stopLaw}>{h.law}</span>
                  </button>
                )
              })}
            </div>
            {hardStop
              ? <div style={s.alert}><strong style={{ color: STOP }}>Hard stop active.</strong> This routes to a person before any disciplinary action. Continue to see who owns it.</div>
              : <p style={s.screenNote}>Nothing here applies? That's common — just continue and the tool will classify the situation.</p>}
            <Nav back={() => setStage('state')} next={() => { if (hardStop) { setLane('PROTECTED'); setStage('plan') } else setStage('classify') }} nextLbl={hardStop ? 'See routing' : 'No flags — classify'} />
          </Card>
        )}

        {stage === 'classify' && (
          <Card>
            <h2 style={s.h2}>What kind of situation is this?</h2>
            <p style={s.body}>Performance and conduct follow the ladder. Serious misconduct can skip steps but never without ER.</p>
            <div style={s.laneCol}>
              {[LANES.PERFORMANCE, LANES.CONDUCT, LANES.SERIOUS].map((l) => (
                <button key={l.id} onClick={() => setLane(l.id)} style={{ ...s.lane, ...(lane === l.id ? s.selOn : {}) }}>
                  <div style={s.laneHead}>
                    <span style={s.laneName}>{l.name}</span>
                    <span style={s.laneTag}>{l.progressive ? 'Ladder applies' : 'ER co-owns'}</span>
                  </div>
                  <p style={s.laneBlurb}>{l.blurb}</p>
                </button>
              ))}
            </div>
            {(lane === 'PERFORMANCE' || lane === 'CONDUCT') && (
              <div style={{ marginTop: 22 }}>
                <h3 style={s.h3}>Where does this enter the ladder?</h3>
                <div style={s.sevRow}>
                  {SEVERITY.map((x) => (
                    <button key={x.id} onClick={() => setSeverity(x.id)} style={{ ...s.sev, ...(severity === x.id ? s.sevOn : {}) }}>{x.label}</button>
                  ))}
                </div>
              </div>
            )}
            <Nav back={() => setStage('screen')} next={() => setStage('plan')} nextOff={!lane || ((lane === 'PERFORMANCE' || lane === 'CONDUCT') && !severity)} nextLbl="Build the plan" />
          </Card>
        )}

        {stage === 'plan' && (
          <Card>
            {lane === 'PROTECTED' ? <ProtectedPlan triggered={triggered} routedRoles={routed} role={role} />
              : lane === 'SERIOUS' ? <SeriousPlan st={st} />
              : <LadderPlan lane={LANES[lane]} entryStep={entryStep} st={st} />}
            <DeltaBox st={st} />
            <div style={s.disc}>Guidance only, current to June 2026. {st?.name} rule of thumb: {st?.finalPay} Confirm the final step with your Engagement Consultant or ER before acting.</div>
            <Resources st={st} />
            <Nav back={() => setStage('classify')} reset={reset} print={() => window.print()} />
          </Card>
        )}
      </div>
    </div>
  )
}

function DeltaBox({ st }) {
  if (!st) return null
  return (
    <div style={{ ...s.delta, ...(st.urgent ? { borderColor: STOP } : {}) }}>
      <div style={s.deltaHead}><span style={s.deltaCode}>{st.code}</span><span style={s.deltaTitle}>What changes in {st.name}</span></div>
      <ul style={s.deltaList}>{st.deltas.map((d, i) => <li key={i} style={s.deltaItem}>{d}</li>)}</ul>
      {st.urgent && <div style={s.deltaPay}>Final pay is due the moment employment ends. Coordinate payroll with ER before any termination conversation.</div>}
    </div>
  )
}

function ProtectedPlan({ triggered, routedRoles: routed, role }) {
  const legalHeavy = isLegalHeavy(triggered)
  const danger = isDanger(triggered)
  const accommodation = triggered.some((t) => ['disability_accommodation', 'leave_interference'].includes(t))
  return (
    <>
      <div style={s.banner}>Stop — route before acting</div>
      <h2 style={s.h2}>Protected / legal-risk situation</h2>
      <p style={s.body}>One or more hard stops fired. Do not issue discipline, promise an outcome, or investigate alone. {role === 'manager' ? 'Your job now is to document facts and hand off.' : 'You have the right to report and to be supported — here is where to go.'}</p>
      <h3 style={s.h3}>Why this routed</h3>
      <ul style={s.ul}>{triggered.map((tid) => { const h = HARD_STOPS.find((x) => x.id === tid); return <li key={tid} style={s.li}><strong>{h.label}.</strong> {h.law}</li> })}</ul>
      <h3 style={s.h3}>Route to — in this order</h3>
      <div style={s.cCol}>
        {routed.map((r) => <RoleCard key={r} rk={r} />)}
        {legalHeavy && <RoleCard rk="OGC" />}
        {role === 'employee' && <RoleCard rk="EAP" />}
      </div>
      <h3 style={s.h3}>Do now</h3>
      <ol style={s.ol}>
        <li style={s.li}>Write down objective facts: dates, what was said, who was present.</li>
        <li style={s.li}>Do not retaliate, isolate, or change the person's conditions while this is open.</li>
        <li style={s.li}>Hand off to the first contact above today.</li>
        {accommodation && <li style={s.li}>Start the ADA/FMLA interactive process — engage the request, don't deny or discipline around it.</li>}
        {danger && <li style={s.li}>If anyone is in danger or a crime may be in progress, call VUPD first.</li>}
      </ol>
    </>
  )
}

function SeriousPlan({ st }) {
  return (
    <>
      <h2 style={s.h2}>Serious misconduct path</h2>
      <p style={s.body}>This lane can move faster than the ladder, up to immediate separation, but the decision is shared. You gather and document; your Engagement Consultant and ER approve the outcome.</p>
      <h3 style={s.h3}>Sequence</h3>
      <ol style={s.ol}>
        <li style={s.li}>Secure the situation. If there's any safety risk, call VUPD.</li>
        <li style={s.li}>Consider paid administrative leave pending review rather than on-the-spot action.</li>
        <li style={s.li}>Document objective facts immediately.</li>
        <li style={s.li}>Contact your Engagement Consultant and ER before any decision.</li>
        <li style={s.li}>Run a consistency check against comparable past cases.</li>
        {st?.urgent && <li style={s.li}><strong>{st.code}:</strong> if separation is likely, have payroll ready — final pay is due immediately at termination.</li>}
        <li style={s.li}>ER + Engagement Consultant sign off. You do not execute alone.</li>
      </ol>
      <h3 style={s.h3}>Who's involved</h3>
      <div style={s.cCol}><RoleCard rk="EC" /><RoleCard rk="ER" /><RoleCard rk="VUPD" /><RoleCard rk="OGC" /></div>
      <div style={s.alert}><strong style={{ color: STOP }}>Re-screen.</strong> If the conduct involves a protected class, a complaint, leave, a disability, or a student, go back — it's no longer a clean misconduct case.</div>
    </>
  )
}

function LadderPlan({ lane, entryStep, st }) {
  return (
    <>
      <h2 style={s.h2}>{lane.name} — progressive plan</h2>
      <p style={s.body}>{lane.blurb}</p>
      <p style={s.body}>Based on severity, start at <strong>Step {entryStep}</strong>. Steps are a default, not a contract — facts can move the entry point, and ER review is required before final warning or termination.</p>
      <h3 style={s.h3}>Who owns this lane</h3>
      <div style={s.cCol}>{lane.route.map((r) => <RoleCard key={r} rk={r} />)}</div>
      <h3 style={s.h3}>The ladder</h3>
      <div style={{ margin: '8px 0' }}>
        {LADDER.map((step) => {
          const active = step.step >= entryStep
          return (
            <div key={step.step} className="avoid-break" style={{ ...s.rung, ...(active ? {} : { opacity: 0.42 }) }}>
              <div style={s.rungNum}>{step.step < entryStep ? '—' : step.step}</div>
              <div style={{ flex: 1 }}>
                <div style={s.rungHead}><span style={s.rungName}>{step.name}</span><span style={s.rungOwner}>{step.owner}</span></div>
                <p style={s.rungPurpose}>{step.purpose}</p>
                <p style={s.rungDoc}>{step.doc}</p>
                {step.step === 4 && st?.urgent && <p style={s.rungPay}>{st.code}: final pay due immediately at termination — arrange payroll in advance.</p>}
              </div>
            </div>
          )
        })}
      </div>
      <h3 style={s.h3}>At every step</h3>
      <ul style={s.ul}>
        <li style={s.li}>Document specific, observable facts — not impressions.</li>
        <li style={s.li}>Check consistency against how others were treated.</li>
        <li style={s.li}>Exclude FMLA/ADA-protected absences from attendance counts, and run any disability or medical signal through the ADA interactive process before disciplining.</li>
        <li style={s.li}>Re-run the legal screen — a protected signal moves this off the ladder.</li>
        <li style={s.li}>Loop your Engagement Consultant before written steps.</li>
      </ul>
    </>
  )
}

function RoleCard({ rk }) {
  const r = ROLES[rk]
  if (!r) return null
  return (
    <div className="avoid-break" style={{ ...s.contact, ...(r.indirect ? { borderLeftColor: '#B8B2A4', background: '#FAF9F5' } : {}) }}>
      <div style={s.contactTop}><span style={s.contactName}>{r.name}</span>{r.indirect && <span style={s.badge}>indirect</span>}</div>
      <span style={s.contactDesc}>{r.desc}</span>
      <span style={s.contactWho}>{r.who}</span>
    </div>
  )
}

function Resources({ st }) {
  const stateLinks = st ? RESOURCES[st.code] || [] : []
  return (
    <div style={{ marginTop: 22 }}>
      <h3 style={s.h3}>Resources</h3>
      <p style={s.resIntro}>Credible primary sources for the guidance above. Verify any close call against these and your Vanderbilt policy before acting.</p>
      <div style={s.resLbl}>Federal & HR standards</div>
      <div style={s.cCol}>{RESOURCES.federal.map((r) => <ResLink key={r.url} r={r} />)}</div>
      {stateLinks.length > 0 && (
        <>
          <div style={s.resLbl}>{st.name} sources</div>
          <div style={s.cCol}>{stateLinks.map((r) => <ResLink key={r.url} r={r} />)}</div>
        </>
      )}
    </div>
  )
}

function ResLink({ r }) {
  return (
    <a href={r.url} target="_blank" rel="noopener noreferrer" className="avoid-break" style={s.res}>
      <div style={s.resTop}><span style={s.resOrg}>{r.org}</span><span style={s.resArrow}>↗</span></div>
      <span style={s.resTitle}>{r.title}</span>
      <span style={s.resNote}>{r.note}</span>
    </a>
  )
}

function Card({ children }) { return <div style={s.card}>{children}</div> }

function Nav({ back, next, reset, print, nextLbl, nextOff }) {
  return (
    <div style={s.nav} className="no-print">
      <div>
        {back && <button style={s.ghost} onClick={back}>← Back</button>}
        {reset && <button style={s.ghost} onClick={reset}>↺ Start over</button>}
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        {print && <button style={s.pdfBtn} onClick={print}>⤓ Save as PDF</button>}
        {next && <button style={{ ...s.btn, ...(nextOff ? s.btnOff : {}) }} onClick={next} disabled={nextOff}>{nextLbl} →</button>}
      </div>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', background: PAPER, fontFamily: "'Helvetica Neue',Arial,sans-serif", color: INK },
  frame: { maxWidth: 760, margin: '0 auto', padding: '40px 24px 80px' },
  logo: { height: 40, width: 'auto', display: 'block', marginBottom: 18 },
  rule: { height: 3, width: 64, borderRadius: 2, background: GOLD_GRADIENT, marginBottom: 18 },
  eyebrow: { fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, fontWeight: 700, marginBottom: 12 },
  h1: { fontFamily: 'Georgia,serif', fontSize: 38, lineHeight: 1.05, margin: '0 0 14px', fontWeight: 400 },
  ital: { fontStyle: 'italic', color: GOLD },
  sub: { fontSize: 15, lineHeight: 1.6, color: '#4A463E', maxWidth: 580, margin: 0 },
  rail: { display: 'flex', gap: 6, margin: '0 0 24px', borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`, padding: '14px 0', flexWrap: 'wrap' },
  railItem: { display: 'flex', alignItems: 'center', gap: 7, flex: 1, minWidth: 96 },
  dot: { width: 22, height: 22, borderRadius: '50%', borderWidth: 1, borderStyle: 'solid', borderColor: LINE, display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700, color: '#9A9486', flexShrink: 0 },
  dotOn: { background: INK, color: PAPER, borderColor: INK },
  railLbl: { fontSize: 12, letterSpacing: '0.03em' },
  card: { background: '#fff', borderWidth: 1, borderStyle: 'solid', borderColor: LINE, borderRadius: 4, padding: '32px 30px' },
  h2: { fontFamily: 'Georgia,serif', fontSize: 24, fontWeight: 400, margin: '0 0 12px' },
  h3: { fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', color: GOLD, fontWeight: 700, margin: '26px 0 12px' },
  body: { fontSize: 14.5, lineHeight: 1.65, color: '#403C34', margin: '0 0 14px' },
  row: { display: 'flex', gap: 12, margin: '20px 0 0', flexWrap: 'wrap' },
  choice: { flex: 1, minWidth: 200, textAlign: 'left', background: '#fff', borderWidth: 1, borderStyle: 'solid', borderColor: LINE, borderRadius: 4, padding: 18, display: 'flex', flexDirection: 'column', gap: 4 },
  choiceOn: { borderColor: INK, boxShadow: `inset 0 0 0 1px ${INK}` },
  choiceT: { fontSize: 16, fontWeight: 600 },
  choiceD: { fontSize: 13, color: '#7A746A' },
  selOn: { borderColor: INK, boxShadow: `inset 0 0 0 1px ${INK}` },
  stateGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 10, marginTop: 16 },
  stateBtn: { textAlign: 'left', background: '#fff', borderWidth: 1, borderStyle: 'solid', borderColor: LINE, borderRadius: 4, padding: 16, display: 'flex', flexDirection: 'column', gap: 4 },
  stateCode: { fontFamily: 'Georgia,serif', fontSize: 22, fontWeight: 700, color: GOLD },
  stateName: { fontSize: 14, fontWeight: 600 },
  stateFlag: { fontSize: 10.5, color: STOP, fontWeight: 700, marginTop: 2 },
  note: { marginTop: 16, padding: '12px 14px', background: '#FAF6EC', borderWidth: 1, borderStyle: 'solid', borderColor: LINE, borderLeftWidth: 3, borderLeftStyle: 'solid', borderLeftColor: GOLD, borderRadius: 3, fontSize: 13.5, lineHeight: 1.55, color: '#4A463E' },
  screenNote: { marginTop: 16, fontSize: 13, lineHeight: 1.55, color: '#6E685D', fontStyle: 'italic' },
  selectHint: { display: 'flex', alignItems: 'center', gap: 10, margin: '0 0 2px' },
  selectHintTxt: { fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: GOLD, fontWeight: 700 },
  selectCount: { fontSize: 11, fontWeight: 700, color: STOP, background: '#FCF6F5', borderWidth: 1, borderStyle: 'solid', borderColor: STOP, borderRadius: 999, padding: '2px 9px' },
  stopGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 10, marginTop: 16 },
  stop: { textAlign: 'left', background: '#fff', borderWidth: 1, borderStyle: 'solid', borderColor: LINE, borderRadius: 4, padding: 14 },
  stopOn: { borderColor: STOP, background: '#FCF6F5' },
  stopTop: { display: 'flex', alignItems: 'center', gap: 9, marginBottom: 6 },
  check: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderStyle: 'solid', borderColor: '#9A9486', background: '#fff', display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 },
  checkOn: { background: STOP, borderColor: STOP, color: '#fff' },
  stopLbl: { fontSize: 14, fontWeight: 600, lineHeight: 1.2 },
  stopDesc: { fontSize: 12.5, lineHeight: 1.5, color: '#6E685D', margin: '0 0 8px' },
  stopLaw: { fontSize: 11, color: STOP, fontWeight: 600 },
  alert: { background: '#FCF6F5', border: `1px solid ${STOP}`, borderRadius: 4, padding: '14px 16px', fontSize: 13.5, lineHeight: 1.55, color: '#5C211D', marginTop: 18 },
  laneCol: { display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 },
  lane: { textAlign: 'left', background: '#fff', borderWidth: 1, borderStyle: 'solid', borderColor: LINE, borderRadius: 4, padding: '16px 18px' },
  laneHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, gap: 10 },
  laneName: { fontSize: 16, fontWeight: 600 },
  laneTag: { fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: GOLD, fontWeight: 700, whiteSpace: 'nowrap' },
  laneBlurb: { fontSize: 13, lineHeight: 1.55, color: '#6E685D', margin: 0 },
  sevRow: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  sev: { background: '#fff', borderWidth: 1, borderStyle: 'solid', borderColor: LINE, borderRadius: 999, padding: '8px 16px', fontSize: 13 },
  sevOn: { background: INK, color: '#fff', borderColor: INK },
  rung: { display: 'flex', gap: 16, padding: '16px 0', borderTop: `1px solid ${LINE}` },
  rungNum: { width: 30, height: 30, borderRadius: '50%', background: GOLD, color: INK, display: 'grid', placeItems: 'center', fontWeight: 700, fontFamily: 'Georgia,serif', flexShrink: 0 },
  rungHead: { display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 4, flexWrap: 'wrap' },
  rungName: { fontSize: 15.5, fontWeight: 600 },
  rungOwner: { fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase', color: GOLD, fontWeight: 700 },
  rungPurpose: { fontSize: 13.5, lineHeight: 1.55, color: '#403C34', margin: '0 0 6px' },
  rungDoc: { fontSize: 12.5, lineHeight: 1.55, color: '#6E685D', margin: 0, fontStyle: 'italic' },
  rungPay: { fontSize: 12.5, lineHeight: 1.5, color: STOP, fontWeight: 600, margin: '6px 0 0' },
  banner: { display: 'inline-block', background: STOP, color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '6px 12px', borderRadius: 3, marginBottom: 14 },
  ul: { margin: '0 0 8px', paddingLeft: 20 },
  ol: { margin: '0 0 8px', paddingLeft: 20 },
  li: { fontSize: 14, lineHeight: 1.7, color: '#403C34', marginBottom: 4 },
  cCol: { display: 'flex', flexDirection: 'column', gap: 8 },
  contact: { borderWidth: 1, borderStyle: 'solid', borderColor: LINE, borderLeftWidth: 3, borderLeftStyle: 'solid', borderLeftColor: GOLD, borderRadius: 3, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 3 },
  contactTop: { display: 'flex', alignItems: 'center', gap: 8 },
  contactName: { fontSize: 14.5, fontWeight: 700 },
  badge: { fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8A8478', borderWidth: 1, borderStyle: 'solid', borderColor: LINE, borderRadius: 3, padding: '1px 6px', fontWeight: 700 },
  contactDesc: { fontSize: 12.5, lineHeight: 1.5, color: '#6E685D' },
  contactWho: { fontSize: 12.5, fontWeight: 600, color: '#403C34' },
  delta: { marginTop: 26, borderWidth: 1, borderStyle: 'solid', borderColor: LINE, borderRadius: 4, overflow: 'hidden' },
  deltaHead: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: '#FAF6EC', borderBottom: `1px solid ${LINE}` },
  deltaCode: { fontFamily: 'Georgia,serif', fontSize: 18, fontWeight: 700, color: GOLD },
  deltaTitle: { fontSize: 13, fontWeight: 700, letterSpacing: '0.04em' },
  deltaList: { margin: 0, padding: '12px 16px 12px 34px' },
  deltaItem: { fontSize: 13, lineHeight: 1.6, color: '#403C34', marginBottom: 6 },
  deltaPay: { padding: '10px 16px', background: '#FCF6F5', borderTop: `1px solid ${LINE}`, fontSize: 12.5, lineHeight: 1.5, color: '#5C211D', fontWeight: 600 },
  disc: { marginTop: 24, paddingTop: 16, borderTop: `1px solid ${LINE}`, fontSize: 12, lineHeight: 1.6, color: '#8A8478' },
  resIntro: { fontSize: 13, lineHeight: 1.6, color: '#6E685D', margin: '0 0 14px' },
  resLbl: { fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#403C34', fontWeight: 700, margin: '14px 0 8px' },
  res: { display: 'flex', flexDirection: 'column', gap: 3, textDecoration: 'none', color: 'inherit', borderWidth: 1, borderStyle: 'solid', borderColor: LINE, borderRadius: 3, padding: '11px 14px', background: '#fff' },
  resTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  resOrg: { fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: GOLD, fontWeight: 700 },
  resArrow: { fontSize: 13, color: '#B8B2A4' },
  resTitle: { fontSize: 14, fontWeight: 600, color: INK, lineHeight: 1.3 },
  resNote: { fontSize: 12.5, lineHeight: 1.5, color: '#6E685D' },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 26, gap: 12, flexWrap: 'wrap' },
  btn: { background: INK, color: PAPER, border: 'none', borderRadius: 3, padding: '11px 20px', fontSize: 14, fontWeight: 600 },
  pdfBtn: { background: '#fff', color: INK, borderWidth: 1, borderStyle: 'solid', borderColor: INK, borderRadius: 3, padding: '10px 16px', fontSize: 13.5, fontWeight: 600 },
  btnOff: { background: '#D8D3C7', color: '#fff' },
  ghost: { background: 'transparent', border: 'none', color: '#6E685D', fontSize: 13.5, padding: '8px 4px', marginRight: 8 },
}
