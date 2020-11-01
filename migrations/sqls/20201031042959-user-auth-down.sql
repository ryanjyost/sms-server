ALTER TABLE users RENAME COLUMN phone TO phone_number;

ALTER TABLE logs RENAME COLUMN user_id TO phone_id;

ALTER TABLE users DROP COLUMN firebase_id;

ALTER TABLE users DROP COLUMN email;

ALTER TABLE users RENAME TO phone;

ALTER INDEX user_pkey RENAME TO phone_pkey;


