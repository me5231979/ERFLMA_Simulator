import { getRole, isDirectContact } from '../data/roles.js'
import { theme } from '../theme.js'

// Renders the people to route to. GUARDRAIL: any role that is not a direct
// contact (counsel/OGC) is shown WITHOUT contact details — only as a note that
// a human will involve them. This component never prints OGC contact info even
// if someone fills it into roles.js by mistake.
export default function Contacts({ roleIds = [] }) {
  const roles = [...new Set(roleIds)].map(getRole).filter(Boolean)
  if (roles.length === 0) return null

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {roles.map((role) => {
        const direct = isDirectContact(role.id)
        return (
          <div
            key={role.id}
            style={{
              border: `1px solid ${theme.color.line}`,
              borderRadius: theme.radius.md,
              padding: '12px 14px',
              background: theme.color.surface,
            }}
          >
            <div style={{ fontWeight: 600 }}>{role.label}</div>
            <div style={{ color: theme.color.inkSoft, fontSize: 14, marginTop: 2 }}>
              {role.blurb}
            </div>

            {direct ? (
              <ContactDetails who={role.who} />
            ) : (
              <div
                style={{
                  marginTop: 8,
                  fontSize: 13,
                  color: theme.color.inkSoft,
                  fontStyle: 'italic',
                }}
              >
                Reached through your HR partner — not contacted directly from here.
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function ContactDetails({ who }) {
  if (!who) return null
  return (
    <div style={{ marginTop: 8, fontSize: 14 }}>
      {who.name && <div>{who.name}</div>}
      {who.email && (
        <div>
          <a href={`mailto:${who.email}`}>{who.email}</a>
        </div>
      )}
      {who.link && (
        <div>
          <a href={who.link} target="_blank" rel="noreferrer">
            More info
          </a>
        </div>
      )}
    </div>
  )
}
