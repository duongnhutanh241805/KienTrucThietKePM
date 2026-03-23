CREATE DATABASE testdb;

\c testdb;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT
);

INSERT INTO users (name) VALUES ('Kien'), ('An'), ('Binh');