# FLH ER & Discipline Simulator

Decision-support tool for Vanderbilt FLH. Screens an employee-relations
situation for legal hard stops, classifies it, and returns state-aware next
steps and the right people to route to. **Decision support, not legal advice.**

Everything runs in the browser — nothing typed into the tool is sent anywhere.

## Run it locally

You need Node.js 18+ installed.

```bash
npm install
npm run dev
```

Open the URL it prints (usually http://localhost:5173).

## Build for production

```bash
npm run build
```

Output goes to `dist/`. Any static host (Vercel, Netlify, GitHub Pages) serves it.

## Run the guardrail tests

```bash
npm test
```

This runs the `node:test` suite in `src/engine.test.js`, which locks in the
three core guardrails (see below). No browser needed.

## Guardrails

This tool deliberately constrains itself. These are enforced in `src/engine.js`
and tested in `src/engine.test.js`:

1. **The legal screen runs before classification.** If a hard stop applies, the
   tool stops and routes for review instead of suggesting discipline.
2. **OGC / employment counsel is never a direct contact.** Counsel is reached
   through your HR partner.
3. **Every plan ends with a route-to-a-human step.**

See [`CLAUDE.md`](./CLAUDE.md) for the full context and architecture.

## Editing the content

No component edits needed for any of the below:

- Legal/state language → `src/data/states.js`
- Hard stops, lanes, ladder → `src/data/classification.js`
- Who to route to → `src/data/roles.js` (fill in real names/links in `who`)
- Resource links → `src/data/resources.js`
- Look and feel → `src/theme.js`

## Deploy a permanent link

The simplest durable URL is Vercel:

1. Push this repo to GitHub.
2. Go to vercel.com, import the repo.
3. Framework preset: Vite. Build command `npm run build`, output `dist`.
4. Deploy. You get a stable URL that updates on every push.
