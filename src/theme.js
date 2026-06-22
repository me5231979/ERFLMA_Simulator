// Look and feel. Edit colors/spacing here; components read from this object.
// Vanderbilt-leaning palette (gold + ink) without claiming brand exactness.

export const theme = {
  color: {
    bg: '#f6f5f2',
    surface: '#ffffff',
    ink: '#1f2329',
    inkSoft: '#5a6068',
    line: '#e4e2dc',
    brand: '#866d4b', // muted gold/bronze
    brandInk: '#3f3320',
    accent: '#2f5d62',
    // Semantic
    stop: '#b00020', // legal hard stop
    stopBg: '#fdecef',
    caution: '#9a6a00',
    cautionBg: '#fff6e3',
    ok: '#1e6b3a',
    okBg: '#e9f5ee',
    routeBg: '#eef2f7',
  },
  radius: { sm: '6px', md: '10px', lg: '16px' },
  shadow: '0 1px 2px rgba(31,35,41,0.06), 0 4px 16px rgba(31,35,41,0.06)',
  font: {
    body: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
  },
  maxWidth: '820px',
}
