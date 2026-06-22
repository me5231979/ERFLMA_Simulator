import { useMemo, useState } from 'react'
import { theme } from './theme.js'
import { DEFAULT_STATE } from './data/states.js'
import { buildPlan } from './engine.js'
import Intake from './components/Intake.jsx'
import Plan from './components/Plan.jsx'

const INITIAL = {
  situation: '',
  stateId: DEFAULT_STATE,
  flags: {},
  laneId: null,
  hasPriorDiscipline: false,
}

export default function App() {
  const [intake, setIntake] = useState(INITIAL)
  const [submitted, setSubmitted] = useState(false)

  // The plan recomputes from intake; the legal screen always runs first inside
  // buildPlan (see engine.js).
  const plan = useMemo(() => buildPlan(intake), [intake])

  return (
    <div style={{ maxWidth: theme.maxWidth, margin: '0 auto', padding: '24px 18px 64px' }}>
      <header style={{ marginBottom: 18 }}>
        <h1 style={{ margin: '0 0 4px', fontSize: 24, color: theme.color.brandInk }}>
          FLH ER &amp; Discipline Simulator
        </h1>
        <p style={{ margin: 0, color: theme.color.inkSoft, fontSize: 14 }}>
          Screens an employee-relations situation for legal hard stops, classifies it, and
          suggests state-aware next steps and who to route to.
        </p>
        <p
          style={{
            margin: '8px 0 0',
            fontSize: 12,
            color: theme.color.inkSoft,
            fontStyle: 'italic',
          }}
        >
          Decision support, not legal advice. Nothing you type leaves this browser.
        </p>
      </header>

      <main
        style={{
          background: theme.color.surface,
          border: `1px solid ${theme.color.line}`,
          borderRadius: theme.radius.lg,
          padding: 20,
          boxShadow: theme.shadow,
        }}
      >
        <Intake value={intake} onChange={setIntake} />

        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button
            onClick={() => setSubmitted(true)}
            style={{
              background: theme.color.brand,
              color: '#fff',
              border: 'none',
              borderRadius: theme.radius.sm,
              padding: '10px 18px',
              fontWeight: 600,
            }}
          >
            Get plan
          </button>
          <button
            onClick={() => {
              setIntake(INITIAL)
              setSubmitted(false)
            }}
            style={{
              background: 'transparent',
              color: theme.color.inkSoft,
              border: `1px solid ${theme.color.line}`,
              borderRadius: theme.radius.sm,
              padding: '10px 18px',
            }}
          >
            Reset
          </button>
        </div>
      </main>

      {submitted && (
        <div style={{ marginTop: 22 }}>
          <Plan plan={plan} />
        </div>
      )}

      <footer style={{ marginTop: 40, fontSize: 12, color: theme.color.inkSoft }}>
        Vanderbilt FLH · decision support only · confirm every action with your HR partner.
      </footer>
    </div>
  )
}
