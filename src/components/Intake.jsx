import { theme } from '../theme.js'
import { states } from '../data/states.js'
import { hardStops, lanes } from '../data/classification.js'

// Intake collects everything the engine needs. The hard-stop checklist is
// presented FIRST and prominently, reinforcing that the legal screen comes
// before classification.
export default function Intake({ value, onChange }) {
  const { stateId, situation, flags, laneId, hasPriorDiscipline } = value

  const setFlag = (id, checked) =>
    onChange({ ...value, flags: { ...flags, [id]: checked } })

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <Field label="1. Describe the situation (stays on your device — nothing is sent)">
        <textarea
          value={situation}
          onChange={(e) => onChange({ ...value, situation: e.target.value })}
          rows={4}
          placeholder="What happened, when, and what's been done so far…"
          style={inputStyle}
        />
      </Field>

      <Field label="2. State / jurisdiction">
        <select
          value={stateId}
          onChange={(e) => onChange({ ...value, stateId: e.target.value })}
          style={inputStyle}
        >
          {states.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </Field>

      <fieldset>
        <legend style={legendStyle}>
          3. Legal screen — check anything that may apply
        </legend>
        <p style={{ margin: '0 0 10px', fontSize: 13, color: theme.color.inkSoft }}>
          This runs before classification on purpose. If any apply, the tool stops and
          routes you for review instead of suggesting discipline.
        </p>
        <div style={{ display: 'grid', gap: 8 }}>
          {hardStops.map((hs) => (
            <label
              key={hs.id}
              style={{
                display: 'flex',
                gap: 10,
                alignItems: 'flex-start',
                border: `1px solid ${theme.color.line}`,
                borderRadius: theme.radius.sm,
                padding: '8px 10px',
                background: flags[hs.id] ? theme.color.stopBg : theme.color.surface,
              }}
            >
              <input
                type="checkbox"
                checked={!!flags[hs.id]}
                onChange={(e) => setFlag(hs.id, e.target.checked)}
                style={{ marginTop: 3 }}
              />
              <span style={{ fontSize: 14 }}>{hs.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend style={legendStyle}>4. If no hard stop applies — kind of issue</legend>
        <div style={{ display: 'grid', gap: 8 }}>
          {lanes.map((lane) => (
            <label
              key={lane.id}
              style={{
                display: 'flex',
                gap: 10,
                alignItems: 'flex-start',
                border: `1px solid ${laneId === lane.id ? theme.color.brand : theme.color.line}`,
                borderRadius: theme.radius.sm,
                padding: '8px 10px',
                background: theme.color.surface,
              }}
            >
              <input
                type="radio"
                name="lane"
                checked={laneId === lane.id}
                onChange={() => onChange({ ...value, laneId: lane.id })}
                style={{ marginTop: 3 }}
              />
              <span style={{ fontSize: 14 }}>
                <strong>{lane.label}</strong>
                <span style={{ color: theme.color.inkSoft }}> — {lane.description}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <label style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 14 }}>
        <input
          type="checkbox"
          checked={hasPriorDiscipline}
          onChange={(e) => onChange({ ...value, hasPriorDiscipline: e.target.checked })}
        />
        There is prior documented discipline on record for this issue
      </label>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label style={{ display: 'grid', gap: 6 }}>
      <span style={legendStyle}>{label}</span>
      {children}
    </label>
  )
}

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: theme.radius.sm,
  border: `1px solid ${theme.color.line}`,
  background: theme.color.surface,
  color: theme.color.ink,
  font: 'inherit',
}

const legendStyle = {
  fontWeight: 600,
  fontSize: 15,
}
