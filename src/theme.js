// Look and feel. Edit colors/spacing here; components read from this object.
// Palette follows the Vanderbilt brand standards (brand.vanderbilt.edu/color):
// black + gold, with gold used as an ACCENT (it is too light for large text).
//   Flat Gold     #CFAE70  (Pantone 4024 C)  — primary accent
//   Metallic Gold #FEEEB6 → #B49248          — gradient flourish
//   Black         #1C1C1C  (Pantone Black C)
//   White         #FFFFFF

export const theme = {
  color: {
    bg: '#f7f6f3',
    surface: '#ffffff',
    ink: '#1c1c1c', // Vanderbilt black
    inkSoft: '#5d584e', // warm gray
    line: '#e6e3dc',
    brand: '#cfae70', // Vanderbilt flat gold
    brandDeep: '#b49248', // deeper metallic gold — borders/hover/contrast
    brandInk: '#1c1c1c', // headings render in black; gold is the accent
    accent: '#866d4b', // muted bronze for secondary accents
    gold: '#cfae70',
    goldGradient: 'linear-gradient(90deg, #feeeb6 0%, #cfae70 45%, #b49248 100%)',
    // Semantic (kept distinct from brand so meaning stays legible)
    stop: '#b00020', // legal hard stop
    stopBg: '#fdecef',
    caution: '#9a6a00',
    cautionBg: '#fff6e3',
    ok: '#1e6b3a',
    okBg: '#e9f5ee',
    routeBg: '#f6efe1', // light gold tint
  },
  radius: { sm: '6px', md: '10px', lg: '16px' },
  shadow: '0 1px 2px rgba(28,28,28,0.06), 0 4px 16px rgba(28,28,28,0.06)',
  font: {
    body: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
  },
  maxWidth: '820px',
}
