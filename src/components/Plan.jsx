import { theme } from '../theme.js'
import Contacts from './Contacts.jsx'
import { resources } from '../data/resources.js'

const STEP_STYLE = {
  stop: { bg: theme.color.stopBg, bar: theme.color.stop, badge: 'HARD STOP' },
  'stop-detail': { bg: theme.color.stopBg, bar: theme.color.stop, badge: 'WHY' },
  ok: { bg: theme.color.okBg, bar: theme.color.ok, badge: 'CLEAR' },
  classify: { bg: theme.color.surface, bar: theme.color.brand, badge: 'CLASSIFY' },
  ladder: { bg: theme.color.surface, bar: theme.color.brand, badge: 'NEXT STEP' },
  state: { bg: theme.color.surface, bar: theme.color.accent, badge: 'STATE' },
  route: { bg: theme.color.routeBg, bar: theme.color.accent, badge: 'ROUTE' },
}

export default function Plan({ plan }) {
  if (!plan) return null

  // The final step is always the route-to-a-human step (guaranteed by engine).
  const routeStep = plan.steps[plan.steps.length - 1]
  const bodySteps = plan.steps.slice(0, -1)

  return (
    <section aria-label="Recommended plan" style={{ display: 'grid', gap: 14 }}>
      <Banner status={plan.status} />

      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
        {bodySteps.map((step, i) => (
          <StepCard key={i} step={step} />
        ))}
      </ol>

      {/* Mandatory final step, visually anchored. */}
      <div>
        <StepCard step={routeStep} emphasize />
        {routeStep.roleIds && (
          <div style={{ marginTop: 10 }}>
            <Contacts roleIds={routeStep.roleIds} />
          </div>
        )}
      </div>

      <ResourceLinks />
    </section>
  )
}

function Banner({ status }) {
  const isStop = status === 'hard-stop'
  return (
    <div
      style={{
        background: isStop ? theme.color.stopBg : theme.color.okBg,
        color: isStop ? theme.color.stop : theme.color.ok,
        border: `1px solid ${isStop ? theme.color.stop : theme.color.ok}`,
        borderRadius: theme.radius.md,
        padding: '10px 14px',
        fontWeight: 600,
      }}
    >
      {isStop
        ? 'Legal hard stop — route for review before classifying or acting.'
        : 'No hard stop flagged — here is a suggested, documented path.'}
    </div>
  )
}

function StepCard({ step, emphasize = false }) {
  const s = STEP_STYLE[step.kind] || STEP_STYLE.classify
  return (
    <li
      style={{
        listStyle: 'none',
        background: s.bg,
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: theme.color.line,
        borderLeftWidth: 4,
        borderLeftColor: s.bar,
        borderRadius: theme.radius.md,
        padding: '12px 14px',
        boxShadow: emphasize ? theme.shadow : 'none',
      }}
    >
      <div
        style={{
          fontSize: 11,
          letterSpacing: 0.6,
          fontWeight: 700,
          color: s.bar,
          marginBottom: 4,
        }}
      >
        {s.badge}
      </div>
      <div style={{ fontWeight: 600 }}>{step.title}</div>
      <div style={{ color: theme.color.inkSoft, fontSize: 14, marginTop: 2 }}>{step.text}</div>
    </li>
  )
}

function ResourceLinks() {
  return (
    <div
      style={{
        borderTop: `1px dashed ${theme.color.line}`,
        paddingTop: 12,
        marginTop: 4,
      }}
    >
      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>Resources</div>
      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, color: theme.color.inkSoft }}>
        {resources.map((r) => (
          <li key={r.id}>
            {r.url ? (
              <a href={r.url} target="_blank" rel="noreferrer">
                {r.label}
              </a>
            ) : (
              <span>{r.label}</span>
            )}
            {r.note ? ` — ${r.note}` : ''}
          </li>
        ))}
      </ul>
    </div>
  )
}
