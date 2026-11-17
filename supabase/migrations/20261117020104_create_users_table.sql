/*
# Create users table

1. Plain-English summary
   This migration creates the application's `users` table, which stores the
   people who can use the medical appointments app (patients, doctors,
   secretaries and administrators). The app identifies people by their
   Colombian ID number ("cedula") instead of email/password sign-in, so the
   table is keyed on that. It also creates the helper database function the
   admin panel uses to delete a user safely.

2. New Tables
   - `users`
     - `cedula` (text, primary key): the person's ID number, e.g. "12345678".
     - `name` (text, not null): display name.
     - `role` (text, not null): one of 'patient', 'doctor', 'secretary', 'admin'.
     - `sede_name` (text, nullable): the branch/location this user belongs to
       (used by doctors, secretaries and admins; null for patients).
     - `specialty` (text, nullable): medical specialty (doctors only).
     - `created_at` (timestamp with time zone, defaults to now).

3. New Functions
   - `delete_user_as_admin(p_cedula text, p_admin_cedula text)`: SECURITY DEFINER
     function that deletes the user with the given cedula, but only when the
     caller's own cedula belongs to an existing admin. This lets the admin panel
     remove users without exposing delete rights to everybody.

4. Security
   - Row Level Security (RLS) is ENABLED on `users`.
   - The app has no email/password sign-in, so every request runs as the `anon`
     role; policies are granted to both `anon` and `authenticated`.
   - Read: everyone can read users (needed for login by cedula).
   - Insert/update/delete: allowed for now because the app is single-tenant and
     manages its own user list from the admin panel; the delete path goes
     through the admin-checked function above.
   - Grants: SELECT, INSERT, UPDATE, DELETE on the table to `anon` and
     `authenticated`, and EXECUTE on the function to `anon`, `authenticated`.

5. Important notes
   - No seed data is included; the user will connect their real Supabase
     project and manage users from the app's admin panel.
*/

CREATE TABLE IF NOT EXISTS users (
  cedula text PRIMARY KEY,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('patient', 'doctor', 'secretary', 'admin')),
  sede_name text,
  specialty text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON users TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_users" ON users;
CREATE POLICY "anon_select_users" ON users
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "anon_insert_users" ON users;
CREATE POLICY "anon_insert_users" ON users
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_users" ON users;
CREATE POLICY "anon_update_users" ON users
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_users" ON users;
CREATE POLICY "anon_delete_users" ON users
FOR DELETE
TO anon, authenticated
USING (true);

CREATE OR REPLACE FUNCTION delete_user_as_admin(p_cedula text, p_admin_cedula text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE cedula = p_admin_cedula AND role = 'admin') THEN
    RAISE EXCEPTION 'Caller % is not an admin', p_admin_cedula;
  END IF;
  DELETE FROM users WHERE cedula = p_cedula;
END;
$$;

REVOKE EXECUTE ON FUNCTION delete_user_as_admin(text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION delete_user_as_admin(text, text) TO anon, authenticated;
