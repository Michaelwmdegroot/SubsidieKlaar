-- SubsidieReady 2026-11-14 MySQL/MariaDB staging pilot.
-- Run ONLY in the intended dedicated, EMPTY staging database via phpMyAdmin.
-- No tables outside this namespace are modified.
-- A single encrypted state row deliberately retains the current testrelease
-- OTP, session, ownership, optimistic revision and account-deletion invariants.
-- This is an interim storage adapter, NOT normalized accounts or CRM schema.

CREATE TABLE IF NOT EXISTS sr_next_state (
  id TINYINT UNSIGNED NOT NULL,
  encrypted_state LONGBLOB NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT sr_next_singleton CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO sr_next_state (id, encrypted_state) VALUES (1, X'')
ON DUPLICATE KEY UPDATE id = id;
