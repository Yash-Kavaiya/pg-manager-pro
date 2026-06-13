# PG Manager Pro — Codebase Improvement Plan

A prioritized, phased roadmap to take the app from a mock-data prototype to a production-ready product. Each item references the actual files involved so work can start immediately.

**Current state (June 2026):** Vite + React 18 + TypeScript + shadcn/ui frontend with all data held in-memory in `PGContext` seeded from `src/data/mockData.ts`; a small Express notification backend in `server/`; Docker/nginx/Cloud Run deployment; zero tests; TypeScript strict mode off; fake auth.

---

## Phase 1 — Correctness & Safety Nets (do first, ~1 week)

### 1.1 Turn on TypeScript strict mode
`tsconfig.app.json` currently has `strict: false`, `noImplicitAny: false`, `noUnusedLocals: false`. This is how bugs like the missing `updatePG` in `PGContext` (called by `PropertySettings.tsx`, crashed at runtime — fixed June 2026) slip through.

- Flip `strict: true`, `noUnusedLocals: true`, `noUnusedParameters: true` and fix the fallout incrementally (start with `src/types/`, `src/context/`, then pages).
- Add a `typecheck` script to `package.json` (`tsc --noEmit -p tsconfig.app.json`) — `vite build` uses SWC and **does not typecheck**, so today nothing runs the compiler.

### 1.2 Add a CI gate
`.github/` exists but has no quality workflow. Add one that runs `npm run lint`, `npm run typecheck`, `npm run build` (and later `npm test`) on every PR. Without this, items 1.1 and 1.3 regress immediately.

### 1.3 Introduce testing infrastructure
There are **zero test files** in `src/`. Add Vitest + React Testing Library (native fit for Vite):

- Start with pure-logic targets: ID generation, filters in `src/pages/Rooms.tsx:40-48`, CRUD operations in `src/context/PGContext.tsx`.
- Then component tests for the highest-risk dialogs: `BookingFormDialog.tsx` (25 KB), `PaymentFormDialog.tsx` (13 KB).
- Target: every new feature ships with tests; backfill old code opportunistically.

### 1.4 Fix fragile ID generation
`Math.max(...items.map(i => i.id), 0) + 1` is repeated in `PGContext.tsx` (tenants, bookings, payments) and `Rooms.tsx:74`. It breaks after deletions + re-adds and under any future concurrency. Replace with `crypto.randomUUID()` (change entity `id` types to `string`), or centralize a single `nextId()` util in `src/lib/utils.ts` until the backend owns IDs (Phase 2).

### 1.5 Add an ErrorBoundary
No error boundary exists anywhere — one render error white-screens the whole app. Add a top-level boundary in `App.tsx` and a dedicated one around the lazy-loaded `RoomFloorMap3D` (WebGL context creation can fail on old GPUs/headless browsers; show a "3D view unavailable" fallback instead of crashing the Rooms page).

---

## Phase 2 — Real Data Layer (the big one, ~2–3 weeks)

### 2.1 Replace mock data with a real API
Everything lives in `useState` seeded from `src/data/mockData.ts` (30 KB) — every refresh wipes all user changes. The `server/` Express app currently only does notifications (`routes/notifications.js`). Extend it:

- Add CRUD routes: `/api/pgs`, `/api/rooms`, `/api/tenants`, `/api/bookings`, `/api/payments`.
- Add a database (SQLite via Prisma is the lowest-friction start; Postgres on Cloud SQL when deploying — `cloudbuild-backend.yaml` already targets Cloud Run).
- `VITE_API_URL` already exists in `.env.example` — wire it up.

### 2.2 Actually use TanStack Query
`@tanstack/react-query` is installed and a `QueryClient` is created in `App.tsx:18`, but **nothing uses it**. Replace the entity arrays in `PGContext` with `useQuery`/`useMutation` hooks per entity (`src/hooks/useRooms.ts`, `useTenants.ts`, …). Keep `PGContext` only for UI state (`selectedPG`). This kills the "every consumer re-renders on any entity change" problem in the current context for free.

### 2.3 Real authentication
`Auth.tsx` fakes login with `setTimeout` and any visitor can navigate straight to `/dashboard` — there are **no route guards**. Add JWT (or Firebase Auth) on the server, an `AuthContext` + `<ProtectedRoute>` wrapper around the `Layout` route group in `App.tsx:30-37`, and login/signup endpoints. Until this lands, the app must not hold real tenant PII.

### 2.4 Data integrity rules
Currently nothing stops deleting a room that has an active tenant, or double-booking a room. Tenants reference rooms by string `room` number rather than `id` (`src/types/index.ts:28`). Normalize relations (`roomId: string`), enforce referential checks server-side, and surface friendly errors client-side.

