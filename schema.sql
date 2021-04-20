DROP TABLE IF EXISTS quote;

CREATE TABLE quote(
    id SERIAL PRIMARY KEY,
    charactere VARCHAR(255),
    quote VARCHAR(255),
    characterDirection VARCHAR(255),
    image_url VARCHAR(255)
)