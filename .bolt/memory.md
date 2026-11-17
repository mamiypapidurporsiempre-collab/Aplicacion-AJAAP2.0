# Project memory

## Product intent & audience

- Medical appointments application (citas médicas) with role-based interfaces.
- Roles: patient, doctor, admin, secretary, and TV display (likely waiting-room screen).
- Multi-location support via `SedeConfig` ("sede" = branch/location).
- Includes a test/demo mode (modo de prueba).

## Brand personality & voice

- Communication in Spanish.

## Visual design & UX direction

- Role-segregated component folders (`components/patient/`, doctor, admin, secretary, television).
- `WaitingScreen` component exists at project root (imports from `./context/...`).
- TV view likely for waiting-room display screens.

## Decisions, constraints & rationale

- Stack: Vite + React + TypeScript.
- Backend: Supabase, configured via `.env` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- File structure matters: imported project had all files loose in root; code expects organized folder hierarchy (components by role, hooks, utilities, context). Files were moved to match import paths.
- Main page entry was incorrectly pointing to compiled output; reconnected to source files.
- `SedeConfig` type required a missing field (test mode) to satisfy TypeScript types; fixed.
- Type-checking (`tsc`) and build both pass.

## Open questions & assumptions

- Supabase usage scope (auth only vs. database/storage) not fully confirmed.
- Exact feature sets per role not yet mapped.
- Whether `SedeConfig` supports runtime switching or is compile-time only.
- Full dependency list beyond Vite/React/Supabase not yet documented.