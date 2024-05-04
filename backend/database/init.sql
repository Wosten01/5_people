CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    fio TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    rank INTEGER
);

CREATE TABLE requests (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    geo TEXT,
    img TEXT,
    status INTEGER,
    user_id INTEGER REFERENCES users(id)
);


CREATE TABLE achievements ( 
    id SERIAL PRIMARY KEY,
    reports INTEGER,
    completes INTEGER,
    user_id INTEGER REFERENCES users(id)
);