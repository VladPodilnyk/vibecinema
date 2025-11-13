CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(128) NOT NULL,
    overview TEXT NOT NULL,
    genre VARCHAR(32) NOT NULL, -- comma separated values
    release_year INTEGER NOT NULL,
    imdb_rating NUMERIC(2, 1) NOT NULL,
    poster_link VARCHAR(256) NOT NULL
);
