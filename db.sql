CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	username VARCHAR(50) NOT NULL,
	password VARCHAR(50) NOT NULL
);

CREATE TABLE goals (
	id SERIAL PRIMARY KEY,
	user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	dailyGoal VARCHAR(250),
	shortGoal VARCHAR(250),
	longGoal VARCHAR(250)
);

INSERT INTO users (username, password) VALUES ('Leo', '1234');
INSERT INTO goals (user_id, dailyGoal) VALUES (1, 'Learn about foreign and primary keys in postgres');
INSERT INTO goals (user_id, shortGoal) VALUES (1, 'Finish my parts in ITI 200 final project');
INSERT INTO goals (user_id, longGoal) VALUES (1, 'Graduate from UMFlint');

/* inputedData Tables */

CREATE TABLE habits (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(100),
    sleep_hours INTEGER,
    credit_hours INTEGER,
    study_hours INTEGER,
    exercise_hours INTEGER,
    screen_time INTEGER,
    habit_ranking TEXT, 
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO habits (user_name, sleep_hours, credit_hours, study_hours, exercise_hours, screen_time, habit_ranking) 
VALUES 
('Saibot', 7, 15, 3, 4, 5, 'sleep_hours, exercise_hours, study_hours, screen_time, credit_hours');	

