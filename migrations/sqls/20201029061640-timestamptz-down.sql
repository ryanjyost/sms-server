ALTER TABLE logs ALTER created TYPE timestamp USING created;
ALTER TABLE logs ALTER created SET DEFAULT current_timestamp;
ALTER TABLE logs ALTER updated TYPE timestamp USING created;
ALTER TABLE logs ALTER updated SET DEFAULT current_timestamp;

ALTER TABLE phone ALTER created TYPE timestamp USING created;
ALTER TABLE phone ALTER created SET DEFAULT current_timestamp;
ALTER TABLE phone ALTER updated TYPE timestamp USING created;
ALTER TABLE phone ALTER updated SET DEFAULT current_timestamp;
