# Web

SolidStart 2 frontend for skill-sprout. Server-rendered Solid, Tailwind 4 design tokens, and a small Kobalte primitive layer.

## Stack

| Piece | Package | Version |
| --- | --- | --- |
| Framework | `@solidjs/start` | 2.2.3 |
| UI runtime | `solid-js` | 1.9.20 |
| Router | `@solidjs/router` | 1.0.3 |
| Build | `vite` | 8.3.8 |
| Styles | `tailwindcss` | 4.3.5 |
| Primitives | `@kobalte/core` | 0.13.14 |
| Variants | `class-variance-authority` | 0.7.1 |

## Quick start

```sh
pnpm install
pnpm dev
```

The app runs at `http://localhost:3000`. Start the Go API in another terminal from the repository root:

```powershell
.\task.ps1 dev
```

The API listens on `http://127.0.0.1:8080`. The page's probe calls `/api/health`, which the app server forwards to the Go service, so the browser never needs CORS.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Vite dev server with HMR and SSR |
| `pnpm build` | Production build into `.output/` |
| `pnpm start` | Serve the production build |
| `pnpm preview` | Preview the production build |
| `pnpm typecheck` | `tsc --noEmit` |

## Structure

```text
src/
|-- app.tsx                 Router root, fonts, global styles
|-- app.css                 Tailwind 4 theme tokens and base styles
|-- entry-client.tsx        Hydration entry
|-- entry-server.tsx        Document shell and theme bootstrap
|-- lib/
|   |-- api.ts              Health report type, parser, probe
|   |-- theme.ts            Theme read/write and no-flash script
|   `-- utils.ts            cn() class merge
|-- components/
|   |-- app-shell.tsx       Header, navigation, footer
|   |-- command-line.tsx    Copyable command row
|   |-- health-probe.tsx    Live API probe
|   |-- stack-ledger.tsx    Stack inventory
|   |-- theme-toggle.tsx    Light and dark switch
|   `-- ui/                 Buttons, inputs, cards, dialog, switch
`-- routes/
    |-- index.tsx           Overview
    |-- bench.tsx           Primitive showcase
    |-- api/health.ts       Go service bridge
    `-- [...404].tsx        Not found
```

## Theme tokens

`src/app.css` owns the design system. Tailwind 4 reads it directly, so there is no `tailwind.config.js`.

- `:root` defines the light palette as CSS custom properties.
- `.dark` overrides the same names.
- `@theme inline` maps the properties to Tailwind utilities such as `bg-card` and `text-muted-foreground`.
- `src/lib/theme.ts` writes the `.dark` class and persists the choice in `localStorage`.
- `src/entry-server.tsx` runs a small inline script before paint so a dark page never flashes light.

Add a token in `:root`, mirror it in `.dark`, then map it in `@theme inline`.

## UI primitives

`src/components/ui` follows the shadcn pattern: source files you own, not a runtime dependency. Behaviour comes from Kobalte, variants from `class-variance-authority`, and class conflicts are resolved by `cn()`.

To add a primitive, copy the pattern from an existing file, wire the Kobalte parts, and export the styled components. Delete anything the product does not use.

## API bridge

`src/routes/api/health.ts` is a SolidStart API route. It calls the Go service's `/health` endpoint with a 2.5 second timeout and answers with one of:

```json
{ "state": "ok", "latencyMs": 12 }
```

```json
{ "state": "down", "detail": "Could not reach http://127.0.0.1:8080" }
```

Set `API_BASE_URL` in the server environment to point at a different service. The default is `http://127.0.0.1:8080`.
