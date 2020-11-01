ALTER TABLE phone RENAME COLUMN phone_number TO phone;

ALTER TABLE logs RENAME COLUMN phone_id TO user_id;

ALTER TABLE phone ADD COLUMN firebase_id text;

ALTER TABLE phone ADD COLUMN email text;

-- dont need jyust yet
--CREATE UNIQUE INDEX firebase_id_unique ON phone (firebase_id);

ALTER TABLE phone RENAME TO users;

ALTER INDEX phone_pkey RENAME TO user_pkey;
