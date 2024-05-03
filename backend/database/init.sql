USE Trash;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    fio TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    rank INTEGER
);

CREATE TABLE IF NOT EXISTS requests (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    geo TEXT,
    img TEXT,
    status INTEGER,
    user_id INTEGER REFERENCES users(id)
);
