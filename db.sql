CREATE TABLE users (
    id serial PRIMARY KEY,
    username varchar NOT NULL,
    password varchar NOT NULL
);

CREATE TABLE students (
    id serial PRIMARY KEY,
    name varchar NOT NULL,
    generation int NOT NULL,
    present boolean DEFAULT false NOT NULL
);