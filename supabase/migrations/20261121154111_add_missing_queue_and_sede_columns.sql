/*
# Add missing columns for queue state and sede config

1. Plain-English summary
   The application reads and writes several fields that do not exist yet in
   this fresh database. This migration adds them so that saving admin
   parameters and queue updates stop failing silently. It also seeds the
   single `sede_config` row if it does not exist.

2. Modified tables
   - `sede_config`: adds `updated_at` (timestamp, default now) — the admin
     panel and test-mode switches write this on every save.
   - `queue_state`: adds `next_ticket_number` (integer, default 1),
     `attended_count` (integer, default 0) and `total_consultation_minutes`
     (integer, default 0) — used for ticket numbering and wait estimates.

3. Security
   - No policy changes: existing RLS policies already cover the new columns.

4. Notes
   - Statements are idempotent (safe to re-run).
*/

ALTER TABLE sede_config ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE queue_state ADD COLUMN IF NOT EXISTS next_ticket_number integer NOT NULL DEFAULT 1;
ALTER TABLE queue_state ADD COLUMN IF NOT EXISTS attended_count integer NOT NULL DEFAULT 0;
ALTER TABLE queue_state ADD COLUMN IF NOT EXISTS total_consultation_minutes integer NOT NULL DEFAULT 0;

INSERT INTO queue_state (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
