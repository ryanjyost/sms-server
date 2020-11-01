ALTER TABLE users RENAME COLUMN phone TO phone_number;

ALTER TABLE logs RENAME COLUMN user_id TO phone_id;

ALTER TABLE users DROP COLUMN firebase_id;

ALTER TABLE users DROP COLUMN email;

DROP INDEX lower_case_log_text;

ALTER TABLE users RENAME TO phone;