---

## Phase 3 — Frontend Architecture Cleanup (~1–2 weeks, parallelizable with Phase 2)

### 3.1 Break up the monolith pages
`Tenants.tsx` (29 KB), `Bookings.tsx` (21 KB), `Rooms.tsx` (19 KB), `Payments.tsx` (18 KB) each contain the page + add/edit dialog + view dialog + delete confirm + form state. The Bookings/Payments pages already extract dialogs to components (`BookingFormDialog.tsx`, `PaymentFormDialog.tsx`) — apply the same pattern to Rooms and Tenants:

- `src/components/RoomFormDialog.tsx`, `RoomDetailsDialog.tsx`, `TenantFormDialog.tsx`, etc.
- Extract the repeated status-badge color mapping (`getStatusColor` exists in at least `Rooms.tsx:50` and duplicated styling in `RoomFloorMap3D.tsx:279-283`) to a shared `src/lib/statusColors.ts`.

### 3.2 Use react-hook-form + zod for all forms
Both libraries are installed (`react-hook-form`, `zod`, `@hookform/resolvers`) but every form is manual `useState` + hand-rolled `isFormValid()` (e.g. `Rooms.tsx:149-159`, which accepts `parseFloat("12abc")`). Define zod schemas per entity in `src/types/` and let RHF handle validation, errors, and dirty state. This also gives the server reusable validation schemas in Phase 2.

### 3.3 Route-level code splitting
The main bundle is **1.1 MB (312 KB gzip)** because `App.tsx` statically imports every page, pulling recharts and all dialogs into the entry chunk. The 3D view already shows the pattern — `Rooms.tsx:15` lazy-loads `RoomFloorMap3D` into its own 305 KB chunk. Convert all page imports in `App.tsx` to `React.lazy()` with a `Suspense` fallback, and add `manualChunks` in `vite.config.ts` for `recharts` and the radix-ui family. Expected result: entry chunk under ~150 KB gzip.

### 3.4 3D Room View enhancements (the new feature, iterate)
`src/components/RoomFloorMap3D.tsx` shipped June 2026 with floor-stacked layout, status colors, hover/select animations, and detail panel. Next iterations:

- **Connect selection to actions**: "Edit" / "View tenant" buttons in `RoomDetailPanel` that open the existing dialogs in `Rooms.tsx` (pass callbacks down instead of only displaying).
- **Show occupant info**: look up the tenant for occupied rooms and show name in the panel.
- **Floor isolation**: click a floor label to fade other floors out.
- **Performance**: with >100 rooms switch `RoomBox` to `InstancedMesh`; add `frameloop="demand"` to the `Canvas` so the GPU idles when nothing animates.
- **Accessibility fallback**: keep the grid view as the default; never make 3D the only path to a room action.

### 3.5 Consistent currency/date formatting
`₹{x.toLocaleString()}` is scattered across all pages; `date-fns` is installed but dates are formatted ad hoc. Add `formatCurrency()` / `formatDate()` to `src/lib/utils.ts` and sweep.

---

## Phase 4 — Product & Polish (ongoing)

- **Dashboard accuracy**: `PG.occupiedRooms`/`monthlyRevenue` are static numbers in mock data that drift from the actual rooms/payments arrays. Derive them (`useMemo` over rooms/payments now; SQL aggregate after Phase 2).
- **Notifications end-to-end**: `server/src/jobs/reminderScheduler.js` and `emailService.js`/`smsService.js` exist but the frontend `NotificationSettings.tsx` isn't wired to them. Connect via the Phase 2 API.
- **Mobile**: the 3D view and large tables need a mobile audit; `use-mobile.tsx` hook already exists — use it to default mobile users to grid view.
- **Empty/loading/error states**: standardize with skeletons (pattern already started in `Rooms.tsx:233-235`).
- **`npx update-browserslist-db@latest`** — build warns caniuse data is 12 months old.
- **README/docs**: document the `server/` setup and required env vars; `.env.example` only covers `VITE_API_URL`.

---

## Suggested order of execution

| Week | Focus |
|------|-------|
| 1 | 1.1 strict mode + 1.2 CI + 1.5 error boundaries |
| 2 | 1.3 test infra + 1.4 IDs; start 2.1 API design |
| 3–4 | 2.1 API + DB; 3.3 code splitting (quick win, do anytime) |
| 5 | 2.2 TanStack Query migration + 2.3 auth |
| 6 | 2.4 integrity + 3.1/3.2 page refactors |
| 7+ | 3.4 3D iterations + Phase 4 polish |

The single highest-leverage change is **Phase 2.1/2.2** — until data survives a refresh, everything else is polish on a demo.
