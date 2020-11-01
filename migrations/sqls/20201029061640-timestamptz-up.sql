ALTER TABLE logs ALTER created TYPE timestamptz USING created AT TIME ZONE 'UTC';
ALTER TABLE logs ALTER created SET DEFAULT now();
ALTER TABLE logs ALTER updated TYPE timestamptz USING created AT TIME ZONE 'UTC';
ALTER TABLE logs ALTER updated SET DEFAULT now();

ALTER TABLE phone ALTER created TYPE timestamptz USING created AT TIME ZONE 'UTC';
ALTER TABLE phone ALTER created SET DEFAULT now();
ALTER TABLE phone ALTER updated TYPE timestamptz USING created AT TIME ZONE 'UTC';
ALTER TABLE phone ALTER updated SET DEFAULT now();
