# Project memory

## Product intent & audience

- Medical appointments application (citas médicas) with role-based interfaces.
- Roles: patient, doctor, admin, secretary, and TV display (waiting-room screen).
- Multi-location support via `SedeConfig` ("sede" = branch/location).
- Includes a test/demo mode (modo de prueba).

## Brand personality & voice

- Communication in Spanish.

## Visual design & UX direction

- Role-segregated component folders (`components/patient/`, doctor, admin, secretary, television).
- Secretary calendar uses green for available days, grey for unavailable.
- `WaitingScreen` at project root (imports from `./context/...`) for waiting-room display.

## Decisions, constraints & rationale

- Stack: Vite + React + TypeScript.
- Backend: Supabase (auth + database), configured via `.env` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Files were reorganized from loose root into role/hook/util/context folders to match import paths.
- Main entry reconnected to source (was pointing to compiled output).
- `SedeConfig` type includes test-mode field.
- Date format is `YYYY-MM-DD` throughout; constructed with local time to avoid UTC timezone offset.
- `ensureWeekdaysScheduled` utility generates default availability: Mon–Fri (plus weekends if sede allows), 08:00–17:00, for 6 months ahead including today.
- On doctor creation (admin panel), default availability is auto-seeded to Supabase so Secretary calendar shows green immediately without the doctor configuring first.
- Auto-seed only fills days not already marked disabled; doctors can later toggle off days or time intervals.
- Type-checking (`tsc`) and build both pass.

## Open questions & assumptions

- Supabase storage usage (e.g., file uploads) not confirmed.
- Exact feature sets per role not fully mapped.
- Whether `SedeConfig` supports runtime switching or is compile-time only.
- Full dependency list beyond Vite/React/Supabase not yet documented.
- Existing doctors created before auto-seed may lack default availability; manual backfill may be needed.